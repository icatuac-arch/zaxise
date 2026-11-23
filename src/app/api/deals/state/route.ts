import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const id = request.nextUrl.searchParams.get('id')
  const type = request.nextUrl.searchParams.get('type')

  // Single deal lookup by ID
  if (id) {
    const { data, error } = await supabase
      .from('tech_deals')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ ok: false, error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, deal: data })
  }

  // List all live deal IDs with last_verified_at
  if (type === 'deal') {
    // Find the latest feed_date to identify "live" deals
    const { data: latestFeed, error: feedError } = await supabase
      .from('tech_deals')
      .select('feed_date')
      .order('feed_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (feedError) {
      return NextResponse.json({ ok: false, error: feedError.message }, { status: 500 })
    }
    if (!latestFeed) {
      return NextResponse.json({ ok: true, count: 0, deals: [] })
    }

    const { data, error } = await supabase
      .from('tech_deals')
      .select('id, product_name, category, retailer, last_verified_at, feed_date')
      .eq('feed_date', latestFeed.feed_date)
      .order('category')

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      feed_date: latestFeed.feed_date,
      count: (data || []).length,
      deals: data || [],
    })
  }

  return NextResponse.json(
    { ok: false, error: 'Provide ?id=<deal-id> or ?type=deal' },
    { status: 400 }
  )
}
