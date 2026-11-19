import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fetch upcoming events from IndianPrograms' Supabase (shared instance)
export async function GET(request: NextRequest) {
  const metro = request.nextUrl.searchParams.get('metro') || ''
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get('limit') || '8'),
    20
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ events: [] })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('events')
    .select('id, title, date, time, venue, city, state, metro_region, category, price, image_url')
    .eq('status', 'published')
    .is('deleted_at', null)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit)

  if (metro) {
    query = query.eq('metro_region', metro)
  }

  const { data, error } = await query

  if (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ events: [] })
  }

  // Map metro_region to metro_area for the frontend
  const events = (data || []).map(e => ({
    ...e,
    metro_area: e.metro_region,
    slug: '',
    short_id: e.id,
  }))

  return NextResponse.json({
    events,
    metro: metro || 'all',
  })
}
