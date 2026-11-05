import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, useFrames, type ExpProps } from '../motion'
import { CX, CY, VB_H, VB_W, useBrand } from './palette'

const N = 7
const CORE = 0.58

/**
 * Echo: the mark sends out outlines of itself, like sonar. Idle: they drift out and fade.
 * Thinking: they turn round and spiral back into the mark, taking things in. Speaking: they push out with the voice.
 */
export function Echo({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const rings = useRef<SVGGElement[]>([])
  const core = useRef<SVGGElement>(null)
  const phase = useRef(0)
  const lastT = useRef(0)

  useFrames(state, { idle: 0.22, thinking: 0.7, speaking: 0.45 }, ({ t, think, level }) => {
    phase.current += (t - lastT.current) * (1 - 2 * think)
    lastT.current = t
    rings.current.forEach((g, i) => {
      const p = (((i / N + phase.current) % 1) + 1) % 1
      const s = CORE + p * (0.5 + level * 0.3)
      const rot = think * (1 - p) * 55
      g.setAttribute('transform', `translate(${CX} ${CY}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`)
      g.setAttribute('opacity', (Math.sin(p * Math.PI) ** 1.4).toFixed(3))
    })
    core.current?.setAttribute('transform', `translate(${CX} ${CY}) scale(${(CORE * (1 + level * 0.08)).toFixed(4)}) translate(${-CX} ${-CY})`)
  }, voice)

  const line = b.dark ? b[300] : b[500]
  const outline = { fill: 'none', stroke: line, strokeWidth: Math.max(0.75, size / 160), vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' } as const
  return (
    <div className="grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={MARK_VIEWBOX} width={size} height={size * (VB_H / VB_W)} className="overflow-visible">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor={b[300]} />
            <stop offset="1" stopColor={b.dark ? b[500] : b[700]} />
          </linearGradient>
        </defs>
        {Array.from({ length: N }, (_, i) => (
          <g key={i} ref={(el) => { if (el) rings.current[i] = el }} opacity={0}>
            <path d={MARK_TOP} {...outline} />
            <path d={MARK_BOTTOM} {...outline} />
          </g>
        ))}
        <g ref={core}>
          <path d={MARK_TOP} fill={`url(#${id}g)`} />
          <path d={MARK_BOTTOM} fill={`url(#${id}g)`} />
        </g>
      </svg>
    </div>
  )
}
