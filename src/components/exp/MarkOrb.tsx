import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP } from '@/components/brand/mark'
import { useCssVar } from '@/lib/aura'
import { svgId, useFrames, type ExpProps } from './motion'

/** Figma (AI-chat-screen, "Orb" 122:36999): the mark's box in the 120 sphere, 58 wide from (31, 37.38). */
const MARK = 'translate(31 37.3776) scale(1.41393)'
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

/**
 * Mark orb: the Valerie mark in white on a navy sphere, lit from inside (Figma "Orb" 122:36999). At rest it is the
 * Figma frame, the lights drifting a little. Thinking: the two lights circle the sphere, the mark glows and a glint
 * crosses it. Speaking: the mark and its glow swell with the voice.
 */
export function MarkOrb({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const c = { 600: useCssVar('--brand-600'), 800: useCssVar('--brand-800'), 950: useCssVar('--brand-950'), 50: useCssVar('--brand-50') }
  const depth = useRef<SVGCircleElement>(null)
  const rim = useRef<SVGCircleElement>(null)
  const mark = useRef<SVGGElement>(null)
  const glow = useRef<SVGGElement>(null)
  const glint = useRef<SVGLinearGradientElement>(null)
  const glintMark = useRef<SVGGElement>(null)

  useFrames(state, { idle: 0.5, thinking: 2.2, speaking: 0.9 }, ({ t, think, level }) => {
    // The lights sit where Figma puts them and drift; thinking, they swing round the sphere, opposite each other.
    const a = t * 1.3
    depth.current?.setAttribute('cx', String(lerp(42 + Math.sin(t) * 4, 60 + Math.cos(a) * 26, think)))
    depth.current?.setAttribute('cy', String(lerp(32 + Math.cos(t * 0.8) * 3, 60 + Math.sin(a) * 26, think)))
    rim.current?.setAttribute('cx', String(lerp(98 - Math.sin(t * 0.9) * 3, 60 - Math.cos(a) * 34, think)))
    rim.current?.setAttribute('cy', String(lerp(100 - Math.cos(t * 0.7) * 3, 60 - Math.sin(a) * 34, think)))
    rim.current?.setAttribute('opacity', String(0.42 + think * 0.3))
    const s = 1 + level * 0.1 + think * 0.035 * Math.sin(t * 3)
    mark.current?.setAttribute('transform', `translate(60 60) scale(${s}) translate(-60 -60)`)
    glow.current?.setAttribute('opacity', String(Math.min(0.8, think * (0.35 + 0.2 * Math.sin(t * 3)) + level * 0.7)))
    // A glint sweeps the mark left to right about once a second while thinking.
    const x = ((t * 0.45) % 1.6) - 0.3
    glint.current?.setAttribute('x1', String(x - 0.25))
    glint.current?.setAttribute('x2', String(x + 0.25))
    glintMark.current?.setAttribute('opacity', String(think))
  }, voice)

  const paths = (fill: string) => <g transform={MARK}><path d={MARK_TOP} fill={fill} /><path d={MARK_BOTTOM} fill={fill} /></g>
  const blur = (name: string, sd: number) => (
    <filter id={`${id}${name}`} x="-60" y="-60" width="240" height="240" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation={sd} /></filter>
  )

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="block overflow-visible">
      <defs>
        <clipPath id={`${id}c`}><circle cx="60" cy="60" r="60" /></clipPath>
        {blur('d', 11)}
        {blur('r', 9)}
        {blur('s', 5)}
        {blur('g', 4)}
        <linearGradient ref={glint} id={`${id}l`} x1="-0.55" x2="-0.05" y1="0" y2="0.3">
          <stop offset="0" stopColor={c[50]} stopOpacity="0" />
          <stop offset="0.5" stopColor={c[600]} stopOpacity="0.55" />
          <stop offset="1" stopColor={c[50]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="120" height="120" fill={c[950]} />
        <circle ref={depth} cx="42" cy="32" r="42" fill={c[800]} opacity="0.8" filter={`url(#${id}d)`} />
        <circle ref={rim} cx="98" cy="100" r="32" fill={c[600]} opacity="0.42" filter={`url(#${id}r)`} />
        <ellipse cx="50" cy="19" rx="24" ry="9" fill={c[50]} opacity="0.14" filter={`url(#${id}s)`} />
        <g ref={mark}>
          <g ref={glow} opacity="0" filter={`url(#${id}g)`}>{paths(c[50])}</g>
          {paths(c[50])}
          <g ref={glintMark} opacity="0">{paths(`url(#${id}l)`)}</g>
        </g>
      </g>
      <circle cx="60" cy="60" r="59.5" fill="none" stroke={c[800]} />
    </svg>
  )
}
