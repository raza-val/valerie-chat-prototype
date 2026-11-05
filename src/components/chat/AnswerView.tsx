import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AlertCircle, ChevronDown, Loader2, Copy, RefreshCw, RotateCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Aura, type AuraHandle } from '@/components/brand/Aura'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ChartError, ChartFor, ChartSkeleton } from '@/components/charts'
import { LiveSteps, StepsList } from './StepsList'
import { followUpOffer, type Prompt } from '@/data/prompts'
import { errorCopy, voiceCopy } from '@/data/ui'
import { answers } from '@/data/answers'
import type { Persona } from '@/data/personas'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'
import { ABSTRACT, VOICE } from '@/lib/aura'
import { WORD_MS, streamMs } from '@/lib/motion'
import { canPlay, play, soundOn } from '@/lib/sound'
import { line, playClip, saidBy, wordTimes } from '@/lib/voice'

/**
 * Valerie's answer, all in the 720px column, laid out as the Figma answer designs (AI-chat-screen, "Output" 119:41560):
 * header → the lead in semibold → paragraphs → the chart card. Then this prototype's own quiet ending: four icon actions and,
 * under the latest answer, the follow-up offer and chips. The method footnote lives with the steps, one click away.
 */
export function AnswerView({ prompt, persona, stream = false, chartReady = true, chartFailed = false, onRetryChart, onFollowUp }: {
  prompt: Prompt; persona: Persona; chartReady?: boolean; chartFailed?: boolean; onRetryChart?: () => void
  /** Just finished live: stream the lead word by word, then bring in the body in order. */
  stream?: boolean
  /** Follow-up offer and chips; only the latest answer in a thread gets them. */
  onFollowUp?: (text: string) => void
}) {
  const [stepsOpen, setStepsOpen] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const { openTraces } = useStore()
  const toast = useToast()
  const a = answers[prompt.id]
  const plain = [a.lead, ...a.paragraphs.map((p) => (typeof p === 'string' ? p : p.strong + p.text))].join('\n\n')

  const words = a.lead.split(' ')
  const leadMs = stream ? streamMs(a.lead) : 0
  const [shown, setShown] = useState(leadMs ? 0 : words.length)
  const bodyAt = leadMs ? leadMs + 120 : 0
  const doneAt = leadMs ? bodyAt + 260 + a.paragraphs.length * 90 : 0
  const [speaking, setSpeaking] = useState(doneAt > 0)
  // Two-tone only when Aura reads the lead aloud: it waits in grey and turns to ink with the voice. Without sound
  // (or with ?lead=blur) the words stream in already in ink; grey text with nothing being said is just washed out.
  const [voiced] = useState(() => !!leadMs && soundOn() && canPlay())
  const [twoTone] = useState(() => voiced && new URLSearchParams(location.search).get('lead') !== 'blur')
  // Aura's beat: one swell per clause spoken (words ending in punctuation), on the same clock as the ink.
  const beat = words.slice(0, shown).filter((w) => /[,.;:]$/.test(w)).length

  // Aura's voice. With sound on, a live answer is read aloud: the ink follows the voice instead of the word clock,
  // then the latest answer offers its follow-up. Tap Aura to hear the headline again, or to stop.
  const aura = useRef<AuraHandle>(null)
  const [talking, setTalking] = useState(false)
  const hush = useRef<(() => void) | null>(null)
  const say = (name: string, ink: boolean, then?: () => void) => {
    hush.current?.()
    if (ink) setShown(0)
    setTalking(true)
    void line(name).then((clip) => {
      const at = ink ? wordTimes(a.lead, clip) : null
      hush.current = playClip(clip, (f) => { aura.current?.level(f.level); if (at) setShown(saidBy(at, f.t)) }, () => {
        hush.current = null
        setTalking(false)
        if (ink) setShown(words.length)
        then?.()
      })
    })
  }
  const latest = useRef(!!onFollowUp)
  latest.current = !!onFollowUp
  const offer = () => { if (latest.current) window.setTimeout(() => latest.current && say('offer', false), 400) }
  useEffect(() => { if (!onFollowUp) hush.current?.() }, [!!onFollowUp]) // a newer turn has started
  useEffect(() => () => hush.current?.(), [])

  const cued = useRef(false)
  useEffect(() => {
    if (!leadMs) return
    // The cue and the voice play once; the word clock and the end of speaking are set up on every run, so dev mode
    // (which runs effects twice, cleaning up the first) still inks the lead and settles Aura.
    if (!cued.current) {
      cued.current = true
      play('answer')
      if (voiced) say(`lead-${prompt.id}`, true, offer)
    }
    const iv = voiced ? 0 : window.setInterval(() => setShown((n) => (n >= words.length ? n : n + 1)), WORD_MS)
    const t = window.setTimeout(() => setSpeaking(false), doneAt)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, []) // runs once: an answer streams only when it first appears
  const after = (ms: number): CSSProperties | undefined => (leadMs ? { animationDelay: `${ms}ms` } : undefined)

  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2.5">
          <Aura ref={aura} size={28} state={speaking || talking ? 'speaking' : 'idle'} continues={stream} beat={leadMs || talking ? beat : 0}
            onTap={VOICE ? () => (talking ? hush.current?.() : say(`lead-${prompt.id}`, true)) : undefined} label={talking ? voiceCopy.stop : voiceCopy.listen} />
          {/* What Valerie did, beside Aura where the step line was while it worked; a click opens the steps. */}
          <button onClick={() => setStepsOpen((o) => !o)} className="-ml-1.5 flex h-8 min-w-0 items-center gap-1 rounded-lg px-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" aria-expanded={stepsOpen}>
            <span className="truncate">{prompt.summary} in {prompt.steps.length} steps</span>
            <ChevronDown className={cn('size-3.5 shrink-0 transition-transform', stepsOpen && 'rotate-180')} />
          </button>
        </div>

        {stepsOpen && (
          <div className="mt-4 animate-rise pl-[38px]">
            <StepsList steps={prompt.steps} showDetail={persona.toolDetail} />
            {/* The method note lives with the steps, one click away, not under the answer. */}
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{prompt.footnote}</p>
            <Button variant="ghost" className="-ml-3 mt-2" onClick={() => openTraces(prompt.id)}>Open full trace</Button>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-3">
          {/* The answer: the lead is the headline, 20px semibold; the paragraphs 16px, a blank line (24px) apart. */}
          <div className="text-base leading-6 text-foreground">
            <p className="text-xl font-semibold leading-7 tracking-[-0.01em] text-pretty" aria-label={a.lead}>
              {words.map((w, i) => (
                <span key={i} aria-hidden className={cn(twoTone || talking ? 'transition-colors duration-300' : 'transition-[opacity,filter] duration-300', twoTone || talking ? (i < shown ? 'text-foreground' : 'text-muted-foreground/45') : (i < shown ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'))}>{w}{i < words.length - 1 && ' '}</span>
              ))}
            </p>
            {a.paragraphs.map((para, i) => (
              <p key={i} className={cn('mt-6', leadMs && 'animate-rise')} style={after(bodyAt + i * 90)}>
                {typeof para === 'string' ? para : <><span className="font-semibold">{para.strong}</span>{para.text}</>}
              </p>
            ))}
          </div>

          {prompt.chart && (
            <div id={`chart-${prompt.id}`} className="scroll-mt-16">
              {chartFailed ? <ChartError id={prompt.chart} onRetry={onRetryChart} /> : chartReady ? <ChartFor id={prompt.chart} /> : <ChartSkeleton id={prompt.chart} />}
            </div>
          )}
        </div>

        <div className={cn(prompt.chart ? 'mt-4' : 'mt-5', leadMs && 'animate-rise')} style={after(doneAt)}>
          <div className="-ml-2 flex items-center gap-0.5 [&_button]:size-7 [&_svg]:!size-[15px]">
            <Button variant="ghost" size="icon" aria-label="Copy" onClick={() => { navigator.clipboard?.writeText(plain); toast('Answer copied') }}><Copy /></Button>
            <Button variant="ghost" size="icon" aria-label="Good answer" className={cn(rating === 'up' && 'text-brand-600')} onClick={() => { setRating('up'); toast('Thanks for the feedback') }}><ThumbsUp /></Button>
            <Button variant="ghost" size="icon" aria-label="Bad answer" className={cn(rating === 'down' && 'text-brand-600')} onClick={() => { setRating('down'); toast('Thanks, we’ll look into it') }}><ThumbsDown /></Button>
            <Button variant="ghost" size="icon" aria-label="Regenerate" onClick={() => toast('Regenerate isn’t live in this prototype')}><RefreshCw /></Button>
          </div>
          {onFollowUp && (
            <>
              <p className="mt-6 text-sm text-muted-foreground">{followUpOffer}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {prompt.followUps.map((f) => <Button key={f} variant="chip" onClick={() => onFollowUp(f)}>{f}</Button>)}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/** Working: progress folds into a pill showing the current step; expand it for the full step list. */
export function WorkingView({ prompt, persona, active, shaping = true }: { prompt: Prompt; persona: Persona; active: number; shaping?: boolean }) {
  const [open, setOpen] = useState(false)
  const step = Math.min(Math.max(active, 0), prompt.steps.length - 1)
  useEffect(() => { if (soundOn()) void line(`lead-${prompt.id}`) }, []) // fetch the voice while Valerie works
  // v1–v4: minimal. Aura changes form as the wait goes on; one line names the step, a glare sweeping across it while it runs,
  // and opens the steps only when clicked. The skeleton comes in only for the last moments (`shaping`).
  if (ABSTRACT) return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2.5">
          <Aura size={28} state="thinking" continues seat tether={open} />
          <button onClick={() => setOpen((o) => !o)} className="-ml-1.5 flex h-8 min-w-0 items-center gap-1 rounded-lg px-1.5 text-sm font-medium transition-colors hover:bg-surface" aria-expanded={open}>
            {/* Open, the steps below name the current one, so the line says only that Valerie is working. */}
            <span key={open ? 'open' : step} className="min-w-0 truncate animate-rise"><span className="glare-text">{open ? 'Working' : prompt.steps[step].label}</span></span>
            <ChevronDown className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
          </button>
        </div>
        {open && (
          <LiveSteps steps={prompt.steps} active={active} showDetail={persona.toolDetail} />
        )}
        {shaping && <AnswerSkeleton prompt={prompt} />}
      </div>
    </section>
  )
  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2.5">
          <Aura size={28} state="thinking" continues seat />
          <span className="text-sm text-muted-foreground">Working · step {step + 1} of {prompt.steps.length}</span>
          <button onClick={() => setOpen((o) => !o)} className="-mr-2 ml-auto flex h-8 min-w-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" aria-expanded={open}>
            {/* Open, the steps below show the current one, so the pill keeps only its chevron. */}
            {!open && <Loader2 className="size-4 shrink-0 animate-spin text-brand-600 dark:text-brand-300" />}
            {!open && <span key={step} className="truncate animate-rise">{prompt.steps[step].label}</span>}
            <ChevronDown className={cn('size-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
          </button>
        </div>
        {open && (
          <LiveSteps steps={prompt.steps} active={active} showDetail={persona.toolDetail} />
        )}
        <AnswerSkeleton prompt={prompt} />
      </div>
    </section>
  )
}

/**
 * Placeholder in the exact shape of the answer to come: its own headline and paragraphs laid out unseen in the
 * answer's type, each line a shimmer bar as long as that line, then its chart card, the same spacing as AnswerView.
 * So when the answer arrives it takes the skeleton's place line for line.
 */
function AnswerSkeleton({ prompt }: { prompt: Prompt }) {
  const a = answers[prompt.id]
  return (
    <div aria-hidden className="mt-3 flex animate-rise select-none flex-col gap-3 [animation-delay:200ms]">
      <div className="text-base leading-6">
        <p className="text-xl font-semibold leading-7 tracking-[-0.01em] text-pretty"><span className="skeleton-text">{a.lead}</span></p>
        {a.paragraphs.map((para, i) => (
          <p key={i} className="mt-6">
            <span className="skeleton-text">{typeof para === 'string' ? para : <><span className="font-semibold">{para.strong}</span>{para.text}</>}</span>
          </p>
        ))}
      </div>
      {prompt.chart && <ChartSkeleton id={prompt.chart} />}
    </div>
  )
}

/** The answer stopped at a step: the steps so far, the failed step, and a way to run it again. */
export function AnswerErrorView({ prompt, persona, failed, onRetry }: { prompt: Prompt; persona: Persona; failed: number; onRetry: () => void }) {
  const { openTraces } = useStore()
  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2.5">
          <Aura size={28} state="error" />
          <span className="text-sm font-medium">{errorCopy.stoppedAt(failed + 1, prompt.steps.length)}</span>
        </div>
        <div className="mt-4 rounded-2xl bg-surface shadow-hairline">
          <div className="p-4"><StepsList steps={prompt.steps} failed={failed} showDetail={persona.toolDetail} /></div>
          <div className="flex items-center gap-3 border-t border-border py-3 pl-4 pr-3">
            <AlertCircle className="size-4 shrink-0 text-data-down" />
            <p className="flex-1 text-sm font-semibold">{errorCopy.answerFailed}</p>
            <Button variant="ghost" onClick={() => openTraces(prompt.id)}>{errorCopy.trace}</Button>
            <Button onClick={onRetry}><RotateCw /> {errorCopy.retry}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
