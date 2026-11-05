import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, type ExpProps } from '../motion'
import { HoloStack, depthOf } from './HoloStack'
import { hash, useBrand, VB_H, VB_W } from './palette'

/**
 * New motion for the Hologram (v4's Aura). The body is the same slice stack; what changes is how it moves,
 * so none of them simply pulses. Each reads idle, thinking and speaking differently.
 */

/** Helix: a wave rolls back through the slices. Thinking: the stack winds into a corkscrew and unwinds. */
export function HoloHelix(p: ExpProps) {
  return (
    <HoloStack {...p} n={11} pace={{ idle: 0.8, thinking: 1.6, speaking: 1 }} frame={({ t, think, level }, { stage, layers, n, size }) => {
      if (stage) stage.style.transform = `rotateX(${16 + think * 10}deg) rotateY(${Math.sin(t * 0.6) * 22 - think * 18}deg)`
      const gap = size * (0.016 + think * 0.012 + level * 0.02)
      layers.forEach((el, i) => {
        const back = n - 1 - i
        const wave = Math.sin(t * 2.2 - back * 0.6) * 5 * (1 - think)
        const twist = back * think * (18 + Math.sin(t * 1.4) * 10)
        const r = think * size * 0.035 * (back / (n - 1))
        const x = Math.cos(t * 2.4 + back * 0.7) * r, y = Math.sin(t * 2.4 + back * 0.7) * r
        el.style.transform = `translateZ(${depthOf(i, n, gap)}px) translate(${x}px, ${y}px) rotateZ(${wave + twist}deg)`
      })
    }} />
  )
}

/** Scan: a band of light reads down the face, over scanlines. Thinking: slices jump out of line and the colour splits. */
export function HoloScan(p: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const over = useRef<HTMLDivElement>(null)
  const band = useRef<SVGRectElement>(null)
  const lines = useRef<SVGRectElement>(null)
  const split = useRef<SVGGElement[]>([])
  const unit = VB_W / p.size
  const sw = Math.max(0.3, 1.2 * unit)

  const overlay = (
    <div ref={over} className="absolute inset-0 grid place-items-center">
      <svg viewBox={MARK_VIEWBOX} width={p.size} height={p.size * (VB_H / VB_W)} className="overflow-visible">
        <defs>
          <clipPath id={`${id}c`}><path d={MARK_TOP} /><path d={MARK_BOTTOM} /></clipPath>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={b[50]} stopOpacity="0" />
            <stop offset="0.5" stopColor={b[50]} stopOpacity="0.95" />
            <stop offset="1" stopColor={b[50]} stopOpacity="0" />
          </linearGradient>
          <pattern id={`${id}s`} width="49" height="1.1" patternUnits="userSpaceOnUse"><rect width="49" height="0.35" fill={b[50]} /></pattern>
        </defs>
        {[b[300], b[800]].map((c, i) => (
          <g key={c} ref={(el) => { if (el) split.current[i] = el }} opacity={0}>
            <path d={MARK_TOP} fill="none" stroke={c} strokeWidth={sw} />
            <path d={MARK_BOTTOM} fill="none" stroke={c} strokeWidth={sw} />
          </g>
        ))}
        <g clipPath={`url(#${id}c)`}>
          <rect ref={lines} x="-4" y="-4" width="49" height="40" fill={`url(#${id}s)`} opacity="0.2" />
          <rect ref={band} x="-4" y="-10" width="49" height="7" fill={`url(#${id}b)`} />
        </g>
      </svg>
    </div>
  )

  return (
    <HoloStack {...p} overlay={overlay} pace={{ idle: 0.8, thinking: 1.2, speaking: 1 }} frame={({ t, think, level }, { stage, layers, n, size }) => {
      if (stage) stage.style.transform = `rotateX(10deg) rotateY(${Math.sin(t * 0.7) * 18}deg)`
      const gap = size * (0.012 + level * 0.015)
      const step = Math.floor(t * 7)
      layers.forEach((el, i) => {
        const jump = hash(step * 7 + i * 3) > 0.55 ? (hash(step * 31 + i) - 0.5) * size * 0.09 * think : 0
        el.style.transform = `translateZ(${depthOf(i, n, gap)}px) translateX(${jump}px)`
      })
      if (over.current) over.current.style.transform = `translateZ(${depthOf(n - 1, n, gap) + 1}px)`
      band.current?.setAttribute('y', (-10 + ((t * 0.45) % 1) * 52).toFixed(2))
      band.current?.setAttribute('opacity', (0.55 + level * 0.45).toFixed(3))
      lines.current?.setAttribute('opacity', (0.15 + think * 0.15 + level * 0.25).toFixed(3))
      const off = think * size * 0.02 * (hash(step) > 0.4 ? 1 : 0.2) * unit
      split.current.forEach((g, i) => {
        g.setAttribute('transform', `translate(${i ? -off : off} 0)`)
        g.setAttribute('opacity', (think * 0.8).toFixed(3))
      })
    }} />
  )
}

/** Flow: seen from the side, slices drift through the mark front to back. Thinking: a stream of them, like data passing through. */
export function HoloFlow(p: ExpProps) {
  return (
    <HoloStack {...p} n={12} pace={{ idle: 0.5, thinking: 1.8, speaking: 1 }} frame={({ t, think, level }, { stage, layers, n, size }) => {
      if (stage) stage.style.transform = `rotateX(12deg) rotateY(${-26 - think * 22 + Math.sin(t * 0.5) * 8}deg)`
      const span = size * (0.16 + think * 0.34 + level * 0.12)
      layers.forEach((el, i) => {
        if (i === n - 1) { el.style.transform = 'translateZ(0px)'; return }
        const ph = (i / (n - 1) + t * 0.35) % 1
        el.style.transform = `translateZ(${(ph - 0.5) * span * 2}px)`
        el.style.opacity = (Math.sin(ph * Math.PI) ** 1.2).toFixed(3)
      })
    }} />
  )
}

/** Gyro: the crown and the swoop float apart. Thinking: they spin against each other like the rings of a gyroscope. */
export function HoloGyro(p: ExpProps) {
  const move = (dir: 1 | -1) => ({ t, think, level }: { t: number; think: number; level: number }, { stage, layers, n, size }: { stage: HTMLDivElement | null; layers: HTMLDivElement[]; n: number; size: number }) => {
    const gap = size * (think * 0.07 + level * 0.05)
    const spin = t * 90 * think + Math.sin(t * 0.8) * 18 * (1 - think)
    if (stage) stage.style.transform = `translateY(${-dir * gap}px) rotateX(${12 + think * 14}deg) rotateY(${dir * spin}deg)`
    const z = size * (0.012 + think * 0.01)
    layers.forEach((el, i) => { el.style.transform = `translateZ(${depthOf(i, n, z)}px)` })
  }
  return (
    <div className="relative" style={{ width: p.size, height: p.size }}>
      <div className="absolute inset-0"><HoloStack {...p} part="bottom" n={7} pace={{ idle: 0.8, thinking: 1.4, speaking: 1 }} frame={move(-1)} /></div>
      <div className="absolute inset-0"><HoloStack {...p} part="top" n={7} pace={{ idle: 0.8, thinking: 1.4, speaking: 1 }} frame={move(1)} /></div>
    </div>
  )
}
