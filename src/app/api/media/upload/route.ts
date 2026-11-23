import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
])

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

function generateFilename(originalName: string): string {
  const ext = originalName.includes('.')
    ? originalName.substring(originalName.lastIndexOf('.'))
    : ''
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `${timestamp}-${random}${ext}`
}

export async function POST(request: NextRequest) {
  // Authenticate
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: 401 }
    )
  }

  const contentType = request.headers.get('content-type') || ''

  let fileBuffer: Buffer
  let filename: string
  let mimeType: string

  if (contentType.includes('multipart/form-data')) {
    // Handle multipart/form-data upload
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Failed to parse multipart form data' },
        { status: 400 }
      )
    }

    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: 'Missing "file" field in form data' },
        { status: 400 }
      )
    }

    mimeType = file.type
    filename = file.name || 'upload'
    const arrayBuffer = await file.arrayBuffer()
    fileBuffer = Buffer.from(arrayBuffer)
  } else if (
    contentType.includes('application/json') ||
    contentType === ''
  ) {
    // Handle JSON with base64
    let body: { base64?: string; filename?: string; content_type?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (!body.base64) {
      return NextResponse.json(
        { ok: false, error: 'Missing "base64" field in JSON body' },
        { status: 400 }
      )
    }

    if (!body.content_type) {
      return NextResponse.json(
        { ok: false, error: 'Missing "content_type" field in JSON body' },
        { status: 400 }
      )
    }

    mimeType = body.content_type
    filename = body.filename || 'upload'

    try {
      fileBuffer = Buffer.from(body.base64, 'base64')
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid base64 data' },
        { status: 400 }
      )
    }
  } else {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Unsupported Content-Type. Use multipart/form-data or application/json.',
      },
      { status: 400 }
    )
  }

  // Validate content type
  if (!ALLOWED_TYPES.has(mimeType)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Invalid content type "${mimeType}". Allowed: ${[...ALLOWED_TYPES].join(', ')}`,
      },
      { status: 400 }
    )
  }

  // Validate size
  if (fileBuffer.length > MAX_SIZE) {
    return NextResponse.json(
      {
        ok: false,
        error: `File too large (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB). Max: 5MB`,
      },
      { status: 400 }
    )
  }

  if (fileBuffer.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'File is empty' },
      { status: 400 }
    )
  }

  // Generate unique filename and upload
  const storedFilename = generateFilename(filename)
  const supabase = getSupabaseAdmin()

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(storedFilename, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { ok: false, error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    )
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${storedFilename}`

  return NextResponse.json({
    ok: true,
    url: publicUrl,
    id: storedFilename,
    size: fileBuffer.length,
  })
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Use POST to upload media' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Use POST to upload media' },
    { status: 405 }
  )
}
