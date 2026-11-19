import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
      { next: { revalidate: 3600 } } // cache 1 hour
    )
    if (!res.ok) throw new Error('NASA APOD API error')
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ title: '', explanation: '', url: '' })
  }
}
