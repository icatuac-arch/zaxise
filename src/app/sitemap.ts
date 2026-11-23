import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { COUNTRIES } from '@/data/travel/destinations'

const BASE_URL = 'https://zaxise.vercel.app'

/* ------------------------------------------------------------------ */
/*  Route discovery helpers                                            */
/* ------------------------------------------------------------------ */

/**
 * Recursively find all page.tsx files under a directory and return
 * their URL paths relative to the app directory.
 * Skips dynamic segments ([param]), api routes, and internal prefixed dirs.
 */
function discoverStaticRoutes(dir: string, basePath = ''): string[] {
  const routes: string[] = []

  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return routes
  }

  const hasPage = entries.some(
    (e) => e.isFile() && (e.name === 'page.tsx' || e.name === 'page.ts'),
  )
  if (hasPage) {
    routes.push(basePath || '/')
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    // Skip dynamic segments, api routes, and underscore dirs
    if (entry.name.startsWith('[') || entry.name.startsWith('_') || entry.name === 'api') continue
    routes.push(...discoverStaticRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`))
  }

  return routes
}

/* ------------------------------------------------------------------ */
/*  Priority & frequency rules                                         */
/* ------------------------------------------------------------------ */

function getChangeFrequency(
  route: string,
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  if (route === '/') return 'daily'
  if (route === '/deals' || route === '/internships') return 'daily'
  if (route.startsWith('/deals-community')) return 'daily'
  if (route.startsWith('/travel')) return 'weekly'
  if (route.startsWith('/facts')) return 'weekly'
  if (route.startsWith('/social')) return 'weekly'
  if (route.startsWith('/time')) return 'monthly'
  if (route.startsWith('/tools')) return 'monthly'
  if (route.startsWith('/calc')) return 'monthly'
  if (route.startsWith('/rent-or-buy')) return 'monthly'
  if (['/terms', '/privacy', '/disclaimer'].includes(route)) return 'yearly'
  return 'monthly'
}

function getPriority(route: string): number {
  if (route === '/') return 1.0
  if (route === '/deals' || route === '/internships') return 0.9
  if (route === '/travel' || route === '/social' || route === '/facts' || route === '/time') return 0.8
  if (route.startsWith('/deals-community')) return 0.8
  if (route.startsWith('/travel')) return 0.7
  if (route.startsWith('/facts')) return 0.7
  if (route.startsWith('/social')) return 0.7
  if (route.startsWith('/time')) return 0.6
  if (route.startsWith('/tools') || route.startsWith('/calc')) return 0.6
  if (route.startsWith('/rent-or-buy')) return 0.6
  if (route.startsWith('/products')) return 0.5
  if (['/terms', '/privacy', '/disclaimer'].includes(route)) return 0.3
  return 0.5
}

/* ------------------------------------------------------------------ */
/*  Sitemap generator                                                  */
/* ------------------------------------------------------------------ */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const now = new Date().toISOString()

  // 1. Discover all static routes from the filesystem
  const staticRoutes = discoverStaticRoutes(appDir)

  // 2. Build entries for static routes
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: getChangeFrequency(route),
    priority: getPriority(route),
  }))

  // 3. Add dynamic travel country pages
  for (const country of COUNTRIES) {
    entries.push({
      url: `${BASE_URL}/travel/country/${country.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    // State-level pages
    for (const state of country.states ?? []) {
      entries.push({
        url: `${BASE_URL}/travel/country/${country.slug}/${state.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      })

      // City-level pages
      for (const city of state.cities ?? []) {
        entries.push({
          url: `${BASE_URL}/travel/country/${country.slug}/${state.id}/${city.id}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  }

  return entries
}
