import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Public entity detail — returns published fields only (no audit/draft data)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const entityId = decodeURIComponent(id)

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('travel_entities')
    .select('*')
    .eq('id', entityId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: 'Entity not found' }, { status: 404 })
  }

  // Return public-safe fields only (no push_count, pushed_by, etc.)
  const publicEntity = {
    id: data.id,
    type: data.entity_type,
    parent_id: data.parent_id,
    name: data.name,
    hero_image_url: data.hero_image_url,
    card_image_url: data.card_image_url,
    image_url: data.image_url,
    image_alt: data.image_alt,
    description: data.description,
    essentials: data.essentials,
    counts: data.counts,
    avg_daily_budget_usd: data.avg_daily_budget_usd,
    hotel_price_bands_usd: data.hotel_price_bands_usd,
    entry_fee: data.entry_fee,
    opening_hours: data.opening_hours,
    top_rank: data.top_rank,
    best_time_to_visit: data.best_time_to_visit,
    updated_at: data.updated_at,
  }

  return NextResponse.json({
    ok: true,
    entity: publicEntity,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
