import { useEffect, useRef } from 'react'

/** The three states every experiment shows. */
export type ExpState = 'idle' | 'thinking' | 'speaking'
/** `voice`: the real voice's loudness (0–1) while speaking, written each frame by the player; without it, a stand-in. */
export type ExpProps = { state: ExpState; size: number; voice?: { current: number } }

export type Frame = {
  /** Clock in seconds, running at the state's pace. */
  t: number
  dt: number
  /** 0 → 1 as the state turns to thinking (eased, so nothing jumps). */
  think: number
  /** The voice's loudness while speaking, 0 → 1. */
  level: number
}

const ease = (from: number, to: number, dt: number, rate: number) => from + (to - from) * (1 - Math.exp(-dt * rate))

/** A stand-in voice: syllables at ~5 a second, a breath between clauses. */
function voice(s: number) {
  const inClause = s % 2.3 < 1.8
  const syllable = Math.abs(Math.sin(s * 15.7) * 0.6 + Math.sin(s * 6.1 + 1) * 0.4)
  return inClause ? 0.3 + 0.7 * syllable : 0
}

/**
 * One frame loop per experiment. Speed, thinking and loudness all ease toward the state's values,
 * so switching state bends the motion instead of cutting it. `draw` writes to the DOM directly (no re-render).
 */
export function useFrames(state: ExpState, pace: Record<ExpState, number>, draw: (f: Frame) => void, voiceLevel?: { current: number }) {
  const target = useRef({ state, pace, voiceLevel })
  target.current = { state, pace, voiceLevel }
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const f: Frame = { t: 0, dt: 0, think: 0, level: 0 }
    let speed = target.current.pace[target.current.state]
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const { state, pace, voiceLevel } = target.current
      speed = ease(speed, pace[state], dt, 2.5)
      f.dt = dt
      f.t += dt * speed
      f.think = ease(f.think, state === 'thinking' ? 1 : 0, dt, 3)
      f.level = ease(f.level, state === 'speaking' ? (voiceLevel ? voiceLevel.current : voice(now / 1000)) : 0, dt, 14)
      drawRef.current(f)
      if (!reduce) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}

/** A safe id for SVG defs (useId's colons break url(#…) in some engines). */
export const svgId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '')
