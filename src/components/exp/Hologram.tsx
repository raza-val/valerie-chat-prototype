import { useId, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { useCssVar, useDark } from '@/lib/aura'
import { svgId, useFrames, type ExpProps } from './motion'

const LAYERS = 7
const ECHOES = 4
const PARTS = [MARK_TOP, MARK_BOTTOM]
const CX = 20.51
const CY = 16

/**
 * Hologram (v4's Aura): the mark in depth, a stack of light-drawn slices behind a solid face. The structure holds
 * still (28 Oct: no more swaying and twisting); each state has one motion, picked from /exp/bot:
 * - Idle, Scan: a band of light reads down the face now and then. Otherwise it rests as it is.
 * - Thinking, Gyro: the two parts lift apart and spin against each other, then settle face-on.
 * - Speaking, Echo: outlines of the mark run out behind it with the voice, fading as they go, the farthest almost gone.
 * `sequence` (the main design, 6 Nov): thinking runs four motions in turn instead of the rotation alone, each starting and
 * ending face-on so they hand over cleanly: the rotation (3.4s), Orbit (2.8s), Split & snap (1.9s), Flip (1.5s), then again.
 */
const SEQ = { gyro: 3.4, orbit: 2.8, split: 1.9, flip: 1.5 }
const CYCLE = SEQ.gyro + SEQ.orbit + SEQ.split + SEQ.flip
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const seg = (u: number, a: number, b: number) => clamp01((u - a) / (b - a))
const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeInOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
const overshoot = (x: number) => { const s = 1.7; return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2 }

/** Where the thinking sequence is at `u` seconds into its cycle: each half's turn, the lean, the parting, the fan. */
function sequenceAt(u: number) {
  const o = { spin: 0, flip: 0, leanX: 0, leanY: 0, lift: 0, split: 0, fan: 0 }
  if (u < SEQ.gyro) {
    // The rotation: the two parts lift apart and turn once against each other, then close.
    const x = u / SEQ.gyro
    o.spin = 360 * easeInOut(x); o.lift = Math.sin(Math.PI * x); o.fan = Math.sin(Math.PI * x)
  } else if ((u -= SEQ.gyro) < SEQ.orbit) {
    // Orbit: one slow circle of lean, easing in and out of face-on.
    const x = u / SEQ.orbit, e = Math.sin(Math.PI * x), a = Math.PI * 2 * x
    o.leanX = e * 14 * Math.cos(a); o.leanY = e * 18 * Math.sin(a); o.fan = e * 0.5
  } else if ((u -= SEQ.orbit) < SEQ.split) {
    // Split & snap: apart, a beat, and back together past centre.
    o.split = easeOut(seg(u, 0, 0.35)) * (1 - overshoot(seg(u, 0.6, 1.05))); o.fan = Math.max(0, o.split) * 0.6
  } else {
    // Flip: one clean turn together, fanning mid-turn.
    const f = easeInOut(seg(u - SEQ.split, 0, 1.2))
    o.flip = 360 * f; o.fan = Math.sin(Math.PI * f)
  }
  return o
}

export function Hologram({ state, size, voice, sequence = false }: ExpProps & { sequence?: boolean }) {
  const id = svgId(useId())
  const dark = useDark()
  const c = { 50: useCssVar('--brand-50'), 200: useCssVar('--brand-200'), 300: useCssVar('--brand-300'), 400: useCssVar('--brand-400'), 500: useCssVar('--brand-500'), 700: useCssVar('--brand-700') }
  const halves = useRef<HTMLDivElement[]>([])
  const layers = useRef<HTMLDivElement[][]>([[], []])
  const fronts = useRef<HTMLDivElement[]>([])
  const bands = useRef<SVGRectElement[]>([])
  const echoes = useRef<SVGGElement[]>([])
  const clock = useRef({ spin: 0, wave: 0, scan: 0, speak: 0, seq: 0, turn: [0, 0], on: false })

  useFrames(state, { idle: 1, thinking: 1, speaking: 1 }, ({ t, dt, think, level }) => {
    const k = clock.current
    // Gyro: spins only while thinking; settling, each part eases back to the nearest face-on turn.
    if (think > 0.5) k.spin += dt * think * 120
    else k.spin += (Math.round(k.spin / 360) * 360 - k.spin) * (1 - Math.exp(-dt * 3))
    // The main design's sequence: its clock runs only while thinking; leaving, each part settles to the nearest face-on turn.
    if (sequence && think > 0.5) { if (!k.on) { k.on = true; k.seq = 0 } k.seq += dt } else k.on = false
    const q = sequence ? sequenceAt(k.seq % CYCLE) : null
    const lift = q ? size * (think * (0.05 * q.lift + 0.12 * q.split) + level * 0.025) : size * (think * 0.05 + level * 0.025)
    const gap = size * (0.012 + think * 0.008 + level * 0.012 + (q ? think * 0.014 * q.fan : 0))
    const front = (LAYERS - 1) / 2 * gap
    halves.current.forEach((h, p) => {
      const dir = p === 0 ? 1 : -1
      let turn = dir * k.spin, lx = 0, ly = 0
      if (q) {
        if (think > 0.5) k.turn[p] = dir * q.spin + q.flip
        else k.turn[p] += (Math.round(k.turn[p] / 360) * 360 - k.turn[p]) * (1 - Math.exp(-dt * 3))
        turn = k.turn[p]; lx = q.leanX * think; ly = q.leanY * think
      }
      h.style.transform = `translateY(${(-dir * lift).toFixed(2)}px) rotateX(${(12 + think * 8 + lx).toFixed(2)}deg) rotateY(${(-10 + Math.sin(t * 0.25) * 3 + ly + turn).toFixed(2)}deg)`
      layers.current[p].forEach((el, i) => { el.style.transform = `translateZ(${((i - (LAYERS - 1) / 2) * gap).toFixed(2)}px)` })
      if (fronts.current[p]) fronts.current[p].style.transform = `translateZ(${(front + 0.5).toFixed(2)}px)`
    })

    // Echo, only while speaking: each outline runs from the mark outward, brightest as it leaves, almost gone at its farthest.
    k.speak += ((state === 'speaking' ? 1 : 0) - k.speak) * (1 - Math.exp(-dt * 3))
    k.wave += dt * (0.3 + level * 0.4)
    echoes.current.forEach((g, i) => {
      const e = (((i / ECHOES + k.wave) % 1) + 1) % 1
      const s = 1 + e * (0.5 + level * 0.15)
      const o = k.speak * Math.min(1, e / 0.04) * (1 - e) ** 1.7 * (0.8 + level * 0.2)
      g.setAttribute('transform', `translate(${CX} ${CY}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`)
      g.setAttribute('opacity', o.toFixed(3))
    })

    // Scan, at rest: a pass down the face, then a pause. It gives way to the other states.
    k.scan += dt * 0.17
    const pass = Math.min(1, (k.scan % 1) / 0.55)
    bands.current.forEach((b) => {
      b.setAttribute('y', (-10 + pass * 52).toFixed(2))
      b.setAttribute('opacity', (0.55 * (1 - think) * (1 - k.speak) * (pass < 1 ? 1 : 0)).toFixed(3))
    })
  }, voice)

  const stroke = dark ? c[300] : c[500]
  const box = { width: size, height: size }
  const svg = (children: React.ReactNode) => (
    <svg viewBox={MARK_VIEWBOX} width={size} height={size * (40 / 49)} className="overflow-visible">{children}</svg>
  )
  const outline = { fill: 'none', stroke, strokeWidth: Math.max(0.75, size / 160), vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' } as const

  return (
    <div className="relative" style={box}>
      {/* The echoes, behind the hologram. */}
      <div className="absolute inset-0 grid place-items-center">
        {svg(Array.from({ length: ECHOES }, (_, i) => (
          <g key={i} ref={(el) => { if (el) echoes.current[i] = el }} opacity={0}>{PARTS.map((d) => <path key={d} d={d} {...outline} />)}</g>
        )))}
      </div>
      {PARTS.map((d, p) => (
        <div key={d} className="absolute inset-0" style={{ perspective: size * 4 }}>
          <div ref={(el) => { if (el) halves.current[p] = el }} className="relative" style={{ ...box, transformStyle: 'preserve-3d' }}>
            {Array.from({ length: LAYERS }, (_, i) => {
              const face = i === LAYERS - 1
              const depth = i / (LAYERS - 1)
              return (
                <div key={i} ref={(el) => { if (el) layers.current[p][i] = el }} className="absolute inset-0 grid place-items-center">
                  {svg(face ? (
                    <>
                      <defs>
                        <linearGradient id={`${id}f${p}`} x1="0" y1="0" x2="0.4" y2="1">
                          <stop offset="0" stopColor={c[200]} />
                          <stop offset="0.5" stopColor={c[400]} />
                          <stop offset="1" stopColor={dark ? c[500] : c[700]} />
                        </linearGradient>
                        <pattern id={`${id}l${p}`} width="1" height="0.9" patternUnits="userSpaceOnUse">
                          <rect width="1" height="0.3" fill={c[50]} opacity="0.28" />
                        </pattern>
                      </defs>
                      <path d={d} fill={`url(#${id}f${p})`} opacity={0.92} />
                      <path d={d} fill={`url(#${id}l${p})`} />
                      <path d={d} fill="none" stroke={c[50]} strokeOpacity={0.7} strokeWidth={0.3} />
                    </>
                  ) : (
                    <path d={d} fill={stroke} fillOpacity={0.04 + depth * 0.06} stroke={stroke} strokeOpacity={0.15 + depth * 0.5} strokeWidth={Math.max(0.3, 26 / size)} />
                  ))}
                </div>
              )
            })}
            {/* The scan, just in front of the face, clipped to it. */}
            <div ref={(el) => { if (el) fronts.current[p] = el }} className="absolute inset-0 grid place-items-center">
              {svg(
                <>
                  <defs>
                    <clipPath id={`${id}c${p}`}><path d={d} /></clipPath>
                    <linearGradient id={`${id}b${p}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={c[50]} stopOpacity="0" />
                      <stop offset="0.5" stopColor={c[50]} stopOpacity="0.95" />
                      <stop offset="1" stopColor={c[50]} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g clipPath={`url(#${id}c${p})`}>
                    <rect ref={(el) => { if (el) bands.current[p] = el }} x="-4" y="-10" width="49" height="7" fill={`url(#${id}b${p})`} opacity={0} />
                  </g>
                </>,
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
