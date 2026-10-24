import { ChartCard } from './ChartCard'
import { Badge } from '@/components/ui/Badge'
import { leavesOut as d } from '@/data/charts'

const tone = { 'Worth watching': 'green', 'Not a fit': 'amber', 'Too small': 'amber' } as const

export function LeavesOutCards() {
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} howTo="Share is the topic’s share of its own dimension over the last year; growth is the yearly change in that share.">
      <div className="grid grid-cols-3 gap-4">
        {d.items.map((it) => (
          <div key={it.topic} className="flex flex-col rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-base font-semibold leading-6">{it.topic}</p>
            <div className="mt-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">{it.dimension}</span>
              <span className="font-semibold text-data-up">+{it.growth}% <span className="font-normal italic text-muted-foreground">(share / year)</span></span>
            </div>
            <div className="mt-4 flex-1 rounded-lg bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">{it.share}%</span>
                <Badge tone={tone[it.verdict]}>{it.verdict}</Badge>
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{d.footer}</p>
    </ChartCard>
  )
}
