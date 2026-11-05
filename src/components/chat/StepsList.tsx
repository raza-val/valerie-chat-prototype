import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { ABSTRACT, AURA_FORM } from '@/lib/aura'
import type { Step } from '@/data/prompts'
import { errorCopy } from '@/data/ui'
import { cn } from '@/lib/cn'

/**
 * Vertical list of reasoning steps. `active` = index of the step in progress (−1 = all done).
 * `failed` = index of a step that stopped the answer; later steps are left blank.
 */
export function StepsList({ steps, active = -1, failed, showDetail = false }: { steps: Step[]; active?: number; failed?: number; showDetail?: boolean }) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const stopped = failed !== undefined
        const isFailed = i === failed
        const done = stopped ? i < failed : active === -1 || i < active
        const current = !stopped && i === active
        return (
          <li key={s.label} className="relative flex gap-3 pb-3 last:pb-0">
            {i < steps.length - 1 && <span className={cn('absolute left-[9px] top-6 h-[calc(100%-20px)] w-px', done ? 'bg-brand-200 dark:bg-brand-800' : 'bg-border')} />}
            <span className={cn('relative mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border', done ? 'border-brand-600 bg-brand-600 text-white' : isFailed ? 'border-data-down bg-data-down text-white' : current ? 'border-brand-300 text-brand-600' : 'border-border text-transparent')}>
              {done ? <Check className="size-3 animate-tick" strokeWidth={3} /> : isFailed ? <X className="size-3 animate-tick" strokeWidth={3} /> : current ? <Loader2 className="size-3 animate-spin" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className={cn('text-sm', current || isFailed ? 'font-semibold text-foreground' : done ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
                <span className={cn('ml-auto shrink-0 text-xs tabular-nums', isFailed ? 'font-semibold text-data-down' : 'text-muted-foreground')}>
                  {done ? `${s.seconds}s` : isFailed ? errorCopy.stepFailed : current ? 'Working…' : stopped ? '' : 'Queued'}
                </span>
              </span>
              {showDetail && <span className="mt-0.5 block text-xs text-muted-foreground">{s.detail}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * While Valerie works, the opened steps hang from Aura: one line runs straight down out of it. In Version B it is the
 * constellation's own line: the constellation draws it from its lowest star to its bottom edge (Aura `tether`), and this
 * one carries it on down, in the same colour. It is drawn down from
 * Aura when the steps open and grows as each new step arrives; the steps sit beside it, only those reached so far.
 * The line sits under Aura's centre (14px) and starts at its bottom edge; the steps start on the header text's edge (38px).
 */
export function LiveSteps({ steps, active, showDetail = false }: { steps: Step[]; active: number; showDetail?: boolean }) {
  const reached = steps.slice(0, Math.max(active, 0) + 1)
  const list = useRef<HTMLOListElement>(null)
  const [reach, setReach] = useState(0)
  useEffect(() => {
    const el = list.current
    if (!el) return
    const ro = new ResizeObserver(() => setReach(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const lift = AURA_FORM === 'hologram' || AURA_FORM === 'solid' ? 5 : 0
  return (
    <div className="relative mt-1">
      {/* From Aura's bottom edge (6px above the list) to the last step's text: the same length as the list.
          The Hologram's and Solid acrylic's point sits 5px inside its box, so the line starts 5px higher, at the point. */}
      <span aria-hidden style={{ height: reach + lift, top: -6 - lift }} className={cn('absolute left-[13.5px] w-px transition-[height] duration-500 ease-out', ABSTRACT ? 'bg-brand-400/55 dark:bg-brand-300/55' : 'bg-border')} />
      <ol ref={list} className="flex flex-col">
        {reached.map((s, i) => {
          const current = i === reached.length - 1
          return (
            <li key={s.label} className="flex animate-rise items-start gap-2 py-1.5 pl-[38px] [animation-delay:250ms]">
              {current
                ? <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" />
                : <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
              <span className="min-w-0">
                <span className={cn('block text-sm', current ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                  {current && ABSTRACT ? <span className="glare-text">{s.label}</span> : s.label}
                </span>
                {showDetail && <span className="mt-0.5 block text-xs text-muted-foreground">{s.detail}</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
