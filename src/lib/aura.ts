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
 * Since 6 Nov the product at `/` is the main design ('main': the Hologram, the question cards under the composer two to a
 * row), the one being designed from here on. The four versions leadership compared are archived, each whole under its own
 * prefix: `/archive/v1/…` Solid acrylic (from /exp/bot), `/archive/v2/…` the Constellation, `/archive/v3/…` the Mark orb
 * (Figma 122:36999), `/archive/v4/…` the Hologram with the questions beside the composer. `/archive` lists them.
 * The prefix is the router's basename (main.tsx), so every link inside a version stays in it. Old links forward:
 * `/v1/…`–`/v4/…` to the archive, `/constellation/…` to archived v2, `/versions` to `/archive`.
 * (The liquid-chrome hexagon, the original at `/`, was dropped on 28 Oct; its code is still here, unreachable.)
 */
export type Version = 'main' | 'v1' | 'v2' | 'v3' | 'v4'
if (typeof location !== 'undefined') {
  const p = location.pathname
  const to = /^\/constellation(\/|$)/.test(p) ? p.replace(/^\/constellation/, '/archive/v2')
    : /^\/v[1-4](\/|$)/.test(p) ? `/archive${p}`
    : /^\/versions\/?$/.test(p) ? '/archive'
    : null
  if (to) history.replaceState(history.state, '', to + location.search + location.hash)
}
const archived = typeof location !== 'undefined' ? location.pathname.match(/^\/archive\/(v[1-4])(\/|$)/)?.[1] as Version | undefined : undefined
export const VERSION: Version = archived ?? 'main'
export const BASENAME = VERSION === 'main' ? undefined : `/archive/${VERSION}`
/** The faceless Aura of each version: main and archived v4 the Hologram, v1 Solid acrylic, v2 the Constellation, v3 the Mark orb. */
export const AURA_FORM = ({ main: 'hologram', v1: 'solid', v2: 'constellation', v3: 'markorb', v4: 'hologram' } as const)[VERSION]
export const CONSTELLATION = VERSION === 'v2'
/** Every version: no face, and the long wait (about 20s) with one shimmering step line, so the form has time to work. */
export const ABSTRACT = true as boolean
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
