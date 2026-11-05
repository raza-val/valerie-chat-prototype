import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, useFrames, type ExpProps } from '../motion'
import { CX, CY, useBrand, VB_H, VB_W, type Brand } from './palette'

/**
 * Echo, developed: the same language as Echo (hairline outlines of the mark around one solid core, brand gradient,
 * nothing filled but the core), each with its own idea of motion. Fewer echoes at small sizes so they stay legible.
 */

const CORE = 0.58
const about = (cx: number, cy: number, s: number, rot = 0, dx = 0, dy = 0) =>
  `translate(${(cx + dx).toFixed(3)} ${(cy + dy).toFixed(3)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`
const count = (size: number, n: number) => (size < 48 ? Math.min(4, n) : n)

function Defs({ id, b }: { id: string; b: Brand }) {
  return (
    <defs>
      <linearGradient id={`${id}core`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor={b[300]} />
        <stop offset="1" stopColor={b.dark ? b[500] : b[700]} />
      </linearGradient>
      <linearGradient id={`${id}line`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="32">
        <stop offset="0" stopColor={b.dark ? b[200] : b[400]} />
        <stop offset="1" stopColor={b.dark ? b[400] : b[600]} />
      </linearGradient>
    </defs>
  )
}
const lineProps = (id: string, size: number) => ({ fill: 'none', stroke: `url(#${id}line)`, strokeWidth: Math.max(0.75, size / 160), vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' } as const)
const Outline = ({ id, size, part }: { id: string; size: number; part?: 'top' | 'bottom' }) => (
  <>
    {part !== 'bottom' && <path d={MARK_TOP} {...lineProps(id, size)} />}
    {part !== 'top' && <path d={MARK_BOTTOM} {...lineProps(id, size)} />}
  </>
)
const Core = ({ id }: { id: string }) => (<><path d={MARK_TOP} fill={`url(#${id}core)`} /><path d={MARK_BOTTOM} fill={`url(#${id}core)`} /></>)
const Frame = ({ size, children }: { size: number; children: React.ReactNode }) => (
  <div className="grid place-items-center" style={{ width: size, height: size }}>
    <svg viewBox={MARK_VIEWBOX} width={size} height={size * (VB_H / VB_W)} className="overflow-visible">{children}</svg>
  </div>
)

/**
 * Echo · Depth: the Hologram told in Echo's hand. The echoes hang behind the core in space, the stack turning gently.
 * Idle: they drift back and fade. Thinking: they come forward through the depth and merge into the core. Speaking: the depth breathes with the voice.
 */
export function EchoDepth({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const n = count(size, 8)
  const stage = useRef<HTMLDivElement>(null)
  const layers = useRef<HTMLDivElement[]>([])
  const phase = useRef(0)
  const lastT = useRef(0)

  useFrames(state, { idle: 1, thinking: 1, speaking: 1 }, ({ t, think, level }) => {
    phase.current += (t - lastT.current) * (0.12 - 0.62 * think)
    lastT.current = t
    if (stage.current) stage.current.style.transform = `rotateX(${10 + think * 8}deg) rotateY(${Math.sin(t * 0.6) * 22}deg)`
    const depth = size * (0.42 + level * 0.18)
    layers.current.forEach((el, i) => {
      const p = (((i / n + phase.current) % 1) + 1) % 1
      el.style.transform = `translateZ(${(-p * depth).toFixed(2)}px)`
      el.style.opacity = (Math.min(1, p / 0.12) * (1 - p) ** 1.3).toFixed(3)
    })
  }, voice)

  const box = { width: size, height: size }
  const svg = (children: React.ReactNode) => (
    <svg viewBox={MARK_VIEWBOX} width={size * 0.8} height={size * 0.8 * (VB_H / VB_W)} className="overflow-visible"><Defs id={id} b={b} />{children}</svg>
  )
  return (
    <div style={{ ...box, perspective: size * 3 }}>
      <div ref={stage} className="relative" style={{ ...box, transformStyle: 'preserve-3d' }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} ref={(el) => { if (el) layers.current[i] = el }} className="absolute inset-0 grid place-items-center" style={{ opacity: 0 }}>{svg(<Outline id={id} size={size} />)}</div>
        ))}
        <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translateZ(1px)' }}>{svg(<Core id={id} />)}</div>
      </div>
    </div>
  )
}

/** The middles of the mark's two parts, in its own units. */
const TOP_C = { x: CX, y: 7 }
const BOTTOM_C = { x: CX, y: 24 }

/**
 * Echo · Split: each part of the mark echoes along its own way, the crown upward, the swoop downward.
 * Thinking: the echoes turn round and close into the gap between the parts. Speaking: they push apart with the voice.
 */
export function EchoSplit({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const n = count(size, 6)
  const tops = useRef<SVGGElement[]>([])
  const bottoms = useRef<SVGGElement[]>([])
  const phase = useRef(0)
  const lastT = useRef(0)

  useFrames(state, { idle: 0.22, thinking: 0.7, speaking: 0.45 }, ({ t, think, level }) => {
    phase.current += (t - lastT.current) * (1 - 2 * think)
    lastT.current = t
    const reach = 7 + level * 4
    for (let i = 0; i < n; i++) {
      const p = (((i / n + phase.current) % 1) + 1) % 1
      const o = (Math.sin(p * Math.PI) ** 1.4).toFixed(3)
      const s = 1 + p * 0.18
      tops.current[i]?.setAttribute('transform', about(TOP_C.x, TOP_C.y, s, 0, 0, -p * reach))
      bottoms.current[i]?.setAttribute('transform', about(BOTTOM_C.x, BOTTOM_C.y, s, 0, 0, p * reach))
      tops.current[i]?.setAttribute('opacity', o)
      bottoms.current[i]?.setAttribute('opacity', o)
    }
  }, voice)

  return (
    <Frame size={size}>
      <Defs id={id} b={b} />
      <g transform={about(CX, CY, 0.74)}>
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <g ref={(el) => { if (el) tops.current[i] = el }} opacity={0}><Outline id={id} size={size} part="top" /></g>
            <g ref={(el) => { if (el) bottoms.current[i] = el }} opacity={0}><Outline id={id} size={size} part="bottom" /></g>
          </g>
        ))}
        <Core id={id} />
      </g>
    </Frame>
  )
}

/**
 * Echo · Rosette: the echoes stand still, nested round the core, and a light runs out through them, ring after ring.
 * Thinking: they turn against each other into a rosette, then settle back in line. Speaking: they ripple with the voice.
 */
export function EchoRosette({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const n = count(size, 5)
  const rings = useRef<SVGGElement[]>([])
  const spin = useRef(0)
  const lastT = useRef(0)

  useFrames(state, { idle: 1, thinking: 1, speaking: 1 }, ({ t, think, level }) => {
    spin.current += (t - lastT.current) * think
    lastT.current = t
    rings.current.forEach((g, i) => {
      const k = (i + 1) / n
      const rot = (i % 2 ? -1 : 1) * (i + 1) * 9 * Math.sin(spin.current * 1.3) * think
      const s = CORE + k * 0.42 + level * 0.06 * Math.max(0, Math.sin(t * 9 - i * 0.9))
      const glow = 0.16 + 0.7 * Math.max(0, Math.cos(t * 1.8 - i * 0.9)) ** 3
      g.setAttribute('transform', about(CX, CY, s, rot))
      g.setAttribute('opacity', (glow * (1 - think) + (0.75 - k * 0.35) * think).toFixed(3))
    })
  }, voice)

  return (
    <Frame size={size}>
      <Defs id={id} b={b} />
      {Array.from({ length: n }, (_, i) => <g key={i} ref={(el) => { if (el) rings.current[i] = el }} opacity={0.2}><Outline id={id} size={size} /></g>)}
      <g transform={about(CX, CY, CORE)}><Core id={id} /></g>
    </Frame>
  )
}

/**
 * Echo · Trail: the core moves on a slow figure of eight and its echoes are where it has just been, a motion trail.
 * Thinking: the path widens and quickens, the trail lengthens. Speaking: the trail fans out with the voice.
 */
export function EchoTrail({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const n = count(size, 7)
  const trail = useRef<SVGGElement[]>([])
  const core = useRef<SVGGElement>(null)
  const amp = useRef(0)

  useFrames(state, { idle: 0.55, thinking: 1.5, speaking: 0.8 }, ({ t, think, level }) => {
    amp.current = 2.2 + think * 3.8
    const at = (s: number) => ({ x: Math.sin(s * 0.9) * amp.current, y: Math.sin(s * 1.8) * amp.current * 0.45 })
    const lag = 0.09 + think * 0.05 + level * 0.08
    const now = at(t)
    core.current?.setAttribute('transform', about(CX, CY, CORE, 0, now.x, now.y))
    trail.current.forEach((g, i) => {
      const k = (i + 1) / n
      const was = at(t - (i + 1) * lag)
      g.setAttribute('transform', about(CX, CY, CORE * (1 + k * 0.12), 0, was.x, was.y))
      g.setAttribute('opacity', ((1 - k) ** 1.5 * 0.9).toFixed(3))
    })
  }, voice)

  return (
    <Frame size={size}>
      <Defs id={id} b={b} />
      {Array.from({ length: n }, (_, i) => <g key={i} ref={(el) => { if (el) trail.current[i] = el }} opacity={0}><Outline id={id} size={size} /></g>)}
      <g ref={core}><Core id={id} /></g>
    </Frame>
  )
}
