import { forwardRef, lazy, Suspense, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { ABSTRACT, AURA_FORM, VERSION, AURA_SHAPE, CHROME_TINT, chromePresets, hasWebGL, liveStates, type AuraState } from '@/lib/aura'
import { Hologram } from '@/components/exp/Hologram'
import { MarkOrb } from '@/components/exp/MarkOrb'
import type { ExpState } from '@/components/exp/motion'
import { reducedMotion } from '@/lib/motion'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'
import { Mascot, liquidConcept, type Expression, type MascotHandle } from './Mascot'

export type { AuraState } from '@/lib/aura'
/** `level(v)`: the voice's loudness this frame, 0 to 1, while Aura is speaking. */
export type AuraHandle = MascotHandle

const AuraMetal = lazy(() => import('./AuraMetal'))

const faces: Record<AuraState, Expression> = { idle: 'neutral', listening: 'listening', thinking: 'thinking', speaking: 'neutral', error: 'concerned' }

/**
 * Aura, Valerie's character: a rounded hexagon in liquid chrome, with eyes (the Mascot rig: blink, gaze, float, voice).
 * The body is a still (rendered from the same shader) until a `live` seat or an active state (listening,
 * thinking, speaking) crossfades the live shader in; it fades back out when they end, so a turn settling never pops.
 * No WebGL or reduced motion: the still only. Thinking, the chrome churns and the eyes look up; listening,
 * they look down at the composer; speaking, Aura swells with the voice; error, a concerned face, grey, a red dot.
 * `continues` picks up from an Aura already live in this state: no still in between.
 * A `seat` is where Aura lands after flying from the Home hero (AuraFlight); it stays empty until then.
 * With `onTap`, Aura is a button (tap to hear its line, or stop it).
 * v1, v2, v4, no face: the Mark orb (v1), the Constellation (v2) or the Hologram (v4), live at every size, grey on error
 * (the forms come from /exp).
 */
export const Aura = forwardRef<AuraHandle, {
  size?: number; state?: AuraState; live?: boolean; seat?: boolean; continues?: boolean
  /** Counts up on each beat of what Valerie says (a clause of the lead); Aura swells a little on each. */
  beat?: number
  onTap?: () => void
  /** The tap's label (and tooltip). */
  label?: string
  /** Version B: the open steps hang from Aura, so a line runs down out of the constellation to meet them. */
  tether?: boolean
  className?: string
}>(function Aura({ size = 28, state = 'idle', live = false, seat = false, continues = false, beat = 0, onTap, label, tether, className }, ref) {
  const { flight, claimSeat } = useStore()
  const box = useRef<HTMLSpanElement & HTMLButtonElement>(null)
  useLayoutEffect(() => { if (seat && flight && !flight.seat && box.current) claimSeat(box.current) }, [seat, flight])
  const waiting = seat && !!flight && (!flight.seat || flight.seat === box.current)
  useEffect(() => {
    if (!beat || reducedMotion()) return
    box.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: 0.3 }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
  }, [beat])

  const wantLive = !ABSTRACT && (live || liveStates.includes(state)) && hasWebGL() && !reducedMotion()
  const [mounted, setMounted] = useState(wantLive)
  const [shown, setShown] = useState(wantLive && continues)
  useEffect(() => {
    if (wantLive) {
      setMounted(true)
      const t = window.setTimeout(() => setShown(true), 120)
      return () => clearTimeout(t)
    }
    setShown(false)
    const t = window.setTimeout(() => setMounted(false), 600)
    return () => clearTimeout(t)
  }, [wantLive])

  const body = (
    <>
      <img src={`/aura/${AURA_SHAPE}-still.png`} alt="" draggable={false} className={cn('absolute inset-0 size-full transition-opacity duration-500', shown && 'opacity-0', state === 'error' && 'opacity-60 grayscale')} />
      {mounted && (
        <span className={cn('absolute inset-0 transition-opacity duration-500', shown ? 'opacity-100' : 'opacity-0')}>
          <Suspense fallback={null}><AuraMetal state={state} shape={AURA_SHAPE} preset={chromePresets[state]} tintVar={CHROME_TINT} /></Suspense>
        </span>
      )}
    </>
  )
  const Tag = onTap ? 'button' : 'span'
  return (
    <Tag
      ref={box}
      {...(onTap ? { type: 'button' as const, onClick: onTap, 'aria-label': label, title: label } : { 'aria-hidden': true })}
      data-aura-seat={seat || undefined}
      className={cn('relative inline-block shrink-0 rounded-full', onTap && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40', waiting && 'opacity-0', className)}
      style={{ width: size, height: size }}
    >
      {ABSTRACT ? (
        <span className={cn('block transition-[filter,opacity] duration-500', state === 'error' && 'opacity-60 grayscale')}>
          {AURA_FORM === 'constellation'
            ? <Mascot ref={ref} concept="constellation" expression={faces[state]} talking={state === 'speaking'} size={size} tether={tether} />
            : <Form ref={ref} state={state} size={size} />}
        </span>
      ) : (
        <Mascot ref={ref} concept={liquidConcept[AURA_SHAPE]} expression={faces[state]} talking={state === 'speaking'} size={size} body={body} />
      )}
      {state === 'error' && <span className="absolute -bottom-px -right-px size-2.5 animate-tick rounded-full bg-data-down ring-2 ring-canvas" />}
    </Tag>
  )
})

const expState = (s: AuraState): ExpState => (s === 'thinking' || s === 'speaking' ? s : 'idle')

/** Solid acrylic is 3D (three.js), so it loads only in v1, and starts loading as soon as the page does. */
const solid = () => import('@/components/exp/bot/Solid').then((m) => ({ default: m.SolidAcrylic }))
const SolidAcrylic = lazy(solid)
if (AURA_FORM === 'solid') void solid()

/** Solid acrylic, the Mark orb or the Hologram as Aura, following the recorded voice's loudness while speaking. */
const Form = forwardRef<AuraHandle, { state: AuraState; size: number }>(function Form({ state, size }, ref) {
  const voice = useRef(0)
  useImperativeHandle(ref, () => ({ level: (v: number) => { voice.current = v } }), [])
  if (AURA_FORM === 'solid') return <Suspense fallback={<span className="block" style={{ width: size, height: size }} />}><SolidAcrylic state={expState(state)} size={size} voice={voice} /></Suspense>
  if (AURA_FORM === 'markorb') return <MarkOrb state={expState(state)} size={size} voice={voice} />
  // The main design thinks in a sequence (rotation, Orbit, Split & snap, Flip); archived v4 keeps the rotation alone.
  return <Hologram state={expState(state)} size={size} voice={voice} sequence={VERSION === 'main'} />
})
