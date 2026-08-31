import { useAuthedImageUrl } from '@/hooks/useAuthedImageUrl'
import { cn } from '@/lib/cn'

interface AuthedImageProps {
  src: string
  alt?: string
  className?: string
}

export function AuthedImage({ src, alt = '', className }: AuthedImageProps) {
  const url = useAuthedImageUrl(src)

  if (!url) return <div className={cn('animate-pulse bg-black/5', className)} />

  return <img src={url} alt={alt} className={className} />
}
