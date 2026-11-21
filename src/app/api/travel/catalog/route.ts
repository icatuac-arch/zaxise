import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Public published catalog — browse travel entities with filters
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || ''
  const region = request.nextUrl.searchParams.get('region') || ''
  const tags = request.nextUrl.searchParams.get('tags') || ''
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '50'), 200)
  const cursor = request.nextUrl.searchParams.get('cursor') || ''

  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('travel_entities')
    .select('id, entity_type, parent_id, name, hero_image_url, card_image_url, image_url, image_alt, description, counts, avg_daily_budget_usd, best_time_to_visit, top_rank, updated_at')
    .order('name', { ascending: true })
    .limit(limit)

  if (type) query = query.eq('entity_type', type)
  if (region) query = query.ilike('id', `%${region}%`)
  if (cursor) query = query.gt('name', cursor)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const entities = data || []
  const nextCursor = entities.length === limit ? entities[entities.length - 1]?.name : null

  return NextResponse.json({
    ok: true,
    schema_version: 1,
    count: entities.length,
    next_cursor: nextCursor,
    entities,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
