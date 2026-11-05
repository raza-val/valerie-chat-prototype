import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { AuraState } from '@/lib/aura'
import { reducedMotion } from '@/lib/motion'
import type { MascotHandle } from './Mascot'
import { ConstellationMark } from './ConstellationMark'

/**
 * Version B's Aura. At 64px and up (Home) it's the sparkle as a grid of points (ConstellationMark); smaller
 * (the thread, and its loader) it's the sparkle drawn in 13 points: abstract, no face, and few enough to read at 28px. Every state is a pose the points glide into, so a change of state is a morph, never a cut:
 * - idle: the sparkle, twinkling softly and leaning toward the pointer, with a glint now and then;
 * - listening: it draws in a little, attentive;
 * - thinking: a constellation, at a lively pace. The points spring apart into a few stars, a line darts between them
 *   one star at a time like tracing a star map, the sky keeps turning, and every 2.6s the stars jump to the next,
 *   for as long as the wait goes on: the Northern Cross (the sparkle written in stars), Cassiopeia, Lyra, the Summer Triangle.
 *   Points a constellation doesn't need fold into its stars, so no more than six show at once;
 * - speaking: the points push outward with the voice;
 * - error: it dims and holds still (Aura greys it).
 * Drawn in a 100 × 100 box; colours from the brand tokens, darker at the core, lighter at the tips.
 */
type Dot = { x: number; y: number; r: number; tone: 0 | 1 | 2 }
/** The sparkle: a core, two points down each arm, and four close in where the arms meet. */
const DOTS: Dot[] = [
  { x: 50, y: 50, r: 7, tone: 0 },
  ...[[50, 30], [70, 50], [50, 70], [30, 50]].map(([x, y]) => ({ x, y, r: 5, tone: 1 as const })),
  ...[[50, 9], [91, 50], [50, 91], [9, 50]].map(([x, y]) => ({ x, y, r: 3.4, tone: 2 as const })),
  ...[[39, 39], [61, 39], [61, 61], [39, 61]].map(([x, y]) => ({ x, y, r: 3, tone: 1 as const })),
]
const toneClass = ['fill-brand-700 dark:fill-brand-400', 'fill-brand-500 dark:fill-brand-300', 'fill-brand-300 dark:fill-brand-200']

/** A constellation: its stars (in the 100 × 100 box; the first is the brightest) and the pairs a line joins, in drawing order. */
type Pattern = { stars: [number, number][]; lines: [number, number][] }
const PATTERNS: Pattern[] = [
  // The Northern Cross (Cygnus): the sparkle written in stars, so the first grows straight out of the mark.
  { stars: [[50, 12], [50, 42], [50, 66], [50, 90], [16, 52], [84, 34]], lines: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]] },
  // Cassiopeia: the W.
  { stars: [[50, 46], [32, 64], [14, 40], [68, 66], [86, 38]], lines: [[2, 1], [1, 0], [0, 3], [3, 4]] },
  // Lyra: a bright star over a small kite.
  { stars: [[46, 14], [38, 42], [60, 46], [64, 80], [42, 76]], lines: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 1]] },
  // The Summer Triangle: three bright stars.
  { stars: [[30, 24], [78, 42], [44, 84]], lines: [[0, 1], [1, 2], [2, 0]] },
]
/** Each star takes the nearest free point of the sparkle, so the points glide the shortest way; the rest fold into the nearest star. */
const PLANS = PATTERNS.map((p) => {
  const star = new Array<number>(DOTS.length).fill(-1)
  const dotOf = p.stars.map(([sx, sy], s) => {
    let best = -1, bd = Infinity
    DOTS.forEach((d, i) => { const dd = Math.hypot(d.x - sx, d.y - sy); if (star[i] < 0 && dd < bd) { bd = dd; best = i } })
    star[best] = s
    return best
  })
  const near = (d: Dot) => p.stars.reduce((m, [sx, sy], s) => (Math.hypot(d.x - sx, d.y - sy) < Math.hypot(d.x - p.stars[m][0], d.y - p.stars[m][1]) ? s : m), 0)
  const fold = DOTS.map((d, i) => (star[i] >= 0 ? star[i] : near(d)))
  return { star, dotOf, fold }
})
const LINES = Math.max(...PATTERNS.map((p) => p.lines.length))
/** The pace, quick and lively: a new constellation every 2.6s. The stars snap into place, the lines draw one after
 * another from DRAW_AT (each over LINE_MS, LINE_GAP apart), it holds, and the lines fade over the last FADE_MS. */
const FORM_MS = 2600
const DRAW_AT = 300, LINE_MS = 180, LINE_GAP = 120, FADE_MS = 350
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** Point (x, y) turned by angle a around the centre and scaled by s. */
const turned = (x: number, y: number, a: number, s = 1) => {
  const dx = x - 50, dy = y - 50, c = Math.cos(a), n = Math.sin(a)
  return { x: 50 + (dx * c - dy * n) * s, y: 50 + (dx * n + dy * c) * s }
}
type Pose = { x: number; y: number; r: number; o: number }

// One pointer for every constellation on the page.
const pointer = { x: -1, y: -1 }
if (typeof window !== 'undefined') window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY })

type Props = {
  state?: AuraState; size?: number
  /** Something hangs from Aura (the open steps while Valerie works): a line runs from its lowest star to the bottom edge. */
  tether?: boolean
}
export const Constellation = forwardRef<MascotHandle, Props>(function Constellation({ state, size = 112, tether }, ref) {
  return size >= 64 ? <ConstellationMark ref={ref} state={state} size={size} /> : <SmallConstellation ref={ref} state={state} size={size} tether={tether} />
})

const SmallConstellation = forwardRef<MascotHandle, Props & { size: number }>(function SmallConstellation({ state = 'idle', size, tether = false }, ref) {
  const root = useRef<SVGSVGElement>(null)
  const group = useRef<SVGGElement>(null)
  const lineGroup = useRef<SVGGElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const tetherLine = useRef<SVGLineElement>(null)
  const target = useRef(0)
  const live = useRef(state)
  live.current = state
  const tied = useRef(tether)
  tied.current = tether
  useImperativeHandle(ref, () => ({ level: (v) => { target.current = v } }))

  useEffect(() => {
    if (reducedMotion()) return
    const pos = DOTS.map((d) => ({ x: d.x, y: d.y, r: d.r, o: 1 }))
    const lineO = new Array<number>(LINES).fill(0)
    let tetherO = 0
    const lean = [0, 0]
    let lvl = 0, raf = 0, last = performance.now(), thinkingSince = -1, glintAt = performance.now() + 1500 + Math.random() * 2500
    const tick = (now: number) => {
      const dt = Math.min(64, now - last); last = now
      const st = live.current
      lvl += ((st === 'speaking' ? target.current : 0) - lvl) * 0.35
      if (st === 'thinking') { if (thinkingSince < 0) thinkingSince = now } else thinkingSince = -1
      const lt = now - thinkingSince
      const k = Math.floor(lt / FORM_MS) % PATTERNS.length
      const pattern = thinkingSince >= 0 ? PATTERNS[k] : null, plan = PLANS[k]
      const local = lt % FORM_MS
      // Thinking, the points move briskly and the whole sky keeps turning.
      const ease = 1 - Math.exp(-dt / (pattern ? 160 : 220))
      const sway = lt / 4500

      // At rest it leans a little toward the pointer, the core more than the tips, so it reads as depth.
      let tx = 0, ty = 0
      if (st === 'idle' && root.current && pointer.x >= 0) {
        const b = root.current.getBoundingClientRect()
        const dx = pointer.x - (b.left + b.width / 2), dy = pointer.y - (b.top + b.height / 2)
        const d = Math.hypot(dx, dy) || 1, f = Math.min(1, d / 360)
        tx = (dx / d) * f; ty = (dy / d) * f
      }
      lean[0] += (tx - lean[0]) * 0.08; lean[1] += (ty - lean[1]) * 0.08

      // A glint now and then: a ripple running out from the core.
      if (st === 'idle' && now > glintAt + 900) glintAt = now + 2600 + Math.random() * 3400
      const front = ((now - glintAt) / 700) * 48
      const breathe = 1 + Math.sin(now / 1600) * 0.025

      const els = group.current?.children
      for (let i = 0; i < DOTS.length; i++) {
        const h = DOTS[i]
        const d = Math.hypot(h.x - 50, h.y - 50)
        let p: Pose
        if (pattern) {
          const s = plan.star[i]
          const [sx, sy] = pattern.stars[s >= 0 ? s : plan.fold[i]]
          p = s >= 0
            ? { ...turned(sx, sy, sway), r: (s === 0 ? 6.4 : 5) * (1 + 0.12 * Math.sin(now / 260 + s * 1.9)), o: s === 0 ? 1 : 0.85 }
            : { ...turned(sx, sy, sway), r: 1, o: 0 }
        } else if (st === 'listening') p = { ...turned(h.x, h.y, 0, 0.88), r: h.r, o: 0.7 + 0.3 * Math.sin(now / 500 - d / 10) ** 2 }
        else if (st === 'error') p = { ...turned(h.x, h.y, 0, 0.92), r: h.r * 0.9, o: 0.7 }
        else {
          const push = 1 + lvl * 0.22, depth = (2 - h.tone) * 1.4
          const glint = front > 0 && front < 60 ? Math.exp(-((d - front) ** 2) / 60) : 0
          p = {
            x: 50 + (h.x - 50) * push * breathe + lean[0] * depth,
            y: 50 + (h.y - 50) * push * breathe + lean[1] * depth,
            r: h.r * (1 + glint * 0.5),
            o: Math.min(1, 0.65 + 0.35 * Math.sin(now / 900 - d / 14) ** 2 + glint),
          }
        }
        const q = pos[i]
        q.x += (p.x - q.x) * ease; q.y += (p.y - q.y) * ease; q.r += (p.r - q.r) * ease; q.o += (p.o - q.o) * ease
        const el = els?.[i] as SVGCircleElement | undefined
        if (el) { el.setAttribute('cx', q.x.toFixed(2)); el.setAttribute('cy', q.y.toFixed(2)); el.setAttribute('r', q.r.toFixed(2)); el.setAttribute('opacity', q.o.toFixed(2)) }
      }

      // The lines follow their stars as they glide, draw one after another, and fade before the next constellation.
      const lines = lineGroup.current?.children
      for (let j = 0; j < LINES; j++) {
        const el = lines?.[j] as SVGLineElement | undefined
        if (!el) continue
        const pair = pattern?.lines[j]
        let want = 0
        if (pair) {
          const a = pos[plan.dotOf[pair[0]]], b = pos[plan.dotOf[pair[1]]]
          const f = clamp01((local - DRAW_AT - j * LINE_GAP) / LINE_MS)
          el.setAttribute('x1', a.x.toFixed(2)); el.setAttribute('y1', a.y.toFixed(2))
          el.setAttribute('x2', (a.x + (b.x - a.x) * f).toFixed(2)); el.setAttribute('y2', (a.y + (b.y - a.y) * f).toFixed(2))
          want = f > 0 ? 0.55 * clamp01((FORM_MS - local) / FADE_MS) : 0
        }
        // Eased, so lines left over when the answer lands fade out instead of blinking off.
        lineO[j] += (want - lineO[j]) * (pair ? 1 : ease)
        el.setAttribute('opacity', lineO[j].toFixed(2))
      }
      // The tether: from whichever star is lowest right now, straight down to the bottom edge, where the line below takes over.
      tetherO += ((tied.current ? 0.55 : 0) - tetherO) * ease
      if (tetherLine.current) {
        let low = pos[0]
        for (const q of pos) if (q.o > 0.3 && q.y > low.y) low = q
        tetherLine.current.setAttribute('x1', low.x.toFixed(2)); tetherLine.current.setAttribute('y1', low.y.toFixed(2))
        tetherLine.current.setAttribute('opacity', tetherO.toFixed(2))
      }
      if (ring.current) { ring.current.setAttribute('r', String(41 + lvl * 9)); ring.current.setAttribute('opacity', String(Math.min(0.5, lvl * 0.7))) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg ref={root} viewBox="0 0 100 100" aria-hidden className="block overflow-visible" style={{ width: size, height: size }}>
      <circle ref={ring} cx="50" cy="50" r="41" fill="none" stroke="var(--brand-300)" strokeWidth="1.2" opacity="0" />
      <g ref={lineGroup} className="stroke-brand-400 dark:stroke-brand-300">
        {Array.from({ length: LINES }, (_, j) => <line key={j} opacity="0" strokeWidth={1} strokeLinecap="round" vectorEffect="non-scaling-stroke" />)}
        <line ref={tetherLine} x1="50" y1="91" x2="50" y2="100" opacity="0" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </g>
      <g ref={group}>{DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} className={toneClass[d.tone]} />)}</g>
    </svg>
  )
})
