import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, useFrames, type ExpProps } from '../motion'
import { smooth, useBrand, VB_H, VB_W } from './palette'

/**
 * Hinge: the mark's two parts, the crown and the swoop, as one mechanism. Idle: they breathe a little apart and sway.
 * Thinking: the crown flips over, then the swoop turns, in turn, with a spark of light in the gap. Speaking: they part with the voice.
 */
export function Hinge({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const b = useBrand()
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const spark = useRef<HTMLDivElement>(null)

  useFrames(state, { idle: 0.7, thinking: 1, speaking: 1 }, ({ t, think, level }) => {
    const phase = (t / 1.8) % 1
    const flipTop = 360 * smooth(phase / 0.45) * think
    const flipBottom = 360 * smooth((phase - 0.5) / 0.45) * think
    const gap = size * (0.012 + 0.012 * Math.sin(t * 1.3) + think * 0.05 + level * 0.07)
    const sway = Math.sin(t * 0.8) * 12 * (1 - think)
    if (top.current) top.current.style.transform = `translateY(${-gap}px) rotateY(${sway}deg) rotateX(${flipTop}deg)`
    if (bottom.current) bottom.current.style.transform = `translateY(${gap}px) rotateY(${-sway + flipBottom}deg)`
    if (spark.current) {
      spark.current.style.opacity = Math.min(1, think * 0.9 + level * 0.6).toFixed(3)
      spark.current.style.transform = `scaleX(${(0.35 + 0.65 * Math.abs(Math.sin(t * 3))).toFixed(3)})`
    }
  }, voice)

  const h = size * (VB_H / VB_W)
  const part = (d: string, from: string, to: string) => (
    <svg viewBox={MARK_VIEWBOX} width={size} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`${id}${from}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}${from})`} />
    </svg>
  )
  return (
    <div className="grid place-items-center" style={{ width: size, height: size, perspective: size * 4 }}>
      <div className="relative" style={{ width: size, height: h, transformStyle: 'preserve-3d' }}>
        <div ref={spark} className="absolute left-[20%] right-[20%]" style={{ top: '46.5%', height: Math.max(1, size / 90), background: `linear-gradient(90deg, transparent, ${b.dark ? b[200] : b[400]}, transparent)`, opacity: 0 }} />
        <div ref={top} className="absolute inset-0" style={{ transformOrigin: '50% 27.5%' }}>{part(MARK_TOP, b[300], b.dark ? b[500] : b[600])}</div>
        <div ref={bottom} className="absolute inset-0" style={{ transformOrigin: '50% 70%' }}>{part(MARK_BOTTOM, b[400], b.dark ? b[600] : b[800])}</div>
      </div>
    </div>
  )
}
