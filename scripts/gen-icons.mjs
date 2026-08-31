// آیکون‌های PWA از لوگوی واقعی نیوو کال (public/brand/) ساخته می‌شوند — نه دیگر placeholder.
// برای favicon/apple-touch-icon/icon های استاندارد از نسخه‌ی پس‌زمینه‌سفید استفاده می‌شود
// (چون این سایزها معمولاً روی زمینه‌ی شفاف با گوشه‌ی گرد نمایش داده می‌شوند و پس‌زمینه‌ی
// سفید تمیزتر از شفاف است)؛ برای maskable باید نشان داخل «safe zone» ۸۰٪ مرکزی بماند،
// پس نسخه‌ی بدون‌پس‌زمینه با کمی کوچک‌تر و وسط‌چین روی یک بوم سفید ساخته می‌شود.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const brandDir = fileURLToPath(new URL('../public/brand/', import.meta.url))
const pwaDir = fileURLToPath(new URL('../public/pwa/', import.meta.url))
const publicDir = fileURLToPath(new URL('../public/', import.meta.url))
mkdirSync(pwaDir, { recursive: true })

const SQUARE_SRC = brandDir + 'logo-white-background.png' // 2400x2400، از قبل پس‌زمینه‌ی سفید دارد
const TRANSPARENT_SRC = brandDir + 'logo-no-background.png'

async function standardIcon(size, outPath) {
  await sharp(SQUARE_SRC).resize(size, size).png().toFile(outPath)
  console.log('wrote', outPath)
}

async function maskableIcon(size, outPath) {
  const markSize = Math.round(size * 0.62) // فضای خالی کافی برای safe zone دایره‌ای/مربعی ماسک
  const mark = await sharp(TRANSPARENT_SRC).resize(markSize, markSize).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(outPath)
  console.log('wrote', outPath)
}

await standardIcon(192, pwaDir + 'icon-192.png')
await standardIcon(512, pwaDir + 'icon-512.png')
await maskableIcon(512, pwaDir + 'maskable-icon-512.png')
await standardIcon(180, pwaDir + 'apple-touch-icon.png')
await standardIcon(64, publicDir + 'favicon.png')
