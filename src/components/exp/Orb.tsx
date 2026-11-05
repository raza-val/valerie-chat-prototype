import { useRef } from 'react'
import { GemSmoke } from '@paper-design/shaders-react'
import { useCssVar, useDark } from '@/lib/aura'
import { useFrames, type ExpProps } from './motion'

/** Clip to the sphere, with a soft edge. */
const SPHERE = 'radial-gradient(closest-side, black 86%, transparent 92%)'

/**
 * Orb: no logo. A glass sphere with light-smoke turning inside (Paper's GemSmoke), a specular highlight on top.
 * Thinking: the smoke churns and the glow rises. Speaking: the sphere breathes with the voice.
 */
export function Orb({ state, size, voice }: ExpProps) {
  const dark = useDark()
  const c = { 50: useCssVar('--brand-50'), 200: useCssVar('--brand-200'), 400: useCssVar('--brand-400'), 600: useCssVar('--brand-600'), 900: useCssVar('--brand-900') }
  const wrap = useRef<HTMLDivElement>(null)
  useFrames(state, { idle: 1, thinking: 1, speaking: 1 }, ({ level }) => {
    if (wrap.current) wrap.current.style.transform = `scale(${1 + level * 0.06})`
  }, voice)
  const thinking = state === 'thinking'
  return (
    <div ref={wrap} className="relative" style={{ width: size, height: size }}>
      {/* Its light on the ground around it */}
      <span aria-hidden className="pointer-events-none absolute inset-[6%] rounded-full" style={{ background: c[400], opacity: dark ? 0.35 : 0.22, filter: `blur(${size / 10}px)`, transform: `scale(${thinking ? 1.08 : 1})`, transition: 'transform 1s' }} />
      <GemSmoke
        shape="circle"
        colors={[c[900], c[600], c[400], c[200]]}
        colorBack="rgba(0,0,0,0)"
        colorInner={dark ? c[900] : c[50]}
        speed={thinking ? 1.4 : state === 'speaking' ? 0.8 : 0.35}
        innerDistortion={thinking ? 1 : 0.7}
        outerDistortion={0}
        innerGlow={1}
        outerGlow={0}
        size={0.86}
        scale={0.9}
        style={{ width: size, height: size, maskImage: SPHERE, WebkitMaskImage: SPHERE }}
      />
      {/* The glass: a soft specular cap */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{ left: '27%', top: '17%', width: '34%', height: '20%', background: 'radial-gradient(closest-side, rgb(255 255 255 / .55), transparent)', filter: `blur(${size / 60}px)` }}
      />
    </div>
  )
}
