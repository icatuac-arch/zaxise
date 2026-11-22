import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  // Authenticate
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const id = request.nextUrl.searchParams.get('id')
  const type = request.nextUrl.searchParams.get('type')

  // Single entity lookup
  if (id) {
    const { data, error } = await supabase
      .from('travel_entities')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: 'unknown entity' }, { status: 404 })
    }

    // Return fields that have been set (non-null)
    const fields: Record<string, any> = {}
    const feedFields = [
      'name', 'hero_image_url', 'card_image_url', 'image_url', 'image_alt',
      'description', 'essentials', 'counts', 'avg_daily_budget_usd',
      'hotel_price_bands_usd', 'entry_fee', 'opening_hours', 'top_rank',
      'best_time_to_visit', 'parent_id', 'city_id', 'country_id',
      // Indian-traveler fields
      'visa_info', 'direct_flights', 'inr_budget', 'indian_restaurants',
      'indian_groceries', 'vegetarian_info', 'jain_info', 'family_notes',
      'senior_notes', 'indian_neighborhood', 'currency_info', 'safety_info',
      'language_tips', 'sim_esim', 'plug_type',
    ]

    for (const field of feedFields) {
      if (data[field] !== null && data[field] !== undefined) {
        fields[field] = data[field]
      }
    }

    return NextResponse.json({
      id: data.id,
      entity_type: data.entity_type,
      updated_at: data.updated_at,
      push_count: data.push_count,
      fields,
    })
  }

  // List entities by type
  if (type) {
    const validTypes = ['country', 'city', 'attraction']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { ok: false, error: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('travel_entities')
      .select('id, name, entity_type, updated_at, push_count, hero_image_url, card_image_url, image_url')
      .eq('entity_type', type)
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    const entities = (data || []).map(e => ({
      id: e.id,
      name: e.name,
      updated_at: e.updated_at,
      push_count: e.push_count,
      has_image: !!(e.hero_image_url || e.card_image_url || e.image_url),
    }))

    return NextResponse.json({
      ok: true,
      type,
      count: entities.length,
      entities,
    })
  }

  return NextResponse.json(
    { ok: false, error: 'Provide ?id=<entity-id> or ?type=<entity-type>' },
    { status: 400 }
  )
}
