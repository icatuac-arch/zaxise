import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const VALID_TYPES = ['country', 'city', 'attraction']

// Fields allowed per entity type (for validation + selective merge)
const TYPE_FIELDS: Record<string, string[]> = {
  country: [
    'name', 'hero_image_url', 'card_image_url', 'image_alt', 'essentials',
    'counts', 'best_time_to_visit', 'avg_daily_budget_usd', 'description',
    'country_id',
    // Indian-traveler fields (both Gundya's names and DB column names accepted)
    'visa_info', 'direct_flights', 'inr_budget', 'indian_restaurants',
    'indian_groceries', 'vegetarian_info', 'jain_info', 'family_notes',
    'senior_notes', 'indian_neighborhood', 'currency_info', 'safety_info',
    'language_tips', 'sim_esim', 'plug_type',
    // Gundya's field names (mapped to columns in FIELD_ALIASES below)
    'visa_for_indian_passport', 'direct_flights_from_india',
    'best_time_from_india', 'currency_and_money', 'avg_daily_budget_inr',
  ],
  city: [
    'name', 'country_id', 'hero_image_url', 'card_image_url', 'image_alt',
    'description', 'hotel_price_bands_usd', 'avg_daily_budget_usd', 'counts',
    'city_id',
    // Indian-traveler fields
    'visa_info', 'direct_flights', 'inr_budget', 'indian_restaurants',
    'indian_groceries', 'vegetarian_info', 'jain_info', 'family_notes',
    'senior_notes', 'indian_neighborhood', 'currency_info', 'safety_info',
    'language_tips', 'sim_esim', 'plug_type',
    // Gundya's city field names
    'where_indians_stay', 'indian_food', 'avg_daily_budget_inr',
    'visa_for_indian_passport', 'direct_flights_from_india',
    'best_time_from_india', 'currency_and_money',
  ],
  attraction: [
    'name', 'city_id', 'country_id', 'image_url', 'image_alt', 'description',
    'entry_fee', 'opening_hours', 'top_rank',
  ],
}

// Map Gundya's field names → DB column names
const FIELD_ALIASES: Record<string, string> = {
  'visa_for_indian_passport': 'visa_info',
  'direct_flights_from_india': 'direct_flights',
  'best_time_from_india': 'best_time_to_visit',
  'currency_and_money': 'currency_info',
  'avg_daily_budget_inr': 'inr_budget',
  'where_indians_stay': 'indian_neighborhood',
  'indian_food': 'indian_restaurants',
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

    // Parent ID mapping (both parent_id and direct city_id/country_id columns)
    if (entity.type === 'city' && entity.country_id) {
      updatePayload.parent_id = entity.country_id
      updatePayload.country_id = entity.country_id
    } else if (entity.type === 'attraction') {
      if (entity.city_id) {
        updatePayload.parent_id = entity.city_id
        updatePayload.city_id = entity.city_id
      }
      if (entity.country_id) {
        updatePayload.country_id = entity.country_id
      }
    }

    // JSONB field names for proper handling
    const jsonbFields = new Set([
      'counts', 'avg_daily_budget_usd', 'hotel_price_bands_usd', 'entry_fee',
      'visa_info', 'direct_flights', 'inr_budget', 'currency_info',
    ])

    const updatedFields: string[] = []
    for (const field of allowedFields) {
      if (entity[field] !== undefined) {
        // Apply field alias if exists (Gundya name → DB column name)
        const dbColumn = FIELD_ALIASES[field] || field
        updatePayload[dbColumn] = entity[field]
        updatedFields.push(dbColumn)
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

    // Log the push (non-fatal if it fails)
    try {
      await supabase.from('travel_feed_log').insert({
        entity_id: entity.id,
        fields_updated: updatedFields,
        pushed_by: 'gundya',
      })
    } catch {
      // Non-fatal
    }

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
