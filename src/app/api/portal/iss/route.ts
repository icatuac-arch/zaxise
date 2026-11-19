import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [issRes, astrosRes] = await Promise.all([
      fetch('http://api.open-notify.org/iss-now.json', { cache: 'no-store' }),
      fetch('http://api.open-notify.org/astros.json', { next: { revalidate: 3600 } }),
    ])

    const issData = issRes.ok ? await issRes.json() : null
    const astrosData = astrosRes.ok ? await astrosRes.json() : null

    return NextResponse.json({
      position: issData?.iss_position || null,
      astronauts: astrosData?.number || 0,
      people: astrosData?.people || [],
    })
  } catch {
    return NextResponse.json({ position: null, astronauts: 0, people: [] })
  }
}
