import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { AuraState } from '@/lib/aura'
import { reducedMotion } from '@/lib/motion'
import type { MascotHandle } from './Mascot'

/**
 * Version B's Aura at 64px and up (Home): the Valerie sparkle drawn as a grid of data points. Abstract, no face:
 * it's the shape that moves. Smaller (the thread and its loader), Constellation draws it in 13 points instead.
 * Every state is a form the points ease into, so a change of state is a morph, never a cut:
 * - idle: the sparkle, twinkling outward from the core and leaning toward the pointer, with a glint every few seconds;
 * - listening: it draws in a little and twinkles faster, attentive;
 * - thinking: a real constellation. The sparkle spreads into a field of faint stars; a few bright ones take their
 *   places and lines draw between them, star to star, like tracing a star map. It holds and twinkles, the lines
 *   fade, and the stars drift on to the next constellation, for as long as the wait goes on (the way Claude's
 *   spinner changes as a reply takes longer): the Northern Cross (the sparkle written in stars), the Plough,
 *   Cassiopeia, Orion, Lyra;
 * - speaking: the points push outward with the voice;
 * - error: it dims and holds still (Aura greys it).
 * Drawn in a 100 × 100 box; colours from the brand tokens, darker at the core, lighter at the tips.
 */
type Dot = { x: number; y: number; r: number; tone: 0 | 1 | 2 }
const toneOf = (x: number, y: number): Dot['tone'] => { const d = Math.hypot(x - 50, y - 50); return d > 30 ? 2 : d > 16 ? 1 : 0 }

/** A grid inside the sparkle (|x|^.72 + |y|^.72 ≤ r^.72), points larger toward the core. */
const dots = (() => {
  const pts: Dot[] = []
  const step = 5.6, start = 50 - step * Math.floor(41 / step)
  for (let y = start; y <= 91; y += step) for (let x = start; x <= 91; x += step) {
    const dx = Math.abs(x - 50), dy = Math.abs(y - 50)
    if (dx ** 0.72 + dy ** 0.72 <= 41 ** 0.72) pts.push({ x, y, r: 2.3 - Math.hypot(dx, dy) * 0.022, tone: toneOf(x, y) })
  }
  return pts
})()
const toneClass = ['fill-brand-700 dark:fill-brand-400', 'fill-brand-500 dark:fill-brand-300', 'fill-brand-300 dark:fill-brand-200']

/** A constellation: where its bright stars sit (in the 100 × 100 box) and which pairs the lines join, in drawing order. */
type Pattern = { stars: [number, number][]; lines: [number, number][] }
/** The constellations a long wait walks through. The first star of each is its brightest. */
const PATTERNS: Pattern[] = [
  // The Northern Cross (Cygnus): the sparkle written in stars, so the first one grows out of the mark.
  { stars: [[50, 10], [50, 40], [50, 64], [50, 90], [16, 50], [84, 32], [67, 36]], lines: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 6], [6, 5]] },
  // The Plough: a bowl and a handle.
  { stars: [[12, 36], [27, 29], [41, 36], [53, 46], [57, 66], [80, 70], [85, 48]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  // Cassiopeia: the W.
  { stars: [[10, 38], [30, 62], [50, 42], [70, 64], [90, 36]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  // Orion: shoulders, the belt, the feet.
  { stars: [[30, 14], [72, 20], [42, 48], [51, 51], [60, 54], [30, 88], [74, 84]], lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]] },
  // Lyra: a bright star over a small kite.
  { stars: [[44, 12], [36, 40], [58, 44], [64, 78], [40, 72]], lines: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 1]] },
]
const STARS = Math.max(...PATTERNS.map((p) => p.stars.length))
const LINES = Math.max(...PATTERNS.map((p) => p.lines.length))
/** How long each constellation stays: the stars settle, the lines draw (from DRAW_AT, one after another), it holds, the lines fade. */
const FORM_MS = 4200
const DRAW_AT = 700, LINE_MS = 300, LINE_GAP = 170, FADE_MS = 500
/** A steady pseudo-random number in [0, 1) per point, so the field of faint stars is the same every time. */
const rand = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }
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

/** Which points become a constellation's bright stars (the rest are the faint field): points spread through the sparkle. */
const slots = Array.from({ length: STARS }, (_, j) => Math.round(((j + 0.5) * dots.length) / STARS))

export const ConstellationMark = forwardRef<MascotHandle, { state?: AuraState; size?: number }>(function ConstellationMark({ state = 'idle', size = 112 }, ref) {
  const root = useRef<SVGSVGElement>(null)
  const group = useRef<SVGGElement>(null)
  const lineGroup = useRef<SVGGElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const target = useRef(0)
  const live = useRef(state)
  live.current = state
  useImperativeHandle(ref, () => ({ level: (v) => { target.current = v } }))

  useEffect(() => {
    if (reducedMotion()) return
    const pos = dots.map((d) => ({ x: d.x, y: d.y, r: d.r, o: 1 }))
    const lean = [0, 0]
    const lineO = new Array<number>(LINES).fill(0)
    let lvl = 0, raf = 0, last = performance.now(), thinkingSince = -1, glintAt = performance.now() + 1500 + Math.random() * 2500
    const tick = (now: number) => {
      const dt = Math.min(64, now - last); last = now
      const st = live.current
      lvl += ((st === 'speaking' ? target.current : 0) - lvl) * 0.35
      if (st === 'thinking') { if (thinkingSince < 0) thinkingSince = now } else thinkingSince = -1
      const lt = now - thinkingSince
      const pattern = thinkingSince >= 0 ? PATTERNS[Math.floor(lt / FORM_MS) % PATTERNS.length] : null
      const local = lt % FORM_MS
      // The stars spread slowly, and the whole sky turns a few degrees back and forth.
      const ease = 1 - Math.exp(-dt / (pattern ? 320 : 150))
      const sway = Math.sin(lt / 2600) * 0.05

      // At rest it leans a little toward the pointer, the core more than the tips, so it reads as depth.
      let tx = 0, ty = 0
      if (st === 'idle' && root.current && pointer.x >= 0) {
        const b = root.current.getBoundingClientRect()
        const dx = pointer.x - (b.left + b.width / 2), dy = pointer.y - (b.top + b.height / 2)
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 360)
        tx = (dx / d) * k; ty = (dy / d) * k
      }
      lean[0] += (tx - lean[0]) * 0.08; lean[1] += (ty - lean[1]) * 0.08

      // A glint now and then: a ripple running out from the core.
      if (st === 'idle' && now > glintAt + 900) glintAt = now + 2600 + Math.random() * 3400
      const front = (now - glintAt) / 700 * 48
      const breathe = 1 + Math.sin(now / 1600) * 0.025

      const els = group.current?.children
      for (let i = 0; i < dots.length; i++) {
        const h = dots[i]
        const d = Math.hypot(h.x - 50, h.y - 50)
        let p: Pose
        const slot = slots.indexOf(i)
        if (pattern && slot >= 0 && slot < pattern.stars.length) {
          // A bright star of this constellation; its first star is the brightest.
          const [sx, sy] = pattern.stars[slot]
          p = { ...turned(sx, sy, sway), r: 2.6 * (slot === 0 ? 1.25 : 1) * (1 + 0.1 * Math.sin(now / 320 + slot * 1.7)), o: 1 }
        } else if (pattern) {
          // The faint field: spread across the whole sky, each star twinkling at its own pace.
          p = { ...turned(6 + rand(i) * 88, 6 + rand(i + 50) * 88, sway), r: 0.9, o: 0.14 + 0.3 * Math.sin(now / (700 + rand(i + 9) * 900) + i) ** 2 }
        } else if (st === 'listening') p = { ...turned(h.x, h.y, 0, 0.9), r: h.r, o: 0.6 + 0.4 * Math.sin(now / 260 - d / 8) ** 2 }
        else if (st === 'error') p = { ...turned(h.x, h.y, 0, 0.92), r: h.r * 0.9, o: 0.7 }
        else {
          const push = 1 + lvl * 0.22, depth = (2 - h.tone) * 1.6
          const glint = front > 0 && front < 60 ? Math.exp(-((d - front) ** 2) / 50) : 0
          p = {
            x: 50 + (h.x - 50) * push * breathe + lean[0] * depth,
            y: 50 + (h.y - 50) * push * breathe + lean[1] * depth,
            r: h.r * (1 + glint * 0.7),
            o: Math.min(1, 0.55 + 0.45 * Math.sin(now / 600 - d / 12) ** 2 + glint),
          }
        }
        const q = pos[i]
        q.x += (p.x - q.x) * ease; q.y += (p.y - q.y) * ease; q.r += (p.r - q.r) * ease; q.o += (p.o - q.o) * ease
        const el = els?.[i] as SVGCircleElement | undefined
        if (el) { el.setAttribute('cx', q.x.toFixed(2)); el.setAttribute('cy', q.y.toFixed(2)); el.setAttribute('r', q.r.toFixed(2)); el.setAttribute('opacity', q.o.toFixed(2)) }
      }
      // The lines follow their stars as they move, draw in one after another, and fade before the next constellation.
      const lines = lineGroup.current?.children
      for (let j = 0; j < LINES; j++) {
        const el = lines?.[j] as SVGLineElement | undefined
        if (!el) continue
        const pair = pattern?.lines[j]
        let want = 0
        if (pair) {
          const a = pos[slots[pair[0]]], b = pos[slots[pair[1]]]
          const k = clamp01((local - DRAW_AT - j * LINE_GAP) / LINE_MS)
          el.setAttribute('x1', a.x.toFixed(2)); el.setAttribute('y1', a.y.toFixed(2))
          el.setAttribute('x2', (a.x + (b.x - a.x) * k).toFixed(2)); el.setAttribute('y2', (a.y + (b.y - a.y) * k).toFixed(2))
          want = k > 0 ? 0.6 * clamp01((FORM_MS - local) / FADE_MS) : 0
        }
        // Eased, so lines left over when the answer lands fade out instead of blinking off.
        lineO[j] += (want - lineO[j]) * (pair ? 1 : ease)
        el.setAttribute('opacity', lineO[j].toFixed(2))
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
      </g>
      <g ref={group}>{dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} className={toneClass[d.tone]} />)}</g>
    </svg>
  )
})
