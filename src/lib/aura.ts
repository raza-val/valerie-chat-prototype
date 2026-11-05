import { useEffect, useState } from 'react'

/**
 * Aura, Valerie's character: a rounded hexagon cast in liquid chrome (Paper Shaders), with eyes.
 * The cloud in the same chrome is kept as an option (/lab?view=character); the Valerie mark in metal came first
 * and is still in /lab. Every value below is beyond the DS and logged in docs/DS-DEVIATIONS.md (D2, D3, D17).
 */
export type AuraState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'

/** The chrome shapes (hexagon, cloud); or, in /lab, the first Aura: the mark and the liquid drop it melted into while thinking. */
export type AuraShape = 'mark' | 'blob' | 'hex' | 'cloud'
export type ChromeShape = 'hex' | 'cloud'
/** The shape Aura takes in the product. The cloud is kept as an option; switching back is this line (and its still). */
export const AURA_SHAPE: ChromeShape = 'hex'
/**
 * Versions of the prototype for leadership to compare: the same product and the same answers, a different Aura.
 * `/v1/…` Solid acrylic (from /exp/bot), `/v2/…` the Constellation, `/v3/…` the Mark orb (Figma 122:36999), `/v4/…` the
 * Hologram (questions beside the composer).
 * The prefix is the router's basename (main.tsx), so every link inside a version stays in it. The original (the
 * liquid-chrome hexagon at `/`) was dropped on 28 Oct: any link outside a version, except the tool pages (/versions, /exp,
 * /lab), lands in v1. `/constellation/…` links land in v2. On 28 Oct the first v3 (the Orb, Home as a card grid) was rejected,
 * then Solid acrylic became v1 and the Mark orb, v1 until then, moved to v3. 'a' is now only the tool pages.
 */
export type Version = 'a' | 'v1' | 'v2' | 'v3' | 'v4'
if (typeof location !== 'undefined') {
  const p = location.pathname
  const to = /^\/constellation(\/|$)/.test(p) ? p.replace(/^\/constellation/, '/v2')
    : /^\/(v[1-4]|versions|exp|lab)(\/|$)/.test(p) ? null
    : `/v1${p === '/' ? '' : p}`
  if (to) history.replaceState(history.state, '', to + location.search + location.hash)
}
export const VERSION: Version = (typeof location !== 'undefined' && (['v1', 'v2', 'v3', 'v4'] as const).find((v) => location.pathname === `/${v}` || location.pathname.startsWith(`/${v}/`))) || 'a'
export const BASENAME = VERSION === 'a' ? undefined : `/${VERSION}`
/** The faceless Aura of each version: v1 Solid acrylic, v2 the Constellation, v3 the Mark orb, v4 the Hologram. */
export const AURA_FORM = ({ a: 'hex', v1: 'solid', v2: 'constellation', v3: 'markorb', v4: 'hologram' } as const)[VERSION]
export const CONSTELLATION = VERSION === 'v2'
/** v1–v4: no face, and the long wait (about 20s) with one shimmering step line, so the form has time to work. */
export const ABSTRACT = VERSION !== 'a'
/** No voice in any version (28 Oct): no sound pill, no cues, Aura isn't tapped to speak. The voice code stays; this turns it back on. */
export const VOICE = false as boolean
export const shapeOf = (s: AuraState): AuraShape => (s === 'thinking' ? 'blob' : 'mark')
/** How long the mark takes to melt into liquid, or to form back out of it. */
export const MORPH_MS = 600
/** The drop's size against the mark's. Size follows the shape, not the state, so nothing jumps mid-morph. */
export const DROP_RATIO = 0.7

export type MetalPreset = {
  speed: number; repetition: number; softness: number; distortion: number; contour: number
  angle: number; shiftRed: number; shiftBlue: number; scale: number
}

/** A2, tuned calm: soft bands, slow flow, a thin blue edge. */
export const calm: MetalPreset = { speed: 0.2, repetition: 1.6, softness: 0.6, distortion: 0.05, contour: 0.4, angle: 70, shiftRed: 0.05, shiftBlue: 0.35, scale: 0.92 }
/** On the dark canvas the metal's dark bands vanish, so: fewer bands, almost no contour. */
export const calmDark: MetalPreset = { ...calm, repetition: 1.2, contour: 0.1, shiftRed: 0, shiftBlue: 0.15 }

const byState = (base: MetalPreset): Record<AuraState, MetalPreset> => ({
  idle: base,
  listening: { ...base, speed: 0.5 },
  thinking: { ...base, speed: 0.9, distortion: 0.2 },
  speaking: { ...base, speed: 0.7 },
  error: { ...base, speed: 0 },
})
export const auraPresets = { light: byState(calm), dark: byState(calmDark) }

/**
 * Classic chrome: more, sharper bands and an RGB fringe, tinted near-white. Same in both themes and both shapes; larger
 * than the mark, so it reads at 24px. The bands run down the side (angle 150): at 70 they curved under the eyes into a frown.
 */
export const chrome: MetalPreset = { ...calm, scale: 1.1, speed: 0.25, repetition: 2, softness: 0.15, contour: 0.4, distortion: 0.07, angle: 150, shiftRed: 0.3, shiftBlue: 0.3 }
export const chromePresets: Record<AuraState, MetalPreset> = {
  idle: chrome,
  listening: { ...chrome, speed: 0.5 },
  thinking: { ...chrome, speed: 0.9, distortion: 0.2 },
  speaking: { ...chrome, speed: 0.6 },
  error: { ...chrome, speed: 0 },
}
/** The chrome's tint, a brand token. */
export const CHROME_TINT = '--brand-50'

/** The moment the stills are taken at, and where the live shader starts, so still → live never jumps. */
export const AURA_FRAME = 2000
/** Each chrome shape's moment: a light face, with no dark shape under the eyes that reads as a mouth. */
const chromeFrames: Record<ChromeShape, number> = { hex: 3000, cloud: 6750 }
export const frameOf = (shape: AuraShape) => (shape === 'hex' || shape === 'cloud' ? chromeFrames[shape] : AURA_FRAME)

/** States that run the live shader; the rest show the still (public/aura/still-*.png). */
export const liveStates: AuraState[] = ['listening', 'thinking', 'speaking']

let webgl: boolean | undefined
export function hasWebGL() {
  if (webgl === undefined) {
    try { webgl = !!document.createElement('canvas').getContext('webgl2') } catch { webgl = false }
  }
  return webgl
}

/** Re-reads `read()` whenever the theme switches (the .dark class on the root). */
function useThemed<T>(read: () => T, deps: unknown[] = []) {
  const [value, setValue] = useState(read)
  useEffect(() => {
    setValue(read())
    const mo = new MutationObserver(() => setValue(read()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, deps)
  return value
}

export const useDark = () => useThemed(() => document.documentElement.classList.contains('dark'))

/** A CSS custom property from the root, following theme switches. */
export const useCssVar = (name: string) => useThemed(() => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), [name])
