import { ArrowDownUp } from 'lucide-react'
import { ChartCard } from './ChartCard'
import { brandStrength as d } from '@/data/charts'
import { cn } from '@/lib/cn'

/**
 * R2 · Appendix A4 · Brand strength, as Figma draws it (AI-chat-screen 119:41659): a grades table (56px rows, a hairline
 * under every cell, the brand in a flexible column and four 108px grade columns with sort-style headers), its note, then
 * the Key insights panel. Bespoke's row is in its purple, semibold; a withheld grade is a grey dash.
 */
export function BrandStrengthTable() {
  return (
    <ChartCard title={d.title}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
            <colgroup>
              <col />
              {d.columns.map((c) => <col key={c.key} className="w-[108px]" />)}
            </colgroup>
            <thead>
              <tr className="h-14 [&>*]:border-b [&>*]:border-border">
                <th scope="col" className="truncate px-4 text-left font-semibold leading-6 text-muted-foreground">{d.brandLabel}</th>
                {d.columns.map((c) => (
                  <th key={c.key} scope="col" className="p-0 font-semibold leading-6 text-muted-foreground">
                    {/* Figma's ghost table-header button; it overflows its 108px column evenly when the label is long. */}
                    <span className="flex justify-center">
                      <span className="flex min-w-20 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-2xl px-4 py-3">
                        <span className="px-1">{c.label}</span>
                        <ArrowDownUp className="size-4 shrink-0" aria-hidden />
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r) => (
                <tr key={r.brand} className={cn('h-14 [&>*]:border-b [&>*]:border-border', r.isBespoke ? 'font-semibold text-data-bespoke-ink' : 'text-foreground')}>
                  <th scope="row" className={cn('truncate px-4 text-left', r.isBespoke ? 'leading-5' : 'font-normal leading-6')}>{r.brand}</th>
                  {d.columns.map(({ key }) => {
                    const v = r[key]
                    return (
                      <td key={key} className={cn('truncate text-center', v === null ? 'font-normal leading-6 text-muted-foreground' : 'font-semibold leading-5')}>
                        {v === null ? '–' : key === 'overall' ? v.toFixed(2) : v}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs leading-4 text-muted-foreground">{d.note}</p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-chart-card p-4">
          <p className="text-base font-semibold leading-6 text-foreground">{d.insightsTitle}</p>
          <div className="flex flex-col gap-2 text-sm leading-5 text-muted-foreground">
            {d.insights.map((t) => <p key={t}>{t}</p>)}
          </div>
        </div>
      </div>
    </ChartCard>
  )
}
