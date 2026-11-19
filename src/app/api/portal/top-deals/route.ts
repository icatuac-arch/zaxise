import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ deals: [] })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get the latest feed date
  const { data: feedData } = await supabase
    .from('tech_deals_feeds')
    .select('feed_date')
    .order('feed_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!feedData) {
    return NextResponse.json({ deals: [] })
  }

  // Get top 6 deals by tier
  const { data: deals } = await supabase
    .from('tech_deals')
    .select('id, product_name, brand, retailer, category, product_url, image_url, price_current, price_list, discount_pct, is_historical_low, tier')
    .eq('feed_date', feedData.feed_date)
    .order('tier', { ascending: true })
    .order('discount_pct', { ascending: false })
    .limit(6)

  return NextResponse.json({ deals: deals || [] })
}
