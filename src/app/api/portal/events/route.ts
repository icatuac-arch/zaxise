import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const metro = request.nextUrl.searchParams.get('metro') || ''
  const category = request.nextUrl.searchParams.get('category') || ''
  const language = request.nextUrl.searchParams.get('language') || ''
  const dateFrom = request.nextUrl.searchParams.get('dateFrom') || ''
  const dateTo = request.nextUrl.searchParams.get('dateTo') || ''
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get('limit') || '10'),
    30
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
    .select('id, title, date, time, venue, city, state, metro_region, category, language, price, image_url')
    .eq('status', 'published')
    .is('deleted_at', null)
    .gte('date', dateFrom || today)
    .order('date', { ascending: true })
    .limit(limit)

  if (metro) query = query.eq('metro_region', metro)
  if (category) query = query.eq('category', category)
  if (language) query = query.eq('language', language)
  if (dateTo) query = query.lte('date', dateTo)

  const { data, error } = await query

  if (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ events: [] })
  }

  const events = (data || []).map(e => ({
    ...e,
    metro_area: e.metro_region,
    short_id: e.id,
  }))

  return NextResponse.json({
    events,
    metro: metro || 'all',
  })
}
