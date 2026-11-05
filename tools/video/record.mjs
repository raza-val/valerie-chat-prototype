// Phase 8.3: one send from Home, captured frame by frame on a virtual clock (60fps, 1920×1200).
// node record.mjs <framesDir> [maxSeconds]  → frames/NNNNN.jpg + frames/audio.json (VOICE=martha for another voice,
// VERSION=b for Version B, the Constellation).
// Run through render.sh, which builds and serves the app first.
import { chromium } from 'playwright-core'
import fs from 'node:fs'
const [dir, maxS = '34'] = process.argv.slice(2)
fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true })
const FPS = 60, DT = 1000 / FPS
const BASE = process.env.BASE ?? 'http://localhost:4173'
const HOME = process.env.VERSION === 'b' ? '/constellation/' : '/'
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'] })
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 / 3 })
await ctx.addInitScript({ path: new URL('./clock.js', import.meta.url).pathname })
await ctx.addInitScript({ path: new URL('./cursor.js', import.meta.url).pathname })
await ctx.addInitScript(() => { try { localStorage.setItem('valerie-theme', 'light'); localStorage.setItem('valerie.sound', 'off') } catch {} })
const p = await ctx.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const cdp = await ctx.newCDPSession(p)
await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0 })
await p.goto(BASE + HOME + (process.env.VOICE ? `?voice=${process.env.VOICE}` : ''), { waitUntil: 'networkidle' })

const ease = (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2)
const center = async (loc) => { const r = await loc.boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2] }
let ptr = [1300, 820]
// Pointer glides: [startMs, endMs, target (point or locator)]; clicks: [ms, locator].
const glides = [
  [500, 1900, [905, 330]],
  [2300, 3000, () => p.getByRole('button', { name: 'Sound' })],
  [6300, 6900, () => p.getByRole('tab', { name: 'Brand' })],
  [7200, 7800, () => p.getByRole('button', { name: /buyers/i }).first()],
  [8600, 10200, [1180, 640]],
]
const clicks = [[3200, () => p.getByRole('button', { name: 'Sound' })], [7000, () => p.getByRole('tab', { name: 'Brand' })], [8000, () => p.getByRole('button', { name: /buyers/i }).first()]]
const active = new Map()
const SCROLL = [22500, 25300]

let end = Infinity
for (let i = 0; ; i++) {
  const t = i * DT
  for (const g of glides) {
    const [s, e, target] = g
    if (t >= s && t <= e + DT) {
      if (!active.has(g)) active.set(g, { from: ptr, to: Array.isArray(target) ? target : await center(target()) })
      const { from, to } = active.get(g)
      const k = ease(Math.min(1, (t - s) / (e - s)))
      ptr = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]
      await p.mouse.move(ptr[0], ptr[1])
    }
  }
  // A click is held for ~110ms of video, so the press shows.
  for (const [at, loc] of clicks) {
    if (t >= at && t < at + DT) { ptr = await center(loc()); await p.mouse.move(...ptr); await p.mouse.down() }
    if (t >= at + 110 && t < at + 110 + DT) await p.mouse.up()
  }
  // As Valerie offers the follow-up, the thread eases down so the offer and its chips come into view above the composer.
  if (t >= SCROLL[0] && t <= SCROLL[1] + DT) await p.evaluate(([k, first]) => {
    const offer = [...document.querySelectorAll('p')].find((el) => el.textContent.startsWith('Want me to turn this'))
    if (!offer) return
    let box = offer.parentElement
    while (box && !(box.scrollHeight > box.clientHeight && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement
    if (first || !window.__scroll) {
      const chips = offer.nextElementSibling.getBoundingClientRect(), form = document.querySelector('form').getBoundingClientRect()
      box.style.scrollBehavior = 'auto'
      window.__scroll = { from: box.scrollTop, by: chips.bottom - (form.top - 40) }
    }
    const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2
    box.scrollTop = window.__scroll.from + window.__scroll.by * e
  }, [Math.min(1, (t - SCROLL[0]) / (SCROLL[1] - SCROLL[0])), t < SCROLL[0] + DT])
  // Let React commit what the clock started, then pin every animation to the clock, then shoot.
  for (let k = 0; k < 3; k++) await p.evaluate(() => new Promise((r) => window.__real.setTimeout(r, 0)))
  await p.evaluate(() => window.__seek())
  fs.writeFileSync(`${dir}/${String(i).padStart(5, '0')}.jpg`, await p.screenshot({ type: 'jpeg', quality: 92 }))
  const log = await p.evaluate(() => window.__audioLog)
  const offer = log.find((l) => /offer/.test(l.url ?? '') && l.until !== undefined)
  if (offer && end === Infinity) end = offer.until + 1400
  if (t >= end || t >= +maxS * 1000) { fs.writeFileSync(`${dir}/audio.json`, JSON.stringify(log, null, 1)); console.log('frames', i + 1, '| seconds', (t / 1000).toFixed(2), '| audio', JSON.stringify(log)); break }
  if (i % 300 === 0) console.log('t', (t / 1000).toFixed(1))
  await p.evaluate((dt) => window.__advance(dt), DT)
}
console.log(errors.length ? errors.slice(0, 6).join('\n') : 'no console errors')
await b.close()
