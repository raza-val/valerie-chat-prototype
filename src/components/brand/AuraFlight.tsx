import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Aura } from './Aura'
import { useStore } from '@/lib/store'

const FLIGHT_MS = 760
/** The first part of the flight is anticipation: a small lift before Aura leaves the hero. */
const LIFT = 0.12
/** How far the path arcs above the straight line, in px. */
const HUMP = 40
const easeOut = (k: number) => 1 - (1 - k) ** 3
const easeInOut = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2)

/**
 * Aura's flight from the Home hero to its seat in the first answer's header.
 * Across and down use different easings, so the path arcs. The seat is re-measured every frame,
 * so the answer rising in under it can't make the landing miss. No seat comes up: Aura fades out.
 * Aura takes off as it sat on Home and starts thinking on the way, so it lands already thinking.
 */
export function AuraFlight() {
  const { flight, endFlight } = useStore()
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = el.current
    if (!flight || !node) return
    const { from, seat } = flight
    if (!seat) {
      const fade = node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 400, fill: 'forwards' })
      fade.onfinish = endFlight
      return () => fade.cancel()
    }
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / FLIGHT_MS)
      const r = seat.getBoundingClientRect()
      let x = from.x, y = from.y, s = 1
      if (k < LIFT) {
        const a = easeOut(k / LIFT)
        y -= 4 * a
        s = 1 + 0.06 * a
      } else {
        // Across early, down late, with a hump in between: Aura clears the header text and drops onto its seat from above.
        const f = (k - LIFT) / (1 - LIFT)
        x += (r.left + r.width / 2 - from.x) * easeOut(f)
        y += (r.top + r.height / 2 - from.y) * easeInOut(f) - 4 * (1 - f) - HUMP * Math.sin(Math.PI * f)
        s = 1.06 + (r.width / from.size - 1.06) * easeOut(f)
      }
      node.style.transform = `translate(${x - from.size / 2}px, ${y - from.size / 2}px) scale(${s})`
      if (k < 1) raf = requestAnimationFrame(tick)
      else endFlight()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [flight?.seat])

  if (!flight) return null
  const { x, y, size } = flight.from
  return createPortal(
    <div ref={el} className="pointer-events-none fixed left-0 top-0 z-50" style={{ width: size, height: size, transform: `translate(${x - size / 2}px, ${y - size / 2}px)` }}>
      <Flyer key={`${x},${y}`} size={size} />
    </div>,
    document.body,
  )
}

/** Takes off as it sat on Home, then starts thinking once the lift is done. */
function Flyer({ size }: { size: number }) {
  const [thinking, setThinking] = useState(false)
  useEffect(() => { const t = window.setTimeout(() => setThinking(true), FLIGHT_MS * LIFT); return () => clearTimeout(t) }, [])
  return <Aura size={size} state={thinking ? 'thinking' : 'idle'} live />
}
