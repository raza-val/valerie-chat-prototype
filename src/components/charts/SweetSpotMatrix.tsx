import { useState } from 'react'
import { ChevronDown, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ChartCard } from './ChartCard'
import { leaders, sweetSpot as d } from '@/data/charts'
import { cn } from '@/lib/cn'

const Diamond = () => <span className="inline-block size-2.5 rotate-45 rounded-[2px] bg-data-bespoke" />
const Square = () => <span className="inline-block size-2.5 rounded-[2px] bg-data-leader" />

export function SweetSpotMatrix() {
  const [open, setOpen] = useState<Record<string, boolean>>({ 'Growing trends': true })
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} howTo="A purple diamond means Bespoke plays in the topic; a blue square means that aspirational leader does. Growth of share is the yearly change in the topic’s share of discussion.">
      <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Diamond /> Bespoke plays in it</span>
        <span className="flex items-center gap-1.5"><Square /> Aspirational leader</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="w-[240px] pb-3 text-left font-normal">Topic</th>
              <th className="px-2 pb-3 text-right font-normal">Growth of share</th>
              <th className="px-2 pb-3 text-center font-semibold text-data-bespoke">Bespoke</th>
              {leaders.map((l) => <th key={l} className="w-[72px] px-2 pb-3 text-center font-normal leading-4">{l}</th>)}
            </tr>
          </thead>
          {d.groups.map((g) => {
            const isOpen = !!open[g.label]
            const Icon = g.direction === 'up' ? TrendingUp : g.direction === 'down' ? TrendingDown : Minus
            return (
              <tbody key={g.label}>
                <tr className="h-11 cursor-pointer border-t border-border" onClick={() => setOpen((o) => ({ ...o, [g.label]: !o[g.label] }))}>
                  <td colSpan={3 + leaders.length}>
                    <span className="flex items-center gap-2">
                      <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !isOpen && '-rotate-90')} />
                      <Icon className={cn('size-4', g.direction === 'up' ? 'text-data-up' : g.direction === 'down' ? 'text-data-down' : 'text-muted-foreground')} />
                      <span className="font-semibold">{g.label}</span>
                      <span className="text-xs text-muted-foreground">{g.meta}</span>
                    </span>
                  </td>
                </tr>
                {isOpen && g.rows.map((r) => (
                  <tr key={r.topic} className="h-11 border-t border-border">
                    <td className="pr-4">{r.topic}</td>
                    <td className="px-2 text-right text-xs font-semibold tabular-nums text-data-up">+{r.growth}%</td>
                    <td className="text-center">{r.bespoke && <Diamond />}</td>
                    {leaders.map((l) => <td key={l} className="text-center">{r.leaders.includes(l) && <Square />}</td>)}
                  </tr>
                ))}
                {isOpen && g.rows.length === 0 && <tr className="border-t border-border"><td colSpan={3 + leaders.length} className="py-3 pl-6 text-xs text-muted-foreground">Not loaded in this prototype.</td></tr>}
              </tbody>
            )
          })}
        </table>
      </div>
    </ChartCard>
  )
}
