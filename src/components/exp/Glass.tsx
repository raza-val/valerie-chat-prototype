import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP } from '@/components/brand/mark'
import { useCssVar, useDark } from '@/lib/aura'
import { svgId, useFrames, type ExpProps } from './motion'

const CX = 20.5
const CY = 16

/**
 * Glass: the mark as a cut-glass object. Coloured light drifts behind it and, bent, through it;
 * a rim catches the light and a glint crosses the face.
 * Thinking: the two halves part, the light speeds up and the glint keeps sweeping. Speaking: it swells with the voice.
 */
export function Glass({ state, size, voice }: ExpProps) {
  const id = svgId(useId())
  const dark = useDark()
  const c = { 50: useCssVar('--brand-50'), 200: useCssVar('--brand-200'), 300: useCssVar('--brand-300'), 400: useCssVar('--brand-400'), 600: useCssVar('--brand-600'), accent: useCssVar('--brand-accent') }
  const root = useRef<SVGGElement>(null)
  const top = useRef<SVGPathElement[]>([])
  const bottom = useRef<SVGPathElement[]>([])
  const blobs = useRef<SVGCircleElement[]>([])
  const glint = useRef<SVGRectElement>(null)
  const halo = useRef<SVGGElement>(null)

  useFrames(state, { idle: 0.5, thinking: 2.2, speaking: 0.9 }, ({ t, think, level }) => {
    const part = think * 1.3 + level * 0.5
    top.current.forEach((g) => g.setAttribute('transform', `translate(0 ${-part})`))
    bottom.current.forEach((g) => g.setAttribute('transform', `translate(0 ${part})`))
    root.current?.setAttribute('transform', `translate(${CX} ${CY}) scale(${1 + level * 0.06}) translate(${-CX} ${-CY})`)
    // Three lights orbit the centre; the copy inside the glass moves further (refraction).
    blobs.current.forEach((b, i) => {
      const inner = i >= 3
      const k = i % 3
      const a = t * (0.7 + k * 0.23) + k * 2.1
      const r = (inner ? 9 : 6) + think * 2
      b.setAttribute('cx', String(CX + Math.cos(a) * r * (inner ? -1 : 1)))
      b.setAttribute('cy', String(CY + Math.sin(a * 1.3) * r * 0.6))
    })
    halo.current?.setAttribute('opacity', String((dark ? 0.55 : 0.3) + think * 0.25 + level * 0.3))
    // The glint: one pass every few seconds at rest, back to back while thinking.
    const period = 4.5 - think * 3.2
    const p = (t % period) / period
    glint.current?.setAttribute('x', String(-24 + p * 90))
  }, voice)

  // Each copy of the mark (clip, inner rim, dispersion, rim) is two paths, so the halves can part.
  const halves: [string, React.MutableRefObject<SVGPathElement[]>][] = [[MARK_TOP, top], [MARK_BOTTOM, bottom]]
  const shape = (slot: number, props: React.SVGProps<SVGPathElement>) =>
    halves.map(([d, ref], i) => <path key={i} ref={(el) => { if (el) ref.current[slot] = el }} d={d} {...props} />)
  const lights = dark ? [c[400], c[300], c[600]] : [c[600], c[400], c[300]]

  return (
    <svg viewBox="-8 -8 57 48" width={size} height={size * (48 / 57)} className="overflow-visible">
      <defs>
        <clipPath id={`${id}c`}>{shape(0, {})}</clipPath>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id={`${id}s`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
        <filter id={`${id}r`}><feGaussianBlur stdDeviation="0.5" /></filter>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dark ? c[50] : c[300]} stopOpacity="0.95" />
          <stop offset="0.5" stopColor={dark ? c[300] : c[600]} stopOpacity={dark ? 0.35 : 0.55} />
          <stop offset="1" stopColor={dark ? c[50] : c[400]} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c[50]} stopOpacity={dark ? 0.35 : 0.6} />
          <stop offset="0.55" stopColor={c[50]} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c[50]} stopOpacity="0" />
          <stop offset="0.5" stopColor={c[50]} stopOpacity="0.85" />
          <stop offset="1" stopColor={c[50]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g ref={root}>
        {/* The light behind the glass */}
        <g ref={halo} filter={`url(#${id}b)`}>
          {lights.map((col, i) => <circle key={i} ref={(el) => { if (el) blobs.current[i] = el }} r={7 - i} fill={col} />)}
        </g>
        {/* The glass: a frosted body, the light bent through it, a sheen, an inner rim and the glint */}
        <g clipPath={`url(#${id}c)`}>
          <rect x="-8" y="-8" width="57" height="48" fill={dark ? c[400] : c[200]} opacity={dark ? 0.22 : 0.7} />
          <g filter={`url(#${id}s)`}>
            {lights.map((col, i) => <circle key={i} ref={(el) => { if (el) blobs.current[i + 3] = el }} r={6 - i} fill={col} opacity="0.95" />)}
          </g>
          <rect x="-8" y="-8" width="57" height="48" fill={`url(#${id}sheen)`} />
          <g filter={`url(#${id}r)`} opacity="0.75">{shape(1, { fill: 'none', stroke: c[50], strokeWidth: 1.2 })}</g>
          <rect ref={glint} y="-8" width="10" height="48" fill={`url(#${id}g)`} transform="skewX(-24)" opacity="0.7" />
        </g>
        {/* Dispersion: a warm edge offset from the cool rim, the logo's amber as the split light */}
        <g transform="translate(0.18 0.22)" opacity="0.45">{shape(2, { fill: 'none', stroke: c.accent, strokeWidth: 0.22 })}</g>
        {shape(3, { fill: 'none', stroke: `url(#${id}rim)`, strokeWidth: 0.32 })}
      </g>
    </svg>
  )
}
