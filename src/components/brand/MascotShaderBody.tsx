import { useEffect, useRef, type MutableRefObject } from 'react'
import { ShaderMount, getShaderColorFromString } from '@paper-design/shaders'
import { useCssVar } from '@/lib/aura'
import { reducedMotion } from '@/lib/motion'
import { cloudShader, hexChromeShader } from './mascotShaders'

/** What the mascot rig drives each frame (setUniformValues sets uniforms without an extra draw; it's private in Paper's types, public at runtime). */
export type Body = { setUniformValues?: (u: Record<string, number>) => void }

type ShaderConcept = 'hex-chrome' | 'cloud-soft'
const shaders: Record<ShaderConcept, string> = { 'hex-chrome': hexChromeShader, 'cloud-soft': cloudShader }

/** The shader bodies: a custom fragment shader on Paper's ShaderMount, coloured from the brand tokens. */
export default function ShaderBody({ concept, mount }: { concept: ShaderConcept; mount: MutableRefObject<Body | null> }) {
  const host = useRef<HTMLDivElement>(null)
  const c = { light: useCssVar('--brand-50'), shade: useCssVar('--brand-200'), deep: useCssVar('--brand-400'), floor: useCssVar('--muted-foreground') }
  const col = getShaderColorFromString
  const uniforms = () => concept === 'cloud-soft'
    ? { u_light: col(c.light), u_shade: col(c.shade), u_deep: col(c.deep), u_level: 0, u_wobble: 0 }
    : { u_sky: col(c.light), u_zenith: col(c.shade), u_floor: col(c.floor), u_light: col(c.light), u_level: 0, u_wobble: 0 }

  const own = useRef<ShaderMount | null>(null)
  useEffect(() => {
    if (!host.current) return
    const m = new ShaderMount(host.current, shaders[concept], uniforms(), undefined, reducedMotion() ? 0 : 1, 2000, 2)
    own.current = m
    mount.current = m as unknown as Body
    return () => { m.dispose(); own.current = mount.current = null }
  }, [concept])
  useEffect(() => { own.current?.setUniforms(uniforms()) }, Object.values(c))

  return <div ref={host} className="absolute inset-0" />
}
