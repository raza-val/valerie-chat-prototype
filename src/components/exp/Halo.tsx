import { useEffect, useRef } from 'react'
import { useCssVar, useDark } from '@/lib/aura'
import { useFrames, type ExpProps } from './motion'

/** Each ring: its lobes, its drift and its colour token. */
const rings = [
  { lobes: 3, drift: 0.9, phase: 0, color: '--brand-400' },
  { lobes: 4, drift: -0.7, phase: 2.1, color: '--brand-300' },
  { lobes: 5, drift: 0.5, phase: 4.2, color: '--brand-600' },
]

/**
 * Halo: no logo. Three rings of light share one circle; each one ripples on its own beat.
 * Idle: near-round, breathing. Thinking: a bright comet chases round the circle and the rings twist.
 * Speaking: the rings ripple with the voice.
 */
export function Halo({ state, size, voice }: ExpProps) {
  const dark = useDark()
  const colors = { '--brand-300': useCssVar('--brand-300'), '--brand-400': useCssVar('--brand-400'), '--brand-600': useCssVar(dark ? '--brand-200' : '--brand-600'), core: useCssVar('--brand-500'), light: useCssVar('--brand-50') }
  const canvas = useRef<HTMLCanvasElement>(null)
  const theme = useRef({ colors, dark })
  theme.current = { colors, dark }
  const dpr = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2)

  useEffect(() => {
    const el = canvas.current
    if (el) { el.width = size * dpr; el.height = size * dpr }
  }, [size, dpr])

  useFrames(state, { idle: 0.6, thinking: 2.4, speaking: 1.2 }, ({ t, think, level }) => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    const { colors, dark } = theme.current
    const s = size * dpr
    const R = s * 0.33
    const line = Math.max(1.2 * dpr, s * 0.018)
    ctx.clearRect(0, 0, s, s)
    ctx.save()
    ctx.translate(s / 2, s / 2)

    // A faint body inside the rings
    const body = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.05)
    body.addColorStop(0, colors.core + (dark ? '33' : '1f'))
    body.addColorStop(1, colors.core + '00')
    ctx.fillStyle = body
    ctx.beginPath(); ctx.arc(0, 0, R * 1.05, 0, Math.PI * 2); ctx.fill()

    ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over'
    const amp = 0.04 + Math.sin(t * 1.3) * 0.012 + think * 0.05 + level * 0.13
    rings.forEach((r, i) => {
      const col = colors[r.color as keyof typeof colors]
      ctx.beginPath()
      for (let k = 0; k <= 120; k++) {
        const a = (k / 120) * Math.PI * 2
        const wave = Math.sin(r.lobes * a + t * r.drift * 2 + r.phase) * 0.6 + Math.sin((r.lobes + 2) * a - t * r.drift * 1.4) * 0.4
        const rr = R * (1 + amp * wave * (1 + i * 0.15))
        const x = Math.cos(a + t * r.drift * 0.3 * (1 + think * 2)) * rr
        const y = Math.sin(a + t * r.drift * 0.3 * (1 + think * 2)) * rr
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      // A highlight travels each ring (a conic sweep), so the light reads as moving round it.
      const sweep = ctx.createConicGradient(t * (0.8 + think * 1.5) * Math.sign(r.drift) + r.phase, 0, 0)
      sweep.addColorStop(0, col)
      sweep.addColorStop(0.35, dark ? colors.light : colors['--brand-300'])
      sweep.addColorStop(0.6, col)
      sweep.addColorStop(1, col)
      ctx.strokeStyle = sweep
      ctx.globalAlpha = dark ? 0.55 : 0.75
      ctx.lineWidth = line
      ctx.shadowColor = col
      ctx.shadowBlur = s * (dark ? 0.035 : 0.05)
      ctx.stroke()
    })

    // Thinking: a comet of light chasing round
    if (think > 0.02) {
      const head = t * 2.2
      for (let k = 0; k < 24; k++) {
        const a = head - k * 0.045
        ctx.globalAlpha = think * (1 - k / 24) * 0.9
        ctx.fillStyle = dark ? colors.light : colors['--brand-400']
        ctx.shadowColor = colors['--brand-300']
        ctx.shadowBlur = s * 0.06
        ctx.beginPath()
        ctx.arc(Math.cos(a) * R, Math.sin(a) * R, line * (1.3 - k / 30), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
  }, voice)

  return <canvas ref={canvas} style={{ width: size, height: size }} />
}
