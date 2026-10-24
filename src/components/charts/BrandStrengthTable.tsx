import { ChartCard } from './ChartCard'
import { brandStrength as d } from '@/data/charts'
import { cn } from '@/lib/cn'

const cols = [['positioning', 'Positioning'], ['usp', 'USP'], ['endorsements', 'Endorsements'], ['overall', 'Overall']] as const

export function BrandStrengthTable() {
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} howTo="Grades are ordinal (1 to 5) from the company-profile run. A dash means the grade was withheld, never that it is low.">
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-3 font-normal">Brand</th>
                {cols.map(([, l]) => <th key={l} className="pb-3 text-right font-normal">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r) => (
                <tr key={r.brand} className={cn('h-11 border-t border-border', r.isBespoke && 'font-semibold text-data-bespoke')}>
                  <td>{r.brand}</td>
                  {cols.map(([k]) => {
                    const v = r[k]
                    return <td key={k} className={cn('text-right tabular-nums', k === 'overall' && 'font-semibold', v === null && 'text-muted-foreground')}>{v === null ? '–' : k === 'overall' ? v.toFixed(2) : v}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">{d.note}</p>
        </div>
        <aside className="self-start rounded-xl bg-muted/60 p-4">
          <p className="text-sm font-semibold">Key insights</p>
          {d.insights.map((t) => <p key={t} className="mt-2 text-sm leading-6 text-muted-foreground">{t}</p>)}
        </aside>
      </div>
    </ChartCard>
  )
}
