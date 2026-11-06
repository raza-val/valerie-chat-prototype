import { useEffect, useId, useRef, type ReactNode } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, type ExpProps } from '../motion'
import { HoloStack, depthOf } from '../bot/HoloStack'
import { clamp01, smooth, useBrand, VB_H, VB_W } from '../bot/palette'

/**
 * /exp/motion (6 Nov): ten motions for the main design's emblem, the Hologram, one per moment the product needs.
 * The body is the same slice stack as the Aura in the product (HoloStack), so any of them can move into Aura.tsx.
 * They don't follow idle/thinking/speaking: each plays its own moment on a loop, with a rest between, so it can be judged.
 * Brand tokens only (D21); none simply spins and pulses, which is what the current thinking state does.
 */

const PACE = { idle: 1, thinking: 1, speaking: 1 }
const TAU = Math.PI * 2
/** Progress 0 → 1 between seconds a and b. */
const seg = (u: number, a: number, b: number) => clamp01((u - a) / (b - a))
const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
/** Out, past the end, and back: a settle with a little life in it. */
const overshoot = (x: number) => { const s = 1.7; return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2 }
const pose = (stage: HTMLDivElement | null, rx: number, ry: number, extra = '') => { if (stage) stage.style.transform = `${extra} rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)` }
const spread = (layers: HTMLDivElement[], n: number, gap: number, each?: (i: number) => string) =>
  layers.forEach((el, i) => { el.style.transform = `translateZ(${depthOf(i, n, gap).toFixed(2)}px) ${each ? each(i) : ''}` })

/** A light layer just in front of the face, clipped to the mark: the band is drawn by `children`. */
function FaceLight({ size, front, children }: { size: number; front: React.RefObject<HTMLDivElement>; children: (clip: string) => ReactNode }) {
  const id = svgId(useId())
  return (
    <div ref={front} className="absolute inset-0 grid place-items-center">
      <svg viewBox={MARK_VIEWBOX} width={size} height={size * (VB_H / VB_W)} className="overflow-visible">
        <defs><clipPath id={`${id}c`}><path d={MARK_TOP} /><path d={MARK_BOTTOM} /></clipPath></defs>
        <g clipPath={`url(#${id}c)`}>{children(id)}</g>
      </svg>
    </div>
  )
}

/** At rest · Breathe: the slices draw apart and close again, slowly, as if breathing in and out. Nothing turns. */
export function Breathe(p: ExpProps) {
  return (
    <HoloStack {...p} n={7} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const b = (1 - Math.cos((t * TAU) / 4.8)) / 2
      pose(stage, 12 + b * 3, -10, `translateY(${(-b * size * 0.012).toFixed(2)}px)`)
      spread(layers, n, size * (0.006 + 0.018 * b))
    }} />
  )
}

/** At rest, or on hover · Glint: now and then a light catches the face on the diagonal, and the mark leans into it. */
export function Glint(p: ExpProps) {
  const b = useBrand()
  const front = useRef<HTMLDivElement>(null)
  const band = useRef<SVGRectElement>(null)
  return (
    <HoloStack {...p} n={7} pace={PACE}
      overlay={<FaceLight size={p.size} front={front}>{(id) => (
        <>
          <defs>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={b[50]} stopOpacity="0" />
              <stop offset="0.5" stopColor={b[50]} stopOpacity="0.95" />
              <stop offset="1" stopColor={b[50]} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect ref={band} x="-30" y="-14" width="12" height="68" fill={`url(#${id}g)`} transform="rotate(24 20.5 16)" opacity={0} />
        </>
      )}</FaceLight>}
      frame={({ t }, { stage, layers, n, size }) => {
        const u = t % 3.2
        const g = seg(u, 0.2, 1.1)
        pose(stage, 12, -10 + Math.sin(g * Math.PI) * 7)
        const gap = size * 0.012
        spread(layers, n, gap)
        if (front.current) front.current.style.transform = `translateZ(${(depthOf(n - 1, n, gap) + 1).toFixed(2)}px)`
        band.current?.setAttribute('x', (-30 + easeInOut(g) * 84).toFixed(2))
        band.current?.setAttribute('opacity', (g > 0 && g < 1 ? 1 : 0).toString())
      }} />
  )
}

/** At rest on Home · Follow: the mark turns a little toward the pointer, its slices opening as the pointer comes near. */
export function Follow(p: ExpProps) {
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const look = useRef({ x: 0, y: 0, near: 0 })
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX, y: e.clientY } }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])
  return (
    <HoloStack {...p} n={7} pace={PACE} frame={({ t, dt }, { stage, layers, n, size }) => {
      const k = look.current
      const box = stage?.parentElement?.getBoundingClientRect()
      let tx = Math.sin(t * 0.5) * 0.3, ty = 0, tn = 0
      if (pointer.current && box) {
        const dx = pointer.current.x - (box.left + box.width / 2), dy = pointer.current.y - (box.top + box.height / 2)
        tx = Math.max(-1, Math.min(1, dx / 500)); ty = Math.max(-1, Math.min(1, dy / 400))
        tn = clamp01(1 - Math.hypot(dx, dy) / (size * 2.2))
      }
      const e = 1 - Math.exp(-dt * 4)
      k.x += (tx - k.x) * e; k.y += (ty - k.y) * e; k.near += (tn - k.near) * e
      pose(stage, 12 - k.y * 18, -6 + k.x * 30)
      spread(layers, n, size * (0.01 + k.near * 0.02))
    }} />
  )
}

/** Listening, while the user types · Ripple: a quick, small wave runs from the face back through the slices, like sound going in. */
export function Ripple(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      pose(stage, 14, -16)
      spread(layers, n, size * 0.014, (i) => {
        const back = n - 1 - i
        const w = Math.sin(t * 6 - back * 0.9) * (back / (n - 1))
        return `translateZ(${(w * size * 0.012).toFixed(2)}px) scale(${(1 + w * 0.03).toFixed(4)})`
      })
    }} />
  )
}

/** Working · Orbit: the mark leans round in a slow circle, like a gyroscope settling, its slices opening and closing. It never spins. */
export function Orbit(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const a = (t * TAU) / 2.6
      pose(stage, 12 + Math.cos(a) * 14, -6 + Math.sin(a) * 18)
      spread(layers, n, size * (0.018 + Math.sin(a * 2) * 0.006))
    }} />
  )
}

/** Working, a beat per step · Split & snap: the two parts draw apart, hold, and snap back together, past centre and settling. */
export function SplitSnap(p: ExpProps) {
  const move = (dir: 1 | -1) => ({ t }: { t: number }, { stage, layers, n, size }: { stage: HTMLDivElement | null; layers: HTMLDivElement[]; n: number; size: number }) => {
    const u = t % 1.8
    const open = easeOut(seg(u, 0, 0.35)) * (1 - overshoot(seg(u, 0.6, 1.05)))
    pose(stage, 12, -10, `translateY(${(-dir * size * 0.07 * open).toFixed(2)}px)`)
    spread(layers, n, size * (0.01 + 0.014 * clamp01(open)))
  }
  return (
    <div className="relative" style={{ width: p.size, height: p.size }}>
      <div className="absolute inset-0"><HoloStack {...p} part="bottom" n={7} pace={PACE} frame={move(-1)} /></div>
      <div className="absolute inset-0"><HoloStack {...p} part="top" n={7} pace={PACE} frame={move(1)} /></div>
    </div>
  )
}

/** Working, a longer wait · Assemble: the slices arrive one by one from the back and build the mark, then leave from the front. */
export function Assemble(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const u = t % 3.6
      pose(stage, 14, -18)
      layers.forEach((el, i) => {
        const a = 0.1 + i * 0.12
        const arrive = easeOut(seg(u, a, a + 0.35))
        const d = 2.5 + (n - 1 - i) * 0.07
        const leave = seg(u, d, d + 0.3)
        el.style.opacity = (arrive * (1 - leave)).toFixed(3)
        el.style.transform = `translateZ(${(depthOf(i, n, size * 0.016) - (1 - arrive) * size * 0.3 + leave * size * 0.12).toFixed(2)}px)`
      })
    }} />
  )
}

/** Arrival, the first time Home opens · Unfold: the mark turns in from edge-on and its slices fan out behind it, settling with a little give. */
export function Unfold(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const u = t % 4.2
      const open = overshoot(seg(u, 0.1, 1.4))
      const out = smooth(seg(u, 3.7, 4.1))
      pose(stage, 12 + (1 - Math.min(open, 1)) * 10, 75 - 85 * open, `scale(${(0.86 + 0.14 * Math.min(open, 1)).toFixed(4)})`)
      if (stage) stage.style.opacity = (smooth(seg(u, 0, 0.25)) * (1 - out)).toFixed(3)
      spread(layers, n, size * 0.02 * Math.max(0, open))
      layers.forEach((el, i) => { el.style.opacity = clamp01(open * 1.3 - ((n - 1 - i) / n) * 0.3).toFixed(3) })
    }} />
  )
}

/** Done, the answer is ready · Flip: one clean turn on its axis, the slices fanning wide mid-turn, landing face-on. */
export function Flip(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const f = easeInOut(seg(t % 3.4, 0.2, 1.3))
      const mid = Math.sin(f * Math.PI)
      pose(stage, 12 + mid * 6, -10 + 360 * f)
      spread(layers, n, size * (0.012 + 0.03 * mid))
    }} />
  )
}

/** Error, it couldn't answer · Shiver: a short shake that runs through the slices out of step, the mark dipping its head, then recovering. */
export function Shiver(p: ExpProps) {
  return (
    <HoloStack {...p} n={9} pace={PACE} frame={({ t }, { stage, layers, n, size }) => {
      const u = t % 3
      const on = u > 0.2 && u < 0.95
      const amp = on ? (1 - seg(u, 0.2, 0.95)) ** 1.5 : 0
      const dip = smooth(seg(u, 0.2, 0.5)) * (1 - smooth(seg(u, 1.4, 2.3)))
      pose(stage, 12 + dip * 12, -10)
      spread(layers, n, size * 0.012, (i) => `translateX(${(Math.sin((u - (n - 1 - i) * 0.025) * 48) * amp * size * 0.03).toFixed(2)}px)`)
    }} />
  )
}
