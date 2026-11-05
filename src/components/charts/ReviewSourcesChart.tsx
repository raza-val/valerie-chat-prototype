import { ChartCard } from './ChartCard'
import { reviewSources as d } from '@/data/charts'
import { thousands } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * Appendix B · review sources, as Figma draws it (AI-chat-screen 119:41734): one 28px row per brand with a 12px gap —
 * name (176px), a soft 24px bar scaled to the largest count, the count (64px, right-aligned) and the source chips (300px).
 * Bespoke's row is purple; a caption sits 20px under the list.
 */
export function ReviewSourcesChart() {
  const max = Math.max(...d.rows.map((r) => r.reviews))
  return (
    <ChartCard title={d.title}>
      <div className="flex flex-col gap-5">
        <ul className="flex flex-col gap-3">
          {d.rows.map((r) => (
            <li key={r.brand} className="flex items-center gap-3 text-sm leading-5">
              <span className={cn('w-44 shrink-0', r.isBespoke ? 'font-semibold text-data-bespoke-ink' : 'text-foreground')}>{r.brand}</span>
              <span className="flex h-7 min-w-0 flex-1 items-center">
                <span
                  className="h-6 rounded-lg"
                  style={{ width: `${(r.reviews / max) * 100}%`, backgroundColor: r.isBespoke ? d.bars.bespoke : d.bars.leader, boxShadow: d.bars.sheen }}
                />
              </span>
              <span className={cn('w-16 shrink-0 text-right font-semibold', r.isBespoke ? 'text-data-bespoke-ink' : 'text-foreground')}>{thousands(r.reviews)}</span>
              <span className="flex w-[300px] shrink-0 items-center gap-2 overflow-hidden">
                {r.sources.map((s) => (
                  <span key={s} className="shrink-0 whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold leading-4 text-foreground">{s}</span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-4 text-muted-foreground">{d.note}</p>
      </div>
    </ChartCard>
  )
}
