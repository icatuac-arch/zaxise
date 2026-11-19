import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://api.spaceflightnewsapi.net/v4/articles/?limit=6',
      { next: { revalidate: 1800 } } // cache 30 min
    )
    if (!res.ok) throw new Error('Space news API error')
    const data = await res.json()
    return NextResponse.json({ articles: data.results || [] })
  } catch {
    return NextResponse.json({ articles: [] })
  }
}
