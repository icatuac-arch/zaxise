import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Category display order (Phones always first per spec §4)
const CATEGORY_ORDER = [
  'Phones',
  'TVs',
  'Audio',
  'Laptops',
  'Cameras & Drones',
  'Gaming',
  'Monitors',
  'Wearables',
  'Tablets & E-readers',
  'Smart Home',
  'Home Security',
  'Storage',
  'Power & Charging',
  'Accessories',
  'Home Appliances',
]

interface DealPayload {
  product_name: string
  brand: string
  model: string
  category: string
  retailer: string
  product_url: string
  image?: string
  image_url?: string
  price_current: number
  price_list: number
  price_previous: number
  discount_pct: number
  price_90d_low: number | null
  is_historical_low: boolean
  shipping_cost?: number | null
  shipping_note?: string | null
  price_total?: number | null
  in_stock: boolean
  stock_note: string
  first_posted_at: string
  last_verified_at: string
  deal_note: string
  tier: number
  at_or_below_trigger: boolean
  source_page: string
}

interface FeedPayload {
  date: string
  generated_at: string
  deals: DealPayload[]
}

function validateDeal(deal: DealPayload, index: number): string | null {
  if (!deal.product_name) return `Deal #${index}: missing product_name`
  if (!deal.category) return `Deal #${index}: missing category`
  if (!deal.retailer) return `Deal #${index}: missing retailer`
  if (!deal.product_url) return `Deal #${index}: missing product_url`
  if (deal.price_current === undefined || deal.price_current === null)
    return `Deal #${index}: missing price_current`

  // §5 rule 3: Image for every deal — no image → reject
  const imageUrl = deal.image_url || ''
  if (!imageUrl.trim()) {
    return `Deal #${index} (${deal.product_name}): missing image_url — deal rejected per spec`
  }

  return null
}

export async function PUT(request: NextRequest) {
  // Authenticate
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: 401 }
    )
  }

  // Parse body
  let body: FeedPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  // Validate top-level
  if (!body.date || !body.deals || !Array.isArray(body.deals)) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields: date, deals[]' },
      { status: 400 }
    )
  }

  const feedDate = body.date // e.g. "2026-11-18"

  // Validate and filter deals
  const accepted: DealPayload[] = []
  const rejected: { index: number; name: string; reason: string }[] = []

  for (let i = 0; i < body.deals.length; i++) {
    const deal = body.deals[i]
    const error = validateDeal(deal, i)
    if (error) {
      rejected.push({
        index: i,
        name: deal.product_name || `(unnamed deal #${i})`,
        reason: error,
      })
    } else {
      accepted.push(deal)
    }
  }

  if (accepted.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'No valid deals in feed',
        rejected,
      },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  // §2: Full-board replace — delete all deals for this feed date, then insert
  // This makes re-pushes idempotent
  const { error: deleteError } = await supabase
    .from('tech_deals')
    .delete()
    .eq('feed_date', feedDate)

  if (deleteError) {
    return NextResponse.json(
      { ok: false, error: `Failed to clear previous feed: ${deleteError.message}` },
      { status: 500 }
    )
  }

  // Insert accepted deals
  const rows = accepted.map((deal) => ({
    feed_date: feedDate,
    product_name: deal.product_name,
    brand: deal.brand || '',
    model: deal.model || '',
    category: deal.category,
    retailer: deal.retailer,
    product_url: deal.product_url,
    image_url: deal.image_url || '',
    price_current: deal.price_current,
    price_list: deal.price_list || 0,
    price_previous: deal.price_previous || 0,
    discount_pct: deal.discount_pct || 0,
    price_90d_low: deal.price_90d_low,
    is_historical_low: deal.is_historical_low || false,
    shipping_cost: deal.shipping_cost ?? null,
    shipping_note: deal.shipping_note ?? null,
    price_total: deal.price_total ?? null,
    in_stock: deal.in_stock !== false,
    stock_note: deal.stock_note || '',
    first_posted_at: deal.first_posted_at || null,
    last_verified_at: deal.last_verified_at || null,
    deal_note: deal.deal_note || '',
    tier: deal.tier || 5,
    at_or_below_trigger: deal.at_or_below_trigger || false,
    source_page: deal.source_page || '',
  }))

  const { error: insertError } = await supabase
    .from('tech_deals')
    .insert(rows)

  if (insertError) {
    return NextResponse.json(
      { ok: false, error: `Failed to insert deals: ${insertError.message}` },
      { status: 500 }
    )
  }

  // Upsert feed metadata
  const { error: feedError } = await supabase
    .from('tech_deals_feeds')
    .upsert(
      {
        feed_date: feedDate,
        deal_count: accepted.length,
        rejected_count: rejected.length,
        pushed_at: new Date().toISOString(),
        pushed_by: 'gundya',
      },
      { onConflict: 'feed_date' }
    )

  if (feedError) {
    console.error('Failed to update feed metadata:', feedError)
    // Non-fatal — deals are already inserted
  }

  return NextResponse.json({
    ok: true,
    received: accepted.length,
    rejected: rejected.length,
    rejected_details: rejected.length > 0 ? rejected : undefined,
    feed_date: feedDate,
  })
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Use PUT to push the daily deals feed' },
    { status: 405 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use PUT to push the daily deals feed' },
    { status: 405 }
  )
}
