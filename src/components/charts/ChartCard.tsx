import { useState, type ReactNode } from 'react'
import { ArrowUpRight, ChevronDown, Info, Pin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

/**
 * Frame shared by every dashboard chart card (eyebrow, title, actions, body, "How to read").
 * The charts are existing dashboard designs: keep their look, change only their data.
 */
export function ChartCard({ eyebrow, title, subtitle, children, howTo }: { eyebrow: string; title: string; subtitle?: string; children: ReactNode; howTo?: string }) {
  const toast = useToast()
  const [pinned, setPinned] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <article className="rounded-2xl border border-border bg-slate-50/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:bg-card">
      <header className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase text-muted-foreground">{eyebrow}</p>
          <h3 className="mt-2 text-lg font-semibold leading-6 tracking-[-0.01em] text-balance">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={() => toast('Opens the full dashboard card')}>Deep <ArrowUpRight /></Button>
          <Button size="icon" aria-label="Pin insight" className={cn(pinned && 'border-brand-300 bg-brand-50 text-brand-700')} onClick={() => { setPinned((p) => !p); toast(pinned ? 'Removed from pinned insights' : 'Pinned to your insights') }}><Pin /></Button>
          <Button size="icon" aria-label="Explain" onClick={() => toast('Explain this card isn’t live in this prototype')}><Sparkles /></Button>
          <Button onClick={() => toast('About this card')}><Info /> About this card</Button>
        </div>
      </header>
      <div className="mt-5 rounded-xl border border-border/60 bg-background p-5">
        {children}
        <button onClick={() => setOpen((o) => !o)} className="mt-5 flex w-full items-center gap-2 border-t border-border pt-4 text-left text-sm font-semibold">
          <Info className="size-4 text-muted-foreground" /> How to read this chart
          <ChevronDown className={cn('ml-auto size-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>
        {open && <p className="mt-2 text-sm leading-6 text-muted-foreground">{howTo ?? 'Each value comes from the dataset named in the footnote under the card.'}</p>}
      </div>
    </article>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-6">
      <div className="skeleton h-3 w-40 rounded" />
      <div className="skeleton mt-3 h-5 w-3/4 rounded" />
      <div className="skeleton mt-2 h-5 w-1/2 rounded" />
      <div className="mt-6 flex h-56 items-end gap-3">
        {[60, 72, 66, 80, 76, 88, 70, 84, 92, 86, 96, 90].map((h, i) => <div key={i} className="skeleton flex-1 rounded-md" style={{ height: `${h}%` }} />)}
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-brand-500" /> Building the chart…</p>
    </div>
  )
}
