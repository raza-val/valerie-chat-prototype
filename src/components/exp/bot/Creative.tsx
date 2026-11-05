import { useId, useLayoutEffect, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, useFrames, type ExpProps } from '../motion'
import { CX, CY, useBrand, VB_H, VB_W } from './palette'

/**
 * Taking the mark further: the logo as a starting point, not a boundary. Each keeps Echo's finish (brand gradient,
 * hairlines, no hard effects) but turns the mark into something else: silk, light through a prism.
 */

const PARTS = [MARK_TOP, MARK_BOTTOM]
const about = (s: number, rot = 0, dx = 0, dy = 0) => `translate(${(CX + dx).toFixed(3)} ${(CY + dy).toFixed(3)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`
const Frame = ({ size, children }: { size: number; children: React.ReactNode }) => (
  <div className="grid place-items-center" style={{ width: size, height: size }}>
    <svg viewBox={MARK_VIEWBOX} width={size} height={size * (VB_H / VB_W)} className="overflow-visible">{children}</svg>
  </div>
)

/**
 * Silk: the mark's outline spun from fine strands that lie together as one soft edge. Thinking: the strands loosen
 * into waves that run round the shape. Speaking: the waves follow the voice.
 */
export function Silk({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const strands = size < 48 ? 4 : 9
  const probes = useRef<SVGPathElement[]>([])
  const lines = useRef<SVGPolylineElement[]>([])
  const shape = useRef<{ x: number; y: number; nx: number; ny: number; u: number }[][]>([])

  // Sample each part's outline once: points with their outward normals.
  useLayoutEffect(() => {
    shape.current = probes.current.map((p) => {
      const len = p.getTotalLength(), n = 160
      const pts = Array.from({ length: n }, (_, i) => p.getPointAtLength((i / n) * len))
      return pts.map((pt, i) => {
        const a = pts[(i - 1 + n) % n], c = pts[(i + 1) % n]
        const tx = c.x - a.x, ty = c.y - a.y, l = Math.hypot(tx, ty) || 1
        return { x: pt.x, y: pt.y, nx: ty / l, ny: -tx / l, u: i / n }
      })
    })
  }, [])

  useFrames(state, { idle: 0.7, thinking: 1.4, speaking: 1 }, ({ t, think, level }) => {
    const amp = 0.28 + think * 1.4 + level * 1.2
    const spread = 0.16 + think * 0.18
    shape.current.forEach((pts, part) => {
      for (let j = 0; j < strands; j++) {
        const el = lines.current[part * strands + j]
        if (!el) continue
        const off = (j - (strands - 1) / 2) * spread
        el.setAttribute('points', pts.map((p) => {
          const d = off + amp * Math.sin(p.u * Math.PI * 2 * (3 + part) + t * 2.2 + j * 0.45) * (0.4 + 0.6 * Math.sin(p.u * Math.PI * 2 - t * 0.7) ** 2)
          return `${(p.x + p.nx * d).toFixed(2)},${(p.y + p.ny * d).toFixed(2)}`
        }).join(' ') + ` ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`)
      }
    })
  }, voice)

  return (
    <Frame size={size}>
      <defs>
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="41" y2="32">
          <stop offset="0" stopColor={b.dark ? b[200] : b[400]} />
          <stop offset="1" stopColor={b.dark ? b[400] : b[700]} />
        </linearGradient>
      </defs>
      {PARTS.map((d, i) => <path key={d} ref={(el) => { if (el) probes.current[i] = el }} d={d} fill={`url(#${id}s)`} opacity={0.12} />)}
      {PARTS.flatMap((_, part) => Array.from({ length: strands }, (_, j) => (
        <polyline key={`${part}${j}`} ref={(el) => { if (el) lines.current[part * strands + j] = el }} fill="none" stroke={`url(#${id}s)`} strokeWidth={Math.max(0.6, size / 220)} vectorEffect="non-scaling-stroke" strokeLinejoin="round"
          opacity={(1 - Math.abs(j - (strands - 1) / 2) / strands) * 0.9} />
      )))}
    </Frame>
  )
}

/**
 * Prism: three tints of the mark laid exactly over each other. At rest they shiver apart enough to show a coloured edge.
 * Thinking: they split like light through a prism and circle the centre, then recombine. Speaking: they part with the voice.
 */
export function Prism({ state, size, voice }: ExpProps) {
  const b = useBrand()
  const layers = useRef<SVGGElement[]>([])
  const tints = b.dark ? [b[300], b[500], b[200]] : [b[300], b[500], b[800]]

  useFrames(state, { idle: 0.8, thinking: 1.2, speaking: 1 }, ({ t, think, level }) => {
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6)
    const r = 0.35 + think * (2.6 * pulse + 0.4) + level * 1.8
    layers.current.forEach((g, i) => {
      const a = t * 0.9 + (i / 3) * Math.PI * 2
      g.setAttribute('transform', about(1 - think * 0.08, (i - 1) * think * 7 * pulse, Math.cos(a) * r, Math.sin(a) * r * 0.8))
    })
  }, voice)

  return (
    <Frame size={size}>
      {tints.map((c, i) => (
        <g key={i} ref={(el) => { if (el) layers.current[i] = el }} opacity={0.78} style={{ mixBlendMode: b.dark ? 'screen' : 'multiply' }}>
          {PARTS.map((d) => <path key={d} d={d} fill={c} />)}
        </g>
      ))}
    </Frame>
  )
}
