import { useMemo, useRef } from 'react'
import { MARK_BOTTOM, MARK_TOP } from '@/components/brand/mark'
import { useFrames, type ExpProps } from '../motion'
import { CX, CY, alpha, clamp01, fitMark, hash, useBrand, useCanvas, VB_W } from './palette'

type Tri = { pts: [number, number][]; d: number; facing: number; up: boolean }
const SHADES = [900, 800, 700, 600, 500, 400, 300, 200] as const

/**
 * Facets: the mark cut like a gem, a grid of triangles each turned its own way, catching a light that circles slowly.
 * Thinking: rings of light ripple out from the core. Speaking: the core brightens with the voice.
 */
export function Facets({ state, size, voice }: ExpProps) {
  const b = useBrand()
  const colours = useRef(b)
  colours.current = b
  const { ref, dpr, props } = useCanvas(size)
  const mark = useMemo(() => { const p = new Path2D(); p.addPath(new Path2D(MARK_TOP)); p.addPath(new Path2D(MARK_BOTTOM)); return p }, [])

  // Facets big enough to read at every size; the clip to the mark trims them. Only those well clear of it are skipped.
  const tris = useMemo(() => {
    const probe = document.createElement('canvas').getContext('2d')
    const a = Math.max(2.6, 6 / (size / VB_W)), h = (a * Math.sqrt(3)) / 2
    const out: Tri[] = []
    for (let r = 0, y = -1; y < 33; r++, y += h) {
      for (let i = 0, x = -1 - a / 2; x < 43; i++, x += a / 2) {
        const up = (i + r) % 2 === 0
        const pts: [number, number][] = up ? [[x, y + h], [x + a / 2, y], [x + a, y + h]] : [[x, y], [x + a, y], [x + a / 2, y + h]]
        const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
        const near = [...pts, [cx, cy], ...pts.map(([px, py]) => [(px + cx) / 2, (py + cy) / 2])]
        if (probe && !near.some(([px, py]) => probe.isPointInPath(mark, px, py))) continue
        out.push({ pts, d: Math.hypot(cx - CX, cy - CY), facing: hash(out.length) * Math.PI * 2, up })
      }
    }
    return out
  }, [size, mark])

  useFrames(state, { idle: 0.6, thinking: 1.2, speaking: 1 }, ({ t, think, level }) => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    const c = colours.current
    const k = fitMark(ctx, size, dpr)
    const light = t * 0.7
    ctx.save()
    ctx.clip(mark)
    ctx.lineWidth = 0.6 / k
    ctx.strokeStyle = alpha(c[50], c.dark ? 0.18 : 0.35)
    for (const tri of tris) {
      let l = 0.5 + 0.3 * Math.cos(light - tri.facing) + 0.1 * (tri.up ? 1 : -1) * Math.cos(light)
      l += think * 0.55 * Math.max(0, Math.sin(tri.d * 0.45 - t * 4)) ** 3
      l += level * 0.35 * Math.max(0, 1 - tri.d / 22)
      ctx.fillStyle = c[SHADES[Math.round(clamp01(l) * (SHADES.length - 1))]]
      ctx.beginPath()
      ctx.moveTo(...tri.pts[0]); ctx.lineTo(...tri.pts[1]); ctx.lineTo(...tri.pts[2])
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    ctx.restore()
  }, voice)

  return <div className="grid place-items-center" style={{ width: size, height: size }}><canvas {...props} /></div>
}
