import { useRef } from 'react'
import { Heatmap } from '@paper-design/shaders-react'
import { useCssVar, useDark } from '@/lib/aura'
import { useFrames, type ExpProps } from './motion'

/** The glow fades out well inside the canvas, so its square edge never shows. */
const FADE = 'radial-gradient(closest-side, black 55%, transparent 100%)'

/**
 * Plasma: the mark as a vessel of energy (Paper's Heatmap shader cast in the mark). Light pools in its core
 * and glows past its edge, navy to ice in the brand scale.
 * Thinking: the current runs fast and bright. Speaking: the whole mark beats with the voice.
 */
export function Plasma({ state, size, voice }: ExpProps) {
  const dark = useDark()
  const c = ['--brand-900', '--brand-700', '--brand-500', '--brand-300', '--brand-100', '--brand-50'].map(useCssVar)
  const wrap = useRef<HTMLDivElement>(null)
  useFrames(state, { idle: 1, thinking: 1, speaking: 1 }, ({ level }) => {
    if (wrap.current) wrap.current.style.transform = `scale(${1 + level * 0.07})`
  }, voice)
  const thinking = state === 'thinking'
  return (
    <div ref={wrap} style={{ width: size, height: size }}>
      <Heatmap
        image="/exp/mark.svg"
        colors={c}
        colorBack="rgba(0,0,0,0)"
        speed={thinking ? 1.6 : state === 'speaking' ? 0.8 : 0.4}
        contour={thinking ? 0.7 : 0.5}
        innerGlow={thinking ? 0.7 : 0.5}
        outerGlow={dark ? 0.55 : 0.2}
        angle={thinking ? 40 : 0}
        scale={0.72}
        style={{ width: size, height: size, maskImage: FADE, WebkitMaskImage: FADE }}
      />
    </div>
  )
}
