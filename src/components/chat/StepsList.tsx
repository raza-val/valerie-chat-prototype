import { Check, Loader2 } from 'lucide-react'
import type { Step } from '@/data/prompts'
import { cn } from '@/lib/cn'

/** Vertical list of reasoning steps. `active` = index of the step in progress (−1 = all done). */
export function StepsList({ steps, active = -1, showDetail = false }: { steps: Step[]; active?: number; showDetail?: boolean }) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const done = active === -1 || i < active
        const current = i === active
        return (
          <li key={s.label} className="relative flex gap-3 pb-3 last:pb-0">
            {i < steps.length - 1 && <span className={cn('absolute left-[9px] top-6 h-[calc(100%-20px)] w-px', done ? 'bg-brand-200 dark:bg-brand-800' : 'bg-border')} />}
            <span className={cn('relative mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border', done ? 'border-brand-600 bg-brand-600 text-white' : current ? 'border-brand-300 text-brand-600' : 'border-border text-transparent')}>
              {done ? <Check className="size-3" strokeWidth={3} /> : current ? <Loader2 className="size-3 animate-spin" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className={cn('text-sm', current ? 'font-semibold text-foreground' : done ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
                <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{done ? `${s.seconds}s` : current ? 'Working…' : 'Queued'}</span>
              </span>
              {showDetail && <span className="mt-0.5 block text-xs text-muted-foreground">{s.detail}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
