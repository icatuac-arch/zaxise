import { NextRequest, NextResponse } from 'next/server'
import { generateApiKey, hashApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// One-time key generation endpoint
// Protected by a master secret — only used during setup
export async function POST(request: NextRequest) {
  const masterKey = request.headers.get('x-master-key')

  if (!masterKey || masterKey !== process.env.DEALS_MASTER_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { label?: string } = {}
  try {
    body = await request.json()
  } catch {
    // empty body is ok
  }

  const plainKey = generateApiKey()
  const keyHash = hashApiKey(plainKey)

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('api_keys').insert({
    key_hash: keyHash,
    label: body.label || 'gundya-deals-feed',
  })

  if (error) {
    return NextResponse.json(
      { error: `Failed to store key: ${error.message}` },
      { status: 500 }
    )
  }

  // Return plaintext key ONCE — it is never stored or retrievable again
  return NextResponse.json({
    ok: true,
    api_key: plainKey,
    label: body.label || 'gundya-deals-feed',
    note: 'Save this key now. It cannot be retrieved again. Use it in the X-API-Key header.',
  })
}
