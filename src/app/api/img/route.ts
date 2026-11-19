import { NextRequest, NextResponse } from 'next/server'

// Image proxy — fetches external images server-side to avoid CORS/referrer blocking
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  // Only allow known image hosts
  const allowed = ['muse.ai', 'images.unsplash.com', 'supabase.co']
  try {
    const parsed = new URL(url)
    if (!allowed.some(host => parsed.hostname.endsWith(host))) {
      return new NextResponse('Host not allowed', { status: 403 })
    }
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ZaxiseBot/1.0' },
    })

    if (!res.ok) {
      return new NextResponse('Image fetch failed', { status: 502 })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch {
    return new NextResponse('Image fetch error', { status: 502 })
  }
}
