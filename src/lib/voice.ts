import { audioContext, onSoundChange, soundOn } from './sound'
import { VOICE } from './aura'

/**
 * Valerie's voice: lines recorded ahead of time (public/voice/<voice>/<line>), each with its word timings and a
 * loudness envelope, so the words turn to ink as they're said and Aura moves with the sound.
 * Recorded on macOS with the system voices (`tools/voice/record.sh`); no service, no network.
 * Played through Web Audio on the context the first cue or tap unlocked, so a line can start seconds after
 * the click that asked for it (Safari won't allow that for an <audio> element).
 */
export type Clip = {
  /** Length in ms. */
  ms: number
  /** Each word and the ms it starts at. */
  words: { w: string; at: number }[]
  /** Loudness per 1/60 s, 0 to 1. */
  env: number[]
  bytes: Promise<ArrayBuffer>
  decoded?: Promise<AudioBuffer>
}

export const voices = ['nicky', 'aaron', 'martha', 'arthur', 'catherine', 'samantha'] as const
export type Voice = (typeof voices)[number]
const asked = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('voice') : null
/** The product's voice: Nicky (US), or another with ?voice=martha and so on. */
export const voice: Voice = voices.find((v) => v === asked) ?? 'nicky'

const cache = new Map<string, Promise<Clip>>()

/** `base` is the path without extension, e.g. /voice/nicky/tagline. */
export function loadClip(base: string) {
  if (!cache.has(base)) {
    // Without a voice only the timings are needed (playSilent): skip the audio.
    const bytes = VOICE ? fetch(`${base}.m4a`).then((r) => r.arrayBuffer()) : Promise.resolve(new ArrayBuffer(0))
    bytes.catch(() => {})
    cache.set(base, fetch(`${base}.json`).then((r) => r.json()).then((d) => ({ ...d, bytes })))
  }
  return cache.get(base)!
}

/** A line in the product's voice: tagline, offer, or lead-<prompt id>. */
export const line = (name: string) => loadClip(`/voice/${voice}/${name}`)

/** For each space-separated word of `text`, the ms it is said at. Matched by position, so the clip may split words differently. */
export function wordTimes(text: string, clip: Clip) {
  const starts: number[] = []
  let i = 0
  for (const w of text.split(' ')) { starts.push(i); i += w.length + 1 }
  const at = starts.map(() => Infinity)
  let from = 0
  for (const { w, at: ms } of clip.words) {
    const k = text.indexOf(w, from)
    if (k < 0) continue
    from = k + w.length
    let j = starts.length - 1
    while (j > 0 && starts[j] > k) j--
    at[j] = Math.min(at[j], ms)
  }
  for (let j = 0; j < at.length; j++) if (at[j] === Infinity) at[j] = j ? at[j - 1] : 0
  return at
}

/** How many of the words have been said by `t`. */
export const saidBy = (times: number[], t: number) => times.filter((ms) => ms <= t).length

export type Frame = { t: number; level: number; word: number }

/** Where a clip is at `t` ms: its loudness and the word being said. */
function frameAt(clip: Clip, t: number): Frame {
  let word = -1
  while (word + 1 < clip.words.length && clip.words[word + 1].at <= t) word++
  return { t, level: clip.env[Math.min(clip.env.length - 1, Math.floor((t * 60) / 1000))] ?? 0, word }
}

let current: (() => void) | null = null
// Turning sound off silences Valerie mid-line.
onSoundChange(() => { if (!soundOn()) current?.() })

/**
 * Plays a clip (stopping any other line) and reports every frame: time, loudness, index of the word being said.
 * Call from a tap, or once a cue has unlocked audio. Returns stop; onEnd runs either way.
 */
export function playClip(clip: Clip, onFrame: (f: Frame) => void, onEnd?: () => void) {
  current?.()
  const ctx = audioContext()
  let src: AudioBufferSourceNode | null = null
  let raf = 0
  let over = false
  const end = () => {
    if (over) return
    over = true
    if (current === stop) current = null
    cancelAnimationFrame(raf)
    if (src) { src.onended = null; try { src.stop() } catch { /* not started */ } }
    onFrame({ t: clip.ms, level: 0, word: clip.words.length - 1 })
    onEnd?.()
  }
  const stop = () => end()
  current = stop
  clip.decoded ??= clip.bytes.then((b) => ctx.decodeAudioData(b.slice(0)))
  // A context made outside a tap may never be allowed to run: give up rather than hold the words grey.
  const running = ctx.state === 'running' ? Promise.resolve() : Promise.race([ctx.resume(), new Promise((_, no) => window.setTimeout(no, 600))])
  Promise.all([clip.decoded, running]).then(([buffer]) => {
    if (over) return
    src = ctx.createBufferSource()
    src.buffer = buffer
    src.connect(ctx.destination)
    src.onended = end
    const t0 = ctx.currentTime
    src.start()
    const tick = () => {
      onFrame(frameAt(clip, (ctx.currentTime - t0) * 1000))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }, end)
  return stop
}

/**
 * The same line with no sound (the versions without a voice): the words ink and Aura moves on the recording's
 * timing and loudness, on the page's clock. Same contract as playClip.
 */
export function playSilent(clip: Clip, onFrame: (f: Frame) => void, onEnd?: () => void) {
  current?.()
  let raf = 0
  let over = false
  const end = () => {
    if (over) return
    over = true
    if (current === stop) current = null
    cancelAnimationFrame(raf)
    onFrame({ t: clip.ms, level: 0, word: clip.words.length - 1 })
    onEnd?.()
  }
  const stop = () => end()
  current = stop
  const t0 = performance.now()
  const tick = (now: number) => {
    const t = now - t0
    if (t >= clip.ms) return end()
    onFrame(frameAt(clip, t))
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return stop
}
