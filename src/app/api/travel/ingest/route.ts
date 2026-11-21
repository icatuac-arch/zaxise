import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const VALID_TYPES = ['country', 'city', 'attraction']

// Fields allowed per entity type (for validation + selective merge)
const TYPE_FIELDS: Record<string, string[]> = {
  country: [
    'name', 'hero_image_url', 'card_image_url', 'image_alt', 'essentials',
    'counts', 'best_time_to_visit', 'avg_daily_budget_usd', 'description',
  ],
  city: [
    'name', 'country_id', 'hero_image_url', 'card_image_url', 'image_alt',
    'description', 'hotel_price_bands_usd', 'avg_daily_budget_usd', 'counts',
  ],
  attraction: [
    'name', 'city_id', 'image_url', 'image_alt', 'description',
    'entry_fee', 'opening_hours', 'top_rank',
  ],
}

interface EntityPayload {
  type: string
  id: string
  [key: string]: any
}

interface EntityResult {
  id: string
  status: 'accepted' | 'rejected'
  reason?: string
}

async function validateImageUrl(url: string): Promise<boolean> {
  if (!url) return true // empty = not updating image
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
    if (!res.ok) return false
    const ct = res.headers.get('content-type') || ''
    return ct.startsWith('image/')
  } catch {
    return false
  }
}

function validateEntity(entity: EntityPayload): string | null {
  if (!entity.id || typeof entity.id !== 'string') return 'missing or invalid id'
  if (!entity.type || !VALID_TYPES.includes(entity.type)) return `invalid type: ${entity.type}`

  // Validate ID format matches type
  const prefix = entity.type + ':'
  if (!entity.id.startsWith(prefix)) return `id must start with "${prefix}" for type ${entity.type}`

  // Cities must reference a parent country
  if (entity.type === 'city' && entity.country_id && !entity.country_id.startsWith('country:')) {
    return 'country_id must start with "country:"'
  }

  // Attractions must reference a parent city
  if (entity.type === 'attraction' && entity.city_id && !entity.city_id.startsWith('city:')) {
    return 'city_id must start with "city:"'
  }

  return null
}

export async function PUT(request: NextRequest) {
  // Authenticate
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  // Parse body
  let body: { feed?: string; generated_at?: string; entities?: EntityPayload[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.entities || !Array.isArray(body.entities) || body.entities.length === 0) {
    return NextResponse.json({ ok: false, error: 'Missing or empty entities[]' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const results: EntityResult[] = []
  let accepted = 0
  let rejected = 0

  for (const entity of body.entities) {
    // Validate entity structure
    const validationError = validateEntity(entity)
    if (validationError) {
      results.push({ id: entity.id || '(no id)', status: 'rejected', reason: validationError })
      rejected++
      continue
    }

    // Validate image URLs if present
    const imageFields = ['hero_image_url', 'card_image_url', 'image_url']
    let imageRejected = false
    for (const field of imageFields) {
      if (entity[field]) {
        const valid = await validateImageUrl(entity[field])
        if (!valid) {
          results.push({
            id: entity.id,
            status: 'rejected',
            reason: `${field} unreachable or not an image (${entity[field]})`,
          })
          rejected++
          imageRejected = true
          break
        }
      }
    }
    if (imageRejected) continue

    // Build the update payload — only include fields that are present in the push
    const allowedFields = TYPE_FIELDS[entity.type] || []
    const updatePayload: Record<string, any> = {
      entity_type: entity.type,
      updated_at: new Date().toISOString(),
      pushed_by: 'gundya',
    }

    // Parent ID mapping
    if (entity.type === 'city' && entity.country_id) {
      updatePayload.parent_id = entity.country_id
    } else if (entity.type === 'attraction' && entity.city_id) {
      updatePayload.parent_id = entity.city_id
    }

    const updatedFields: string[] = []
    for (const field of allowedFields) {
      if (entity[field] !== undefined) {
        // JSONB fields
        if (['counts', 'avg_daily_budget_usd', 'hotel_price_bands_usd', 'entry_fee'].includes(field)) {
          updatePayload[field] = entity[field]
        } else {
          updatePayload[field] = entity[field]
        }
        updatedFields.push(field)
      }
    }

    if (updatedFields.length === 0 && !entity.name) {
      results.push({ id: entity.id, status: 'rejected', reason: 'no updatable fields in push' })
      rejected++
      continue
    }

    // Upsert — insert if new, merge fields if existing
    const { error: upsertError } = await supabase
      .from('travel_entities')
      .upsert(
        { id: entity.id, ...updatePayload },
        { onConflict: 'id' }
      )

    if (upsertError) {
      results.push({ id: entity.id, status: 'rejected', reason: upsertError.message })
      rejected++
      continue
    }

    // Increment push_count for existing entities
    await supabase.rpc('increment_push_count', { entity_id: entity.id }).catch(() => {
      // Non-fatal — rpc may not exist yet
    })

    // Log the push
    await supabase.from('travel_feed_log').insert({
      entity_id: entity.id,
      fields_updated: updatedFields,
      pushed_by: 'gundya',
    }).catch(() => {})

    results.push({ id: entity.id, status: 'accepted' })
    accepted++
  }

  return NextResponse.json({
    ok: true,
    accepted,
    rejected,
    results,
  })
}
