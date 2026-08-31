import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

// GET /nivo-cal/images/:key پشت JwtGuard است — تگ <img> نمی‌تواند هدر Authorization بفرستد،
// پس با axios (که توکن کاربر را دارد) می‌گیریم و به blob URL محلی تبدیل می‌کنیم.
const cache = new Map<string, string>()

export function useAuthedImageUrl(src: string | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(() => (src ? cache.get(src) : undefined))

  useEffect(() => {
    if (!src) { setUrl(undefined); return }
    const cached = cache.get(src)
    if (cached) { setUrl(cached); return }

    let cancelled = false
    setUrl(undefined)
    api
      .get(src, { responseType: 'blob' })
      .then(res => {
        if (cancelled) return
        const objectUrl = URL.createObjectURL(res.data as Blob)
        cache.set(src, objectUrl)
        setUrl(objectUrl)
      })
      .catch(() => { if (!cancelled) setUrl(undefined) })

    return () => { cancelled = true }
  }, [src])

  return url
}
