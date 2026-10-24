import { useState } from 'react'
import { ChevronDown, Copy, ListChecks, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react'
import { AuraOrb } from '@/components/brand/AuraOrb'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ChartFor, ChartSkeleton } from '@/components/charts'
import { StepsList } from './StepsList'
import { followUpOffer, type Prompt } from '@/data/prompts'
import { inline, splitAnswer } from '@/lib/markdown'
import { totalSeconds } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

/** Valerie's answer. Reading order: header → lead → body → chart → source → actions → follow-ups. */
export function AnswerView({ prompt, chartReady = true, onFollowUp }: { prompt: Prompt; chartReady?: boolean; onFollowUp: (text: string) => void }) {
  const [stepsOpen, setStepsOpen] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const { openTraces } = useStore()
  const toast = useToast()
  const { lead, body } = splitAnswer(prompt.answer)
  const secs = totalSeconds(prompt.steps)

  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2">
          <AuraOrb size={28} />
          <span className="text-sm font-semibold">Valerie</span>
          <span className="text-xs text-muted-foreground">{secs}s</span>
          <button
            onClick={() => setStepsOpen((o) => !o)}
            className="ml-auto flex h-7 items-center gap-1.5 rounded-full border border-border pl-2.5 pr-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-expanded={stepsOpen}
          >
            <ListChecks className="size-3.5" />
            {prompt.summary} in {prompt.steps.length} steps
            <ChevronDown className={cn('size-3.5 transition-transform', stepsOpen && 'rotate-180')} />
          </button>
        </div>

        {stepsOpen && (
          <div className="mt-3 rounded-2xl border border-border p-4 animate-rise">
            <StepsList steps={prompt.steps} showDetail />
            <div className="mt-3 flex justify-end border-t border-border pt-3">
              <Button variant="ghost" onClick={() => openTraces(prompt.id)}>Open full trace</Button>
            </div>
          </div>
        )}

        <h2 className="mt-5 text-xl font-semibold leading-7 tracking-[-0.01em] text-balance">{lead}</h2>
        <div className="mt-4 flex flex-col gap-4 text-base leading-[26px] text-foreground/90">
          {body.map((p, i) => <p key={i}>{inline(p)}</p>)}
        </div>
      </div>

      <div className="mt-8 w-full max-w-[960px]">
        {chartReady ? <ChartFor id={prompt.chart} /> : <ChartSkeleton />}
        <div className="mt-3 flex items-start gap-2 px-1">
          <Badge>{prompt.lens}</Badge>
          <p className="text-xs leading-5 text-muted-foreground">{prompt.footnote}</p>
        </div>
      </div>

      <div className="mt-6 w-full max-w-[720px]">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" aria-label="Copy" onClick={() => { navigator.clipboard?.writeText(`${lead}\n\n${body.join('\n\n')}`.replace(/\*\*/g, '')); toast('Answer copied') }}><Copy /></Button>
          <Button variant="ghost" size="icon" aria-label="Good answer" className={cn(rating === 'up' && 'text-brand-600')} onClick={() => { setRating('up'); toast('Thanks for the feedback') }}><ThumbsUp /></Button>
          <Button variant="ghost" size="icon" aria-label="Bad answer" className={cn(rating === 'down' && 'text-brand-600')} onClick={() => { setRating('down'); toast('Thanks, we’ll look into it') }}><ThumbsDown /></Button>
          <Button variant="ghost" size="icon" aria-label="Regenerate" onClick={() => toast('Regenerate isn’t live in this prototype')}><RefreshCw /></Button>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{followUpOffer}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {prompt.followUps.map((f) => <Button key={f} variant="chip" onClick={() => onFollowUp(f)}>{f}</Button>)}
        </div>
      </div>
    </section>
  )
}

export function WorkingView({ prompt, active }: { prompt: Prompt; active: number }) {
  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2">
          <AuraOrb size={28} thinking />
          <span className="text-sm font-semibold">Valerie</span>
          <span className="text-xs text-muted-foreground">Working · step {Math.min(active + 1, prompt.steps.length)} of {prompt.steps.length}</span>
        </div>
        <div className="mt-4 rounded-2xl border border-border p-4">
          <StepsList steps={prompt.steps} active={active} showDetail />
        </div>
      </div>
      <div className="mt-8 w-full max-w-[960px]"><ChartSkeleton /></div>
    </section>
  )
}
