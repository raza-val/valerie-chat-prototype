import { ChartCard } from './ChartCard'
import { purchaseDrivers as d } from '@/data/charts'
import { cn } from '@/lib/cn'

const MIN = -40, MAX = 100
const x = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`
const s = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : '0')

export function PurchaseDrivers() {
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} howTo="The bar on the left is how much each driver moves star ratings (10 = heaviest). On the right, the purple diamond is Bespoke’s net sentiment and the blue square the leaders’ average; hollow markers have fewer than 20 Bespoke mentions.">
      <div className="grid grid-cols-[120px_220px_56px_1fr] items-center gap-x-4 text-xs text-muted-foreground">
        <span>Importance</span><span className="text-center">Driver</span><span className="text-right">Gap</span><span className="pl-2">Net sentiment</span>
      </div>
      <ul className="mt-2">
        {d.rows.map((r) => {
          const gap = r.bespoke - r.leaders
          const lo = Math.min(r.bespoke, r.leaders), hi = Math.max(r.bespoke, r.leaders)
          return (
            <li key={r.driver} className="grid h-9 grid-cols-[120px_220px_56px_1fr] items-center gap-x-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-14 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-slate-400" style={{ width: `${r.importance * 10}%` }} /></span>
                <span className="tabular-nums text-xs font-semibold">{r.importance.toFixed(1)}</span>
              </span>
              <span className="truncate text-center">{r.driver}</span>
              <span className={cn('text-right text-xs font-semibold tabular-nums', gap >= 0 ? 'text-data-up' : 'text-data-down')}>{s(gap)}</span>
              <span className="relative h-full">
                <span className="absolute inset-y-0 w-px bg-border" style={{ left: x(0) }} />
                <span className={cn('absolute top-1/2 h-0.5 -translate-y-1/2', gap >= 0 ? 'bg-emerald-400' : 'bg-orange-400')} style={{ left: x(lo), width: `calc(${x(hi)} - ${x(lo)})` }} />
                <Marker v={r.leaders} kind="leader" hollow={false} />
                <Marker v={r.bespoke} kind="bespoke" hollow={!!r.thin} />
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-2 grid grid-cols-[120px_220px_56px_1fr] gap-x-4 text-xs text-muted-foreground">
        <span /><span /><span />
        <span className="relative h-4">{[-40, 0, 50, 100].map((t) => <span key={t} className="absolute -translate-x-1/2" style={{ left: x(t) }}>{s(t)}</span>)}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rotate-45 rounded-[2px] bg-data-bespoke" /> Bespoke</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[2px] bg-data-leader" /> Aspirational leaders (avg.)</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-emerald-400" /> Bespoke ahead</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-orange-400" /> Bespoke behind</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rotate-45 rounded-[2px] border-[1.5px] border-data-bespoke" /> Under 20 Bespoke mentions</span>
      </div>
    </ChartCard>
  )
}

function Marker({ v, kind, hollow }: { v: number; kind: 'bespoke' | 'leader'; hollow: boolean }) {
  return (
    <span className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center" style={{ left: x(v) }}>
      <span className={cn('size-2.5 rounded-[2px]', kind === 'bespoke' ? 'rotate-45' : '', hollow ? 'border-[1.5px] bg-background' : '', kind === 'bespoke' ? (hollow ? 'border-data-bespoke' : 'bg-data-bespoke') : 'bg-data-leader')} />
      <span className={cn('absolute whitespace-nowrap text-[11px] font-semibold tabular-nums', kind === 'bespoke' ? 'bottom-2.5 text-data-bespoke' : 'top-2.5 text-data-leader')}>{s(v)}</span>
    </span>
  )
}
