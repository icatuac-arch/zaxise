import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

interface PostingPayload {
  id: string
  type?: string
  title: string
  company: string
  vertical: string
  location?: string
  work_mode?: string
  term?: string
  apply_url: string
  source?: string
  application_deadline?: string | null
  posted_date?: string | null
  description?: string
  requirements?: string
  pay?: string | null
  first_seen_at?: string
  last_verified_at?: string
}

export async function PUT(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  let body: { feed?: string; generated_at?: string; upserts?: PostingPayload[]; retire_ids?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const upserts = body.upserts || []
  const retireIds = body.retire_ids || []

  if (upserts.length === 0 && retireIds.length === 0) {
    return NextResponse.json({ ok: false, error: 'No upserts or retire_ids provided' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const results: { id: string; status: string; reason?: string }[] = []

  // Process upserts
  for (const posting of upserts) {
    if (!posting.id || !posting.title || !posting.company || !posting.vertical || !posting.apply_url) {
      results.push({ id: posting.id || '(no id)', status: 'rejected', reason: 'Missing required fields (id, title, company, vertical, apply_url)' })
      continue
    }

    const { error } = await supabase
      .from('internships')
      .upsert({
        id: posting.id,
        title: posting.title,
        company: posting.company,
        vertical: posting.vertical,
        location: posting.location || '',
        work_mode: posting.work_mode || 'onsite',
        term: posting.term || '',
        apply_url: posting.apply_url,
        source: posting.source || '',
        application_deadline: posting.application_deadline || null,
        posted_date: posting.posted_date || null,
        description: posting.description || '',
        requirements: posting.requirements || '',
        pay: posting.pay || null,
        first_seen_at: posting.first_seen_at || new Date().toISOString().split('T')[0],
        last_verified_at: posting.last_verified_at || new Date().toISOString().split('T')[0],
        retired_at: null, // un-retire if previously retired
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (error) {
      results.push({ id: posting.id, status: 'rejected', reason: error.message })
    } else {
      results.push({ id: posting.id, status: 'accepted' })
    }
  }

  // Process retirements
  for (const id of retireIds) {
    const { error } = await supabase
      .from('internships')
      .update({ retired_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      results.push({ id, status: 'rejected', reason: error.message })
    } else {
      results.push({ id, status: 'retired' })
    }
  }

  const accepted = results.filter(r => r.status === 'accepted').length
  const retired = results.filter(r => r.status === 'retired').length
  const rejected = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ ok: true, accepted, retired, rejected, results })
}
