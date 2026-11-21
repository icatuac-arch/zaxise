import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Public homepage feed — curated travel cards for the ZAXISE main page
export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region') || ''
  const theme = request.nextUrl.searchParams.get('theme') || ''
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '6'), 12)

  const supabase = getSupabaseAdmin()

  // Get featured countries and cities with images
  const { data: countries } = await supabase
    .from('travel_entities')
    .select('id, name, card_image_url, hero_image_url, image_alt, description, best_time_to_visit, avg_daily_budget_usd, updated_at')
    .eq('entity_type', 'country')
    .not('card_image_url', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  const { data: cities } = await supabase
    .from('travel_entities')
    .select('id, parent_id, name, card_image_url, hero_image_url, image_alt, description, avg_daily_budget_usd, updated_at')
    .eq('entity_type', 'city')
    .not('hero_image_url', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  // Build feed items from both countries and cities
  const items: any[] = []

  for (const c of countries || []) {
    const slug = c.id.replace('country:', '')
    items.push({
      id: `travelcard:${slug}`,
      entity_id: c.id,
      title: `Explore ${c.name}`,
      description: c.description || `Discover ${c.name}`,
      image_url: c.card_image_url || c.hero_image_url,
      image_alt: c.image_alt || c.name,
      href: `/travel/country/${slug}`,
      category: 'destination',
      tags: ['country'],
      is_sponsored: false,
      updated_at: c.updated_at,
    })
  }

  for (const c of cities || []) {
    const citySlug = c.id.replace('city:', '')
    const [countryPart, cityPart] = citySlug.split('/')
    items.push({
      id: `travelcard:${citySlug}`,
      entity_id: c.id,
      title: `Discover ${c.name}`,
      description: c.description || `Visit ${c.name}`,
      image_url: c.hero_image_url || c.card_image_url,
      image_alt: c.image_alt || c.name,
      href: `/travel/country/${countryPart}`,
      category: 'destination',
      tags: ['city'],
      is_sponsored: false,
      updated_at: c.updated_at,
    })
  }

  // Sort by most recently updated, limit
  items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  // If no feed-backed items, return static editorial fallbacks
  const finalItems = items.length > 0 ? items.slice(0, limit) : [
    {
      id: 'travelcard:india', entity_id: 'country:india',
      title: 'Explore India', description: 'Temples, food, culture and incredible diversity',
      image_url: null, image_alt: 'India', href: '/travel/country/india',
      category: 'destination', tags: ['country', 'featured'], is_sponsored: false,
    },
    {
      id: 'travelcard:japan', entity_id: 'country:japan',
      title: 'Discover Japan', description: 'Ancient traditions meet cutting-edge technology',
      image_url: null, image_alt: 'Japan', href: '/travel/country/japan',
      category: 'destination', tags: ['country', 'featured'], is_sponsored: false,
    },
    {
      id: 'travelcard:weekend', entity_id: null,
      title: 'Weekend Escapes', description: 'Quick getaways near your city',
      image_url: null, image_alt: 'Weekend escape', href: '/travel/destinations',
      category: 'guide', tags: ['weekend'], is_sponsored: false,
    },
    {
      id: 'travelcard:food', entity_id: null,
      title: 'Vegetarian-Friendly Destinations', description: 'Find great food wherever you travel',
      image_url: null, image_alt: 'Vegetarian food', href: '/travel/food',
      category: 'guide', tags: ['food', 'vegetarian'], is_sponsored: false,
    },
  ]

  return NextResponse.json({
    schema_version: 1,
    generated_at: new Date().toISOString(),
    items: finalItems,
    next_cursor: null,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
    },
  })
}
