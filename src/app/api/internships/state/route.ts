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

  // Single posting lookup
  if (id) {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .eq('id', id)
      .is('retired_at', null)
      .maybeSingle()

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ ok: false, error: 'Not found or retired' }, { status: 404 })

    return NextResponse.json({ ok: true, posting: data })
  }

  // List all live posting IDs
  if (type === 'internship') {
    const { data, error } = await supabase
      .from('internships')
      .select('id, title, company, vertical, first_seen_at, last_verified_at, application_deadline')
      .is('retired_at', null)
      .order('first_seen_at', { ascending: false })

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      count: (data || []).length,
      postings: data || [],
    })
  }

  return NextResponse.json({ ok: false, error: 'Provide ?id=<posting-id> or ?type=internship' }, { status: 400 })
}
