import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  // --- Deals ---
  // Find the latest feed_date, then count deals on that date
  const { data: latestFeed } = await supabase
    .from('tech_deals')
    .select('feed_date')
    .order('feed_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  let dealsLive = 0
  let dealsLastIngest: string | null = null

  if (latestFeed?.feed_date) {
    const { count } = await supabase
      .from('tech_deals')
      .select('id', { count: 'exact', head: true })
      .eq('feed_date', latestFeed.feed_date)

    dealsLive = count ?? 0

    // Get the latest pushed_at from the feeds metadata table
    const { data: feedMeta } = await supabase
      .from('tech_deals_feeds')
      .select('pushed_at')
      .eq('feed_date', latestFeed.feed_date)
      .maybeSingle()

    dealsLastIngest = feedMeta?.pushed_at ?? latestFeed.feed_date
  }

  // --- Internships ---
  const { count: internshipsLive } = await supabase
    .from('internships')
    .select('id', { count: 'exact', head: true })
    .is('retired_at', null)

  const { data: internLatest } = await supabase
    .from('internships')
    .select('updated_at')
    .is('retired_at', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // --- Travel ---
  // Count per entity type in parallel
  const [countries, cities, attractions] = await Promise.all([
    supabase.from('travel_entities').select('id', { count: 'exact', head: true }).eq('type', 'country'),
    supabase.from('travel_entities').select('id', { count: 'exact', head: true }).eq('type', 'city'),
    supabase.from('travel_entities').select('id', { count: 'exact', head: true }).eq('type', 'attraction'),
  ])

  const travelStats: { countries: number; cities: number; attractions: number; last_ingest_at: string | null } = {
    countries: countries.count ?? 0,
    cities: cities.count ?? 0,
    attractions: attractions.count ?? 0,
    last_ingest_at: null,
  }

  // Get max(updated_at) for travel
  const { data: travelLatest } = await supabase
    .from('travel_entities')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  travelStats.last_ingest_at = travelLatest?.updated_at ?? null

  return NextResponse.json({
    ok: true,
    deals: {
      live: dealsLive,
      last_ingest_at: dealsLastIngest,
    },
    internships: {
      live: internshipsLive ?? 0,
      last_ingest_at: internLatest?.updated_at ?? null,
    },
    travel: travelStats,
  })
}
