import { useLayoutEffect, useRef } from 'react'
import { LiquidMetalShapes, ShaderFitOptions, ShaderMount, getShaderColorFromString, liquidMetalFragmentShader } from '@paper-design/shaders'
import { AURA_FRAME, AURA_SHAPE, DROP_RATIO, auraPresets, chromePresets, frameOf, shapeOf, useCssVar, useDark, type AuraShape, type AuraState, type MetalPreset } from '@/lib/aura'

/**
 * The live shader. Loaded on demand (see Aura), so the shader code stays out of the first paint.
 * The shapes are pre-processed (public/aura/*-liquid.png), so the browser does no image work at load.
 *
 * Shader canvases are pooled, one pool per shape. A new canvas costs ~15ms (context, compile, mask upload),
 * a frame's whole budget, and a send used to make six. Now a departed Aura hands its canvas back
 * and the next one picks it up already compiled; two of Aura's shape are warmed while Home sits idle.
 */
type Uniforms = ConstructorParameters<typeof ShaderMount>[2]

const MAX_IDLE = 2
const pool: Record<AuraShape, ShaderMount[]> = { mark: [], blob: [], hex: [], cloud: [] }
let holder: HTMLDivElement | null = null
/** Shapes cast from a pre-processed mask; the drop is the shader's own circle. */
const maskSrc: Partial<Record<AuraShape, string>> = { mark: '/aura/mark-liquid.png', hex: '/aura/hex-liquid.png', cloud: '/aura/cloud-liquid.png' }
const masks: Partial<Record<AuraShape, { img: HTMLImageElement; ready: Promise<void> }>> = {}

function loadMask(shape: AuraShape) {
  const src = maskSrc[shape]
  if (!src) return Promise.resolve()
  if (!masks[shape]) {
    const img = new Image()
    img.src = src
    masks[shape] = { img, ready: img.decode().catch(() => {}) }
  }
  return masks[shape]!.ready
}

/** Off-screen, so a parked canvas is paused by its own visibility check and costs nothing. */
function park(m: ShaderMount, shape: AuraShape, size = m.parentElement.offsetWidth) {
  if (pool[shape].length >= MAX_IDLE) return m.dispose()
  if (!holder) {
    holder = document.createElement('div')
    holder.setAttribute('aria-hidden', 'true')
    holder.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none'
    document.body.append(holder)
  }
  const el = m.parentElement
  // Keep its size while parked, so the canvas isn't reallocated on the way out and back.
  el.style.cssText = `width:${size}px;height:${size}px`
  m.setSpeed(0)
  holder.append(el)
  pool[shape].push(m)
}

/** A parked canvas of this shape, the one closest in size first (resizing a canvas costs a frame's worth). */
function take(shape: AuraShape, size: number) {
  const ms = pool[shape]
  if (!ms.length) return undefined
  const i = ms.reduce((best, m, j) => (Math.abs(m.parentElement.offsetWidth - size) < Math.abs(ms[best].parentElement.offsetWidth - size) ? j : best), 0)
  return ms.splice(i, 1)[0]
}

function create(shape: AuraShape, uniforms: Uniforms, attrs?: WebGLContextAttributes) {
  const el = document.createElement('div')
  el.className = 'absolute inset-0'
  return new ShaderMount(el, liquidMetalFragmentShader, uniforms, attrs, 0, AURA_FRAME, 2, undefined, maskSrc[shape] ? ['u_image'] : [])
}

let warmed = false
function warm() {
  if (warmed) return
  warmed = true
  const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1))
  const uniforms = uniformsFor(AURA_SHAPE, chromePresets.idle, '#000')
  // The two a send needs at once: the flight (hero size) and the seat it lands on.
  // One per idle slot, after Home's entrance has played; parked at size, so each is drawn once now, not on first use.
  const sizes = [112, 28]
  const one = () => idle(() => {
    const size = sizes.shift()
    if (size && pool[AURA_SHAPE].length < MAX_IDLE) park(create(AURA_SHAPE, uniforms), AURA_SHAPE, size)
    if (sizes.length) one()
  }, { timeout: 4000 })
  window.setTimeout(one, 1500)
}

function uniformsFor(shape: AuraShape, p: MetalPreset, tint: string): Uniforms {
  return {
    // The drop never reads a mask, so it skips the upload.
    ...(masks[shape] ? { u_image: masks[shape]!.img } : {}),
    u_isImage: shape !== 'blob',
    u_shape: shape === 'blob' ? LiquidMetalShapes.circle : LiquidMetalShapes.none,
    u_colorBack: getShaderColorFromString('rgba(0,0,0,0)'),
    u_colorTint: getShaderColorFromString(tint),
    u_repetition: p.repetition,
    u_softness: p.softness,
    u_distortion: p.distortion,
    u_contour: p.contour,
    u_angle: p.angle,
    u_shiftRed: p.shiftRed,
    u_shiftBlue: p.shiftBlue,
    u_fit: ShaderFitOptions.contain,
    u_scale: shape === 'blob' ? p.scale * DROP_RATIO : p.scale,
    u_rotation: 0, u_offsetX: 0, u_offsetY: 0, u_originX: 0.5, u_originY: 0.5, u_worldWidth: 0, u_worldHeight: 0,
  }
}

export default function AuraMetal({ state = 'idle', shape = shapeOf(state), preset, tintVar = '--aura-tint', frame, preserve = false }: {
  state?: AuraState; shape?: AuraShape; preset?: MetalPreset; tintVar?: string
  /** Fixed time, for stills and the lab's capture mode. */
  frame?: number; preserve?: boolean
}) {
  const dark = useDark()
  const p = preset ?? auraPresets[dark ? 'dark' : 'light'][state]
  const tint = useCssVar(state === 'error' ? '--muted-foreground' : tintVar)
  const speed = frame !== undefined ? 0 : p.speed
  const host = useRef<HTMLDivElement>(null)
  const mount = useRef<ShaderMount | null>(null)
  const latest = useRef({ uniforms: () => uniformsFor(shape, p, tint), speed, frame })
  latest.current = { uniforms: () => uniformsFor(shape, p, tint), speed, frame }

  // Take a canvas of this shape (pooled, or new) and hand it back when the shape changes or Aura leaves.
  useLayoutEffect(() => {
    let gone = false
    const attach = () => {
      if (gone || !host.current) return
      const { uniforms, speed, frame } = latest.current
      const m = (!preserve && take(shape, host.current.offsetWidth)) || create(shape, uniforms(), preserve ? { preserveDrawingBuffer: true } : undefined)
      m.parentElement.style.cssText = ''
      host.current.append(m.parentElement)
      m.setUniforms(uniforms())
      m.setFrame(frame ?? frameOf(shape))
      m.setSpeed(speed)
      mount.current = m
      if (shape === AURA_SHAPE) warm()
    }
    if (maskSrc[shape]) void loadMask(shape).then(attach)
    else attach()
    return () => {
      gone = true
      const m = mount.current
      mount.current = null
      if (m) preserve ? m.dispose() : park(m, shape)
    }
  }, [shape, preserve])

  useLayoutEffect(() => { mount.current?.setUniforms(latest.current.uniforms()) }, [state, dark, tint, p])
  useLayoutEffect(() => { mount.current?.setSpeed(speed) }, [speed])
  useLayoutEffect(() => { if (frame !== undefined) mount.current?.setFrame(frame) }, [frame])

  return <div ref={host} className="absolute inset-0" />
}
