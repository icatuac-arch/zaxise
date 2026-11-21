import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Public search — find countries, cities, attractions by name
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() || ''
  const type = request.nextUrl.searchParams.get('type') || ''
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '20'), 50)

  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, results: [], query: q })
  }

  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('travel_entities')
    .select('id, entity_type, parent_id, name, card_image_url, hero_image_url, image_url, image_alt, description')
    .ilike('name', `%${q}%`)
    .order('entity_type', { ascending: true }) // countries first, then cities, then attractions
    .limit(limit)

  if (type) query = query.eq('entity_type', type)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  // Build results with destination URLs
  const results = (data || []).map(entity => {
    let href = '/travel'
    if (entity.entity_type === 'country') {
      href = `/travel/country/${entity.id.replace('country:', '')}`
    } else if (entity.entity_type === 'city') {
      const parts = entity.id.replace('city:', '').split('/')
      href = `/travel/country/${parts[0]}`
    } else if (entity.entity_type === 'attraction') {
      const parts = entity.id.replace('attraction:', '').split('/')
      href = `/travel/country/${parts[0]}`
    }

    return {
      id: entity.id,
      type: entity.entity_type,
      name: entity.name,
      description: entity.description,
      image_url: entity.card_image_url || entity.hero_image_url || entity.image_url,
      image_alt: entity.image_alt,
      href,
    }
  })

  return NextResponse.json({
    ok: true,
    query: q,
    count: results.length,
    results,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
