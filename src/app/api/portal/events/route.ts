import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fetch upcoming events from IndianPrograms' Supabase (shared instance)
// filtered by metro area
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

  let query = supabase
    .from('events')
    .select('id, title, date, time, venue, city, state, metro_area, category, price, image_url, slug, short_id')
    .eq('status', 'published')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(limit)

  if (metro) {
    query = query.eq('metro_area', metro)
  }

  const { data, error } = await query

  if (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ events: [] })
  }

  return NextResponse.json({
    events: data || [],
    metro: metro || 'all',
  })
}
