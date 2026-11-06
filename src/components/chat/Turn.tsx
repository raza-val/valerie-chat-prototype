import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AnswerErrorView, AnswerView, WorkingView } from './AnswerView'
import { BriefReply, briefFor } from './BriefView'
import { UserBubble } from './UserBubble'
import type { Persona } from '@/data/personas'
import type { Prompt } from '@/data/prompts'
import { answers } from '@/data/answers'
import { streamMs } from '@/lib/motion'
import { useStore } from '@/lib/store'
import { play } from '@/lib/sound'
import { ABSTRACT } from '@/lib/aura'

/** Version B works in two stages: the analysis (Aura and the step line only), then the skeleton for the last moments,
 * once there's an answer to take the shape of. This is how long that last stage lasts, at most 40% of the wait. */
const SHAPING_MS = 2500

/** How a turn starts: played live, or frozen in one state (the ?state= values). */
export type TurnMode = 'live' | 'answer' | 'working' | 'error' | 'chart-error'
export type TurnHandle = { stop: () => void }

/**
 * One question and Valerie's answer. The answer plays out like the live product:
 * working (steps tick through) → answer text → chart, or stops at a step in 'error' mode.
 * Version B's working has two stages: the analysis, then the skeleton for its last moments (`shaping`).
 */
export const Turn = forwardRef<TurnHandle, {
  prompt: Prompt; persona: Persona; mode: TurnMode
  onWorking?: (working: boolean) => void
  /** Only the latest turn offers follow-ups. */
  onFollowUp?: (text: string) => void
  /** A brief (Brie, main design): whether it's the document open beside the chat, and how to open it. Called once it's written. */
  docOpen?: boolean
  onDoc?: () => void
}>(function Turn({ prompt, persona, mode: initial, onWorking, onFollowUp, docOpen = false, onDoc }, ref) {
  const settled = initial === 'answer' || initial === 'chart-error'
  const [mode, setMode] = useState(initial)
  const [active, setActive] = useState(settled ? -1 : 0)
  const [chartReady, setChartReady] = useState(settled)
  const [failedAt, setFailedAt] = useState<number | null>(null)
  const [chartFailed, setChartFailed] = useState(initial === 'chart-error')
  const [run, setRun] = useState(0)
  const [shaping, setShaping] = useState(!ABSTRACT)
  const timers = useRef<number[]>([])
  const { setAnsweredFor } = useStore()

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setAnsweredFor(prompt.id, persona)
    setFailedAt(null); setChartFailed(mode === 'chart-error')
    if (mode === 'answer' || mode === 'chart-error') { setActive(-1); setChartReady(true); return }
    setActive(0); setChartReady(false); setShaping(!ABSTRACT)
    if (mode === 'working') { setActive(Math.min(2, prompt.steps.length - 1)); return }
    const failAt = mode === 'error' ? Math.min(2, prompt.steps.length - 1) : -1
    let t = 0
    // Each step takes as long as the data says it did (the answer header shows the same total).
    for (let i = 0; i < prompt.steps.length; i++) {
      t += prompt.steps[i].seconds * 1000
      if (i === failAt) { timers.current.push(window.setTimeout(() => { setFailedAt(i); play('error') }, t)); break }
      const last = i + 1 >= prompt.steps.length
      timers.current.push(window.setTimeout(() => { setActive(last ? -1 : i + 1); if (!last) play('step') }, t))
    }
    if (ABSTRACT && failAt === -1) timers.current.push(window.setTimeout(() => setShaping(true), t - Math.min(SHAPING_MS, t * 0.4)))
    // The chart lands once the lead has streamed and the body is in.
    if (failAt === -1 && prompt.chart) timers.current.push(window.setTimeout(() => setChartReady(true), t + 900 + streamMs(answers[prompt.id].lead)))
    return () => timers.current.forEach(clearTimeout)
  }, [prompt, mode, run])

  const failed = failedAt !== null
  const working = active !== -1 && !failed
  useEffect(() => { onWorking?.(working) }, [working])
  // A brief opens beside the chat as soon as it's written (or at once, when the turn starts settled).
  const brief = briefFor(prompt, persona)
  useEffect(() => { if (brief && !working && !failed) onDoc?.() }, [working, failed])

  useImperativeHandle(ref, () => ({
    stop: () => { timers.current.forEach(clearTimeout); setActive(-1); setChartReady(true) },
  }))

  const retryAnswer = () => { setMode('live'); setRun((n) => n + 1) }
  const retryChart = () => {
    setChartFailed(false); setChartReady(false)
    timers.current.push(window.setTimeout(() => setChartReady(true), 900))
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[720px]"><UserBubble text={prompt.question} /></div>
      <div className="mt-8">
        {failed ? (
          <AnswerErrorView prompt={prompt} persona={persona} failed={failedAt} onRetry={retryAnswer} />
        ) : working ? (
          <WorkingView prompt={prompt} persona={persona} active={active} shaping={shaping && !brief} />
        ) : brief ? (
          <BriefReply prompt={prompt} persona={persona} brief={brief} open={docOpen} onOpen={() => onDoc?.()} stream={!settled || mode !== initial} />
        ) : (
          <AnswerView prompt={prompt} persona={persona} stream={!settled || mode !== initial} chartReady={chartReady} chartFailed={chartFailed} onRetryChart={retryChart} onFollowUp={onFollowUp} />
        )}
      </div>
    </>
  )
})
