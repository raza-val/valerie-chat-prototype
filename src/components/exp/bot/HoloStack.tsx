import { useId, useRef, type ReactNode } from 'react'
import { MARK_BOTTOM, MARK_TOP, MARK_VIEWBOX } from '@/components/brand/mark'
import { svgId, useFrames, type ExpProps, type ExpState, type Frame } from '../motion'
import { useBrand, VB_H, VB_W } from './palette'

export type HoloApi = { stage: HTMLDivElement | null; layers: HTMLDivElement[]; n: number; size: number }

/**
 * The Hologram's body, shared by the new motions: the mark as a stack of light-drawn slices behind a solid face
 * (the last layer). Each motion only says where the stage and the slices go each frame; `part` draws one half of the mark.
 */
export function HoloStack({ state, size, voice, n = 9, pace, part, frame, overlay }: ExpProps & {
  n?: number
  pace: Record<ExpState, number>
  part?: 'top' | 'bottom'
  frame: (f: Frame, api: HoloApi) => void
  overlay?: ReactNode
}) {
  const id = svgId(useId())
  const b = useBrand()
  const stage = useRef<HTMLDivElement>(null)
  const layers = useRef<HTMLDivElement[]>([])
  useFrames(state, pace, (f) => frame(f, { stage: stage.current, layers: layers.current, n, size }), voice)

  const stroke = b.dark ? b[300] : b[500]
  const mark = (props: React.SVGProps<SVGPathElement>) => (
    <>
      {part !== 'bottom' && <path d={MARK_TOP} {...props} />}
      {part !== 'top' && <path d={MARK_BOTTOM} {...props} />}
    </>
  )
  const box = { width: size, height: size }
  return (
    <div style={{ ...box, perspective: size * 4 }}>
      <div ref={stage} className="relative" style={{ ...box, transformStyle: 'preserve-3d' }}>
        {Array.from({ length: n }, (_, i) => {
          const face = i === n - 1
          const depth = i / (n - 1)
          return (
            <div key={i} ref={(el) => { if (el) layers.current[i] = el }} className="absolute inset-0 grid place-items-center">
              <svg viewBox={MARK_VIEWBOX} width={size} height={size * (VB_H / VB_W)} className="overflow-visible">
                {face ? (
                  <>
                    <defs>
                      <linearGradient id={`${id}f`} x1="0" y1="0" x2="0.4" y2="1">
                        <stop offset="0" stopColor={b[200]} />
                        <stop offset="0.5" stopColor={b[400]} />
                        <stop offset="1" stopColor={b.dark ? b[500] : b[700]} />
                      </linearGradient>
                      <pattern id={`${id}l`} width="1" height="0.9" patternUnits="userSpaceOnUse">
                        <rect width="1" height="0.3" fill={b[50]} opacity="0.28" />
                      </pattern>
                    </defs>
                    {mark({ fill: `url(#${id}f)`, opacity: 0.92 })}
                    {mark({ fill: `url(#${id}l)` })}
                    {mark({ fill: 'none', stroke: b[50], strokeOpacity: 0.7, strokeWidth: 0.3 })}
                  </>
                ) : (
                  mark({ fill: stroke, fillOpacity: 0.04 + depth * 0.06, stroke, strokeOpacity: 0.15 + depth * 0.5, strokeWidth: Math.max(0.3, 26 / size) })
                )}
              </svg>
            </div>
          )
        })}
        {overlay}
      </div>
    </div>
  )
}

/** Where slice i sits in depth, the face in front, `gap` px apart. */
export const depthOf = (i: number, n: number, gap: number) => (i - (n - 1) / 2) * gap
