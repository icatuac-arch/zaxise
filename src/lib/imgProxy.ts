// Proxy external images through /api/img to avoid CORS/referrer blocking
const PROXY_HOSTS = ['muse.ai']

export function proxyImg(url: string): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    if (PROXY_HOSTS.some(host => parsed.hostname.endsWith(host))) {
      return `/api/img?url=${encodeURIComponent(url)}`
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url
}
