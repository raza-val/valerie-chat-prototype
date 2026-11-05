import { ArrowLeft, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { getPrompt, prompts } from '@/data/prompts'
import { totalSeconds } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

const traceId = (id: string) => `tr_${(id.length * 7919).toString(16)}${id.slice(0, 3)}`

/** Traces: list of runs, or the step-by-step timing of one run. */
export function TracesDrawer() {
  const { tracesOpen, closeTraces, traceFocus, persona: current, answeredFor } = useStore()
  const [sel, setSel] = useState<string | null>(traceFocus)
  const toast = useToast()
  useEffect(() => setSel(traceFocus), [traceFocus, tracesOpen])
  const p = getPrompt(sel ?? undefined)

  return (
    <Sheet open={tracesOpen} onClose={closeTraces} title={p ? 'Trace' : 'View traces'} description={p ? p.question : 'How Valerie produced each reply: steps, tool calls and timings.'} width={480}>
      {!p ? (
        // Grouped by day like Chats; every run here answered, so a status would only repeat itself.
        ['Today', 'Yesterday', 'Mon'].map((w) => ({ w, items: prompts.filter((x) => x.when === w) })).filter((g) => g.items.length).map((g, i) => (
          <div key={g.w} className={cn(i > 0 && 'mt-5')}>
            <p className="text-xs font-medium text-muted-foreground">{g.w === 'Mon' ? 'Earlier this week' : g.w}</p>
            <ul className="-mx-2.5 mt-1.5">
              {g.items.map((x) => (
                <li key={x.id}>
                  <button onClick={() => setSel(x.id)} className="block w-full rounded-lg px-2.5 py-2.5 text-left hover:bg-muted">
                    <span className="block text-sm font-medium leading-5">{x.question}</span>
                    <span className="mt-1 block text-xs tabular-nums text-muted-foreground">{totalSeconds(x.steps)}s · {x.steps.length} steps</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <TraceDetail id={p.id} onBack={() => setSel(null)} onCopy={() => { navigator.clipboard?.writeText(traceId(p.id)); toast('Trace ID copied') }} persona={((x) => `${x.name}, ${x.role}`)(answeredFor[p.id] ?? current)} />
      )}
    </Sheet>
  )
}

function TraceDetail({ id, onBack, onCopy, persona }: { id: string; onBack: () => void; onCopy: () => void; persona: string }) {
  const p = getPrompt(id)!
  const total = totalSeconds(p.steps)
  let start = 0
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack}><ArrowLeft /> All traces</Button>
        <span className="flex-1" />
        <Button onClick={onCopy}><Copy /> Copy trace ID</Button>
      </div>
      <div className="mt-4 rounded-xl bg-muted/60 p-4">
        <p className="text-lg font-semibold">{p.steps.length} steps · {total}s</p>
        <p className="mt-1 text-xs text-muted-foreground">{traceId(p.id)} · Answered for {persona}</p>
      </div>
      <ol className="mt-4">
        {p.steps.map((s, i) => {
          const left = (start / total) * 100
          const width = Math.max(3, (s.seconds / total) * 100)
          start += s.seconds
          return (
            <li key={s.label} className="border-b border-border py-3.5 last:border-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{i + 1}. {s.label}</span>
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">{s.seconds}s</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
              <div className="relative mt-2 h-1.5 rounded-full bg-muted">
                <span className="absolute inset-y-0 rounded-full bg-brand-600" style={{ left: `${left}%`, width: `${width}%` }} />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
