// Category display order — Phones always first (spec §4)
export const CATEGORY_ORDER = [
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
] as const

export interface TechDeal {
  id: string
  feed_date: string
  product_name: string
  brand: string
  model: string
  category: string
  retailer: string
  product_url: string
  image_url: string
  price_current: number
  price_list: number
  price_previous: number
  discount_pct: number
  price_90d_low: number | null
  is_historical_low: boolean
  shipping_cost: number | null
  shipping_note: string | null
  price_total: number | null
  in_stock: boolean
  stock_note: string
  first_posted_at: string | null
  last_verified_at: string | null
  deal_note: string
  tier: number
  at_or_below_trigger: boolean
  source_page: string
}

export function getCategoryOrder(category: string): number {
  const idx = CATEGORY_ORDER.indexOf(category as typeof CATEGORY_ORDER[number])
  return idx === -1 ? CATEGORY_ORDER.length : idx
}

export function groupByCategory(deals: TechDeal[]): Map<string, TechDeal[]> {
  const groups = new Map<string, TechDeal[]>()

  // Sort deals by category order, then tier, then discount
  const sorted = [...deals].sort((a, b) => {
    const catDiff = getCategoryOrder(a.category) - getCategoryOrder(b.category)
    if (catDiff !== 0) return catDiff
    const tierDiff = a.tier - b.tier
    if (tierDiff !== 0) return tierDiff
    return b.discount_pct - a.discount_pct
  })

  for (const deal of sorted) {
    const existing = groups.get(deal.category)
    if (existing) {
      existing.push(deal)
    } else {
      groups.set(deal.category, [deal])
    }
  }

  return groups
}

export function isCarrierDeal(deal: TechDeal): boolean {
  return (
    deal.price_current === 0 ||
    deal.product_name.includes('(CARRIER TERMS)') ||
    deal.product_name.includes('CARRIER TERMS')
  )
}

export function formatPrice(price: number): string {
  if (price === 0) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatVerifiedDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

// Category icons (emoji for now, can swap to lucide later)
export const CATEGORY_ICONS: Record<string, string> = {
  Phones: '📱',
  TVs: '📺',
  Audio: '🎧',
  Laptops: '💻',
  'Cameras & Drones': '📷',
  Gaming: '🎮',
  Monitors: '🖥️',
  Wearables: '⌚',
  'Tablets & E-readers': '📱',
  'Smart Home': '🏠',
  'Home Security': '🔒',
  Storage: '💾',
  'Power & Charging': '🔋',
  Accessories: '🎒',
  'Home Appliances': '🏡',
}
