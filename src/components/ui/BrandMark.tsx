export function BrandMark({ size = 64, className }: { size?: number; className?: string }) {
  return <img src="/brand/logo-no-background.png" alt="" width={size} height={size} className={className} style={{ width: size, height: size, objectFit: 'contain' }} />
}
