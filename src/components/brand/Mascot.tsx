import { forwardRef, lazy, Suspense, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'
import { CHROME_TINT, chromePresets, type ChromeShape } from '@/lib/aura'
import { reducedMotion } from '@/lib/motion'
import type { Body } from './MascotShaderBody'
import { Constellation } from './Constellation'

const AuraMetal = lazy(() => import('./AuraMetal'))
/** The lab-only shader bodies, loaded on demand so Paper's shader code stays out of the first paint. */
const ShaderBody = lazy(() => import('./MascotShaderBody'))

/**
 * Valerie's mascot. Aura is hex-liquid; the other four are kept for leadership to compare (/lab?view=character):
 * - hex-liquid: the polished hexagon's outline (point up, no kinks) cast in Paper's liquid metal, classic chrome.
 *   The bands flow faster as it thinks.
 * - cloud-liquid: a full cloud in the same chrome.
 * - constellation: the Valerie sparkle drawn in data points, abstract, no face (Version B's Aura; see Constellation).
 * - hex-chrome: a rounded hexagon inflated into a chrome pebble that reflects a turning photo studio; wobbles as it thinks.
 * - cloud-soft: a 3D cumulus (ray-marched), soft white with cool shadows; billows as it thinks.
 * One rig drives the faces: blink, gaze (pointer, or the expression's own look), idle float, voice level.
 * Drawn in a 100 × 100 box; colours from the brand tokens.
 */
export type Concept = 'hex-liquid' | 'cloud-liquid' | 'constellation' | 'hex-chrome' | 'cloud-soft'
export const liquidConcept: Record<ChromeShape, Concept> = { hex: 'hex-liquid', cloud: 'cloud-liquid' }
export type Expression = 'neutral' | 'listening' | 'thinking' | 'happy' | 'concerned' | 'wink'
export type MascotHandle = { level: (v: number) => void }

/** Dark pill eyes with a catch-light, for the faces on chrome and white. */
type Face = Exclude<Concept, 'constellation'>
type Rig = { eyes: [number, number]; y: number; w: number; h: number; gaze: number }
const rigs: Record<Face, Rig> = {
  'hex-liquid': { eyes: [42.3, 57.7], y: 50, w: 6.2, h: 10, gaze: 3 },
  'hex-chrome': { eyes: [43, 57], y: 50, w: 6, h: 9.6, gaze: 3 },
  'cloud-soft': { eyes: [41.5, 58.5], y: 51.3, w: 5.8, h: 9.4, gaze: 3 },
  'cloud-liquid': { eyes: [41.4, 58.6], y: 51.3, w: 5.6, h: 9.4, gaze: 3 },
}

// One pointer for every mascot on the page.
const pointer = { x: -1, y: -1 }
if (typeof window !== 'undefined') window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY })

type Props = {
  concept: Concept; expression?: Expression; talking?: boolean; size?: number
  /** Draws the body instead of the concept's own (Aura: the hexagon as a still until it comes alive). */
  body?: ReactNode
  /** The constellation only: a line hangs from it (see Constellation). */
  tether?: boolean
}

/** The constellation has no face: its expression becomes the state it moves in. */
const stateOf = (expression: Expression, talking: boolean) =>
  talking ? 'speaking' : expression === 'thinking' ? 'thinking' : expression === 'listening' ? 'listening' : expression === 'concerned' ? 'error' : 'idle'

export const Mascot = forwardRef<MascotHandle, Props>(function Mascot(props, ref) {
  const { concept, expression = 'neutral', talking = false, size = 112, tether } = props
  return concept === 'constellation'
    ? <Constellation ref={ref} state={stateOf(expression, talking)} size={size} tether={tether} />
    : <FaceMascot ref={ref} {...props} concept={concept} />
})

const FaceMascot = forwardRef<MascotHandle, Props & { concept: Face }>(
  function FaceMascot({ concept, expression = 'neutral', talking = false, size = 112, body }, ref) {
    const R = rigs[concept]
    const root = useRef<HTMLSpanElement>(null)
    const wrap = useRef<HTMLSpanElement>(null)
    const gaze = useRef<SVGGElement>(null)
    const eyes = useRef<SVGGElement>(null)
    const ring = useRef<SVGCircleElement>(null)
    const shader = useRef<Body | null>(null)
    const target = useRef(0)
    const live = useRef({ expression, talking })
    live.current = { expression, talking }
    useImperativeHandle(ref, () => ({ level: (v) => { target.current = v } }))

    useEffect(() => {
      if (reducedMotion()) return
      const g = [0, 0]
      let lvl = 0, wob = 0, raf = 0
      const tick = (now: number) => {
        const { expression: ex, talking: tk } = live.current
        const thinking = ex === 'thinking'
        lvl += ((tk ? target.current : 0) - lvl) * 0.35
        wob += ((thinking ? 1 : 0) - wob) * 0.04
        // Where to look: the expression's own look, a thinking pattern, or the pointer.
        let tx = 0, ty = 0
        if (thinking) { tx = Math.sin(now / 900) * 0.5; ty = -0.8 }
        else if (ex === 'listening') ty = 0.9
        else if (ex === 'concerned') ty = 0.5
        else if (root.current && pointer.x >= 0) {
          const r = root.current.getBoundingClientRect()
          const dx = pointer.x - (r.left + r.width / 2), dy = pointer.y - (r.top + r.height / 2)
          const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 360)
          tx = (dx / d) * k; ty = (dy / d) * k
        }
        g[0] += (tx - g[0]) * 0.1; g[1] += (ty - g[1]) * 0.1
        gaze.current?.setAttribute('transform', `translate(${(g[0] * R.gaze).toFixed(2)} ${(g[1] * R.gaze).toFixed(2)})`)

        // Shader bodies take the voice and the thinking as uniforms; their own loop draws them.
        // (setUniformValues sets them without an extra draw; it's private in Paper's types, public at runtime.)
        shader.current?.setUniformValues?.({ u_level: lvl, u_wobble: wob })

        if (ring.current) { ring.current.setAttribute('r', String(41 + lvl * 9)); ring.current.setAttribute('opacity', String(Math.min(0.5, lvl * 0.7))) }
        const float = Math.sin(now / 1500) * 1.6
        if (wrap.current) wrap.current.style.transform = `translateY(${(float * size) / 100}px) scale(${(1 + lvl * 0.05).toFixed(3)}, ${(1 - lvl * 0.03).toFixed(3)})`
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }, [concept, size])

    // Blink every few seconds, sometimes twice.
    useEffect(() => {
      if (reducedMotion()) return
      let t = 0
      const blink = () => {
        eyes.current?.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.1)' }, { transform: 'scaleY(1)' }], { duration: 160, easing: 'ease-in-out', iterations: Math.random() < 0.2 ? 2 : 1 })
        t = window.setTimeout(blink, 2200 + Math.random() * 3800)
      }
      t = window.setTimeout(blink, 900 + Math.random() * 2000)
      return () => clearTimeout(t)
    }, [])

    // Below 40px the eyes grow, so a 24–28px Aura still has a face.
    const grow = size < 40 ? 1.3 : 1
    const eye = (cx: number, i: number) => {
      const color = 'var(--brand-950)'
      if (expression === 'happy' || (expression === 'wink' && i === 0)) {
        const w = R.w * grow
        return <path key={i} d={`M${cx - w * 0.8} ${R.y + 1.5} Q${cx} ${R.y - R.h * grow * 0.55} ${cx + w * 0.8} ${R.y + 1.5}`} fill="none" stroke={color} strokeWidth={w * 0.6} strokeLinecap="round" />
      }
      const k = (expression === 'listening' ? 1.12 : 1) * grow
      const h = R.h * k * (expression === 'thinking' ? 0.62 : expression === 'concerned' ? 0.82 : 1)
      const w = R.w * k
      const tilt = expression === 'concerned' ? `rotate(${i === 0 ? -16 : 16} ${cx} ${R.y})` : undefined
      return (
        <g key={i} transform={tilt}>
          {/* Shine eyes get a pale rim: lost in the light chrome, it keeps them readable where a dark band passes. */}
          <rect x={cx - w / 2} y={R.y - h / 2} width={w} height={h} rx={w / 2} fill={color} stroke="var(--brand-50)" strokeWidth={1.6 * grow} paintOrder="stroke" />
          <circle cx={cx + w * 0.18} cy={R.y - h * 0.22} r={w * 0.2} fill="var(--brand-50)" />
        </g>
      )
    }

    return (
      <span ref={root} className="relative block" style={{ width: size, height: size }}>
        <span ref={wrap} className="absolute inset-0 will-change-transform">
          {body ?? (concept === 'hex-liquid' || concept === 'cloud-liquid' ? (
            <Suspense fallback={null}>
              <AuraMetal shape={concept === 'hex-liquid' ? 'hex' : 'cloud'} preset={chromePresets[expression === 'thinking' ? 'thinking' : talking ? 'speaking' : 'idle']} tintVar={CHROME_TINT} />
            </Suspense>
          ) : <Suspense fallback={null}><ShaderBody concept={concept} mount={shader} /></Suspense>)}
          <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full overflow-visible">
            <circle ref={ring} cx="50" cy="50" r="41" fill="none" stroke="var(--brand-300)" strokeWidth="1.2" opacity="0" />
            <g ref={gaze}>
              <g ref={eyes} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>{R.eyes.map(eye)}</g>
            </g>
          </svg>
        </span>
      </span>
    )
  },
)
