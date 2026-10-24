import { ChartCard } from './ChartCard'
import { Badge } from '@/components/ui/Badge'
import { reviewSources as d } from '@/data/charts'
import { thousands } from '@/lib/format'
import { cn } from '@/lib/cn'

export function ReviewSourcesChart() {
  const max = Math.max(...d.rows.map((r) => r.reviews))
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} howTo="Bar length is the number of written reviews in the analysis. Chips show which sources those reviews were collected from.">
      <ul>
        {d.rows.map((r) => (
          <li key={r.brand} className="grid h-12 grid-cols-[160px_1fr_220px] items-center gap-4 border-b border-border text-sm last:border-0">
            <span className={cn(r.isBespoke && 'font-semibold text-data-bespoke')}>{r.brand}</span>
            <span className="flex items-center gap-3">
              <span className={cn('h-2.5 rounded-full', r.isBespoke ? 'bg-data-bespoke' : 'bg-slate-300 dark:bg-slate-600')} style={{ width: `${Math.max(2, (r.reviews / max) * 100)}%` }} />
              <span className="shrink-0 tabular-nums text-xs font-semibold">{r.reviews ? thousands(r.reviews) : '0'}</span>
            </span>
            <span className="flex flex-wrap gap-1.5">
              {r.sources.length ? r.sources.map((s) => <Badge key={s}>{s}</Badge>) : <span className="text-xs text-muted-foreground">{'note' in r ? r.note : ''}</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">{d.note}</p>
    </ChartCard>
  )
}
