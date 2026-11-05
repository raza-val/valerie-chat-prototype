import { useRef } from 'react'
import { useCssVar, useDark } from '@/lib/aura'

/**
 * Shared by the bot experiments (/exp/bot): the brand scale, the mark's geometry, and a canvas sized for the screen.
 * Colours come from the brand tokens only (D21).
 */
type Step = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type Brand = { dark: boolean } & Record<Step, string>

export function useBrand(): Brand {
  const dark = useDark()
  return {
    dark,
    50: useCssVar('--brand-50'), 100: useCssVar('--brand-100'), 200: useCssVar('--brand-200'), 300: useCssVar('--brand-300'), 400: useCssVar('--brand-400'),
    500: useCssVar('--brand-500'), 600: useCssVar('--brand-600'), 700: useCssVar('--brand-700'), 800: useCssVar('--brand-800'), 900: useCssVar('--brand-900'),
  }
}

/** The mark's middle, in its own units (MARK_VIEWBOX is -4 -4 49 40). */
export const CX = 20.51
export const CY = 16
export const VB_W = 49
export const VB_H = 40

/** A token hex (#rrggbb) at an alpha, for canvas. */
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/** A steady pseudo-random number in [0, 1) per index. */
export const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smooth = (v: number) => { const x = clamp01(v); return x * x * (3 - 2 * x) }

/** A square canvas of `size` CSS px, drawn at the screen's density (at most 2x). */
export function useCanvas(size: number) {
  const ref = useRef<HTMLCanvasElement>(null)
  const dpr = Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1)
  return { ref, dpr, props: { ref, width: Math.round(size * dpr), height: Math.round(size * dpr), style: { width: size, height: size } } }
}

/** Clears the canvas and maps the mark's units onto it, the mark fitted to the width. Returns px per unit. */
export function fitMark(ctx: CanvasRenderingContext2D, size: number, dpr: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const k = size / VB_W
  ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * (size / 2 - CX * k), dpr * (size / 2 - CY * k))
  return k
}
