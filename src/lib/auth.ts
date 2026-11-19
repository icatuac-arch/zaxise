import crypto from 'crypto'
import { getSupabaseAdmin } from './supabase/admin'

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000

export function hashApiKey(plaintext: string): string {
  return crypto.createHash('sha256').update(plaintext).digest('hex')
}

export function generateApiKey(): string {
  const bytes = crypto.randomBytes(32)
  return 'zxk_' + bytes.toString('base64url')
}

export async function validateApiKey(
  request: Request
): Promise<{ valid: boolean; error?: string; keyId?: string }> {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return { valid: false, error: 'Missing X-API-Key header' }
  }

  // Rate limit check
  const keyHash = hashApiKey(apiKey)
  const now = Date.now()
  const limiter = rateLimitMap.get(keyHash)

  if (limiter) {
    if (now > limiter.resetAt) {
      rateLimitMap.set(keyHash, { count: 1, resetAt: now + RATE_WINDOW_MS })
    } else if (limiter.count >= RATE_LIMIT) {
      return { valid: false, error: 'Rate limit exceeded (60 req/min)' }
    } else {
      limiter.count++
    }
  } else {
    rateLimitMap.set(keyHash, { count: 1, resetAt: now + RATE_WINDOW_MS })
  }

  // Validate against database
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, revoked_at')
    .eq('key_hash', keyHash)
    .maybeSingle()

  if (error || !data) {
    return { valid: false, error: 'Invalid API key' }
  }

  if (data.revoked_at) {
    return { valid: false, error: 'API key has been revoked' }
  }

  return { valid: true, keyId: data.id }
}
