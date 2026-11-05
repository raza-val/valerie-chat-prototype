import { useSyncExternalStore } from 'react'
import { VOICE } from './aura'

/**
 * Valerie's sound: four soft cues synthesised with Web Audio (no files), off until the viewer turns it on.
 * On with the toggle in the chat's pills, or with ?sound=1 on any link. The choice is remembered. Off in every version for now (`VOICE`).
 * Beyond the DS (docs/DS-DEVIATIONS.md, D13).
 */
export type Cue = 'send' | 'step' | 'answer' | 'error' | 'on'

const KEY = 'valerie.sound'
const fromUrl = typeof location !== 'undefined' && new URLSearchParams(location.search).get('sound') === '1'
let on = VOICE && (fromUrl || (() => { try { return localStorage.getItem(KEY) === 'on' } catch { return false } })())
const listeners = new Set<() => void>()

export function setSound(v: boolean) {
  if (!VOICE) return
  on = v
  try { localStorage.setItem(KEY, v ? 'on' : 'off') } catch { /* private mode */ }
  listeners.forEach((l) => l())
  if (v) play('on')
}

export const soundOn = () => on
export const onSoundChange = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export const useSound = () => useSyncExternalStore(onSoundChange, () => on)

let ctx: AudioContext | null = null
/** The one audio context, shared with Valerie's voice. Made (and so allowed to play) on the first cue or tap. */
export const audioContext = () => (ctx ??= new AudioContext())
/** Whether a cue or tap has started audio, so Valerie may speak without a fresh tap. */
export const canPlay = () => !!ctx && ctx.state !== 'closed'

/** One soft tone: a quick attack, then an exponential fade. Optional glide to `to` Hz. */
function tone(freq: number, { at = 0, dur = 0.14, gain = 0.04, type = 'sine', to }: { at?: number; dur?: number; gain?: number; type?: OscillatorType; to?: number } = {}) {
  const c = audioContext()
  const t = c.currentTime + at
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const cues: Record<Cue, () => void> = {
  /** Aura takes off: a short rising glide. */
  send: () => tone(440, { to: 660, dur: 0.16, gain: 0.035 }),
  /** A step done: the faintest tick. */
  step: () => tone(1320, { dur: 0.05, gain: 0.018, type: 'triangle' }),
  /** The answer forms: two notes a fifth apart, the second a breath later. */
  answer: () => { tone(659.25, { dur: 0.55, gain: 0.035 }); tone(987.77, { at: 0.09, dur: 0.7, gain: 0.025 }) },
  /** Stopped at a step: a soft fall. */
  error: () => tone(392, { to: 311, dur: 0.26, gain: 0.035, type: 'triangle' }),
  /** Sound turned on: confirms it works. */
  on: () => tone(880, { dur: 0.08, gain: 0.025 }),
}

export function play(cue: Cue) {
  if (!on) return
  try {
    if (ctx?.state === 'suspended') void ctx.resume()
    cues[cue]()
  } catch { /* no audio */ }
}
