import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// POST /api/messages — create a new message
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  let body: {
    from: string
    to: string
    subject?: string
    body: string
    priority?: string
    thread_id?: string | null
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  // Validate required fields
  if (!body.from || !body.to || !body.body) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields: from, to, body' },
      { status: 400 }
    )
  }

  const validPriorities = ['low', 'normal', 'high', 'urgent']
  const priority = body.priority ?? 'normal'
  if (!validPriorities.includes(priority)) {
    return NextResponse.json(
      { ok: false, error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` },
      { status: 400 }
    )
  }

  // If thread_id provided, verify it exists
  const supabase = getSupabaseAdmin()

  if (body.thread_id) {
    const { data: parent, error: parentErr } = await supabase
      .from('agent_messages')
      .select('id')
      .eq('id', body.thread_id)
      .maybeSingle()

    if (parentErr || !parent) {
      return NextResponse.json(
        { ok: false, error: 'thread_id references a non-existent message' },
        { status: 400 }
      )
    }
  }

  const { data, error } = await supabase
    .from('agent_messages')
    .insert({
      from_agent: body.from,
      to_agent: body.to,
      subject: body.subject ?? '',
      body: body.body,
      priority,
      thread_id: body.thread_id ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { ok: false, error: `Failed to create message: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, message: data }, { status: 201 })
}

// ---------------------------------------------------------------------------
// GET /api/messages — list messages with optional filters
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const to = searchParams.get('to')
  const from = searchParams.get('from')
  const unread = searchParams.get('unread')
  const threadId = searchParams.get('thread_id')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('agent_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (to) query = query.eq('to_agent', to)
  if (from) query = query.eq('from_agent', from)
  if (unread === 'true') query = query.is('read_at', null)
  if (threadId) query = query.eq('thread_id', threadId)

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { ok: false, error: `Failed to fetch messages: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    messages: data,
    total: count,
    limit,
    offset,
  })
}

// ---------------------------------------------------------------------------
// PUT /api/messages — update a message (mark as read, etc.)
// ---------------------------------------------------------------------------
export async function PUT(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 })
  }

  let body: {
    id: string
    read?: boolean
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  if (!body.id) {
    return NextResponse.json(
      { ok: false, error: 'Missing required field: id' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  // Build update payload
  const updates: Record<string, unknown> = {}

  if (body.read === true) {
    updates.read_at = new Date().toISOString()
  } else if (body.read === false) {
    updates.read_at = null
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { ok: false, error: 'No valid update fields provided' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('agent_messages')
    .update(updates)
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { ok: false, error: `Failed to update message: ${error.message}` },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: 'Message not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true, message: data })
}
