import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { ChartCard } from './ChartCard'
import { purchaseDrivers as d } from '@/data/charts'
import { cn } from '@/lib/cn'
import gem from '@/assets/charts/marker-brand-gem.svg'
import under20 from '@/assets/charts/marker-under-20.svg'

/**
 * Purchase drivers, exactly as the Figma card draws it (AI-chat-screen 119:41950): a sortable table whose rows are
 * 32px tall (importance bar 56 · value 56 · driver 188 · gap 56, 8px apart), then a dumbbell per driver: Bespoke's gem
 * against the leaders' blue square, joined green when Bespoke is ahead and amber when behind (grey, with a hollow
 * square, under 20 mentions). The scale runs −40…+100 on a dashed guide that stops 74.61px short of the edge for the labels.
 */
const [MIN, MAX] = d.domain
const GUTTER = 74.61
const x = (v: number) => `calc((100% - ${GUTTER}px) * ${(v - MIN) / (MAX - MIN)})`
const s = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : '0')
const c = d.colors

type SortKey = 'importance' | 'sentiment'

export function PurchaseDrivers() {
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'importance', desc: true })
  const by = (key: SortKey) => setSort((p) => ({ key, desc: p.key === key ? !p.desc : true }))
  const rows = [...d.rows].sort((a, b) => {
    const diff = sort.key === 'importance' ? b.importance - a.importance : b.bespoke - a.bespoke
    return sort.desc ? diff : -diff
  })

  return (
    <ChartCard title={d.title} subtitle={d.subtitle}>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <Header className="w-[120px] justify-end" onSort={() => by('importance')}>{d.columns.importance}</Header>
          <Header className="w-[220px] justify-center">{d.columns.driver}</Header>
          <Header className="min-w-0 flex-1" onSort={() => by('sentiment')}>{d.columns.sentiment}</Header>
        </div>
        <ul>
          {rows.map((r) => <Row key={r.driver} {...r} />)}
        </ul>
        <div className="flex gap-2 pt-1">
          <span className="w-[380px] shrink-0" />
          <span className="relative h-4 flex-1">
            {d.ticks.map((t) => (
              <span key={t} className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-sm leading-5 text-muted-foreground" style={{ left: x(t) }}>{s(t)}</span>
            ))}
          </span>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold leading-4 text-muted-foreground">
        <Key mark={<Gem />}>{d.legend.bespoke}</Key>
        <Key mark={<Leader />}>{d.legend.leaders}</Key>
        <Key mark={<Line color={c.ahead} />} bare>{d.legend.ahead}</Key>
        <Key mark={<Line color={c.behind} />} bare>{d.legend.behind}</Key>
        <Key mark={<Hollow />}>{d.legend.thin}</Key>
      </ul>
    </ChartCard>
  )
}

/** A column header: the DS's ghost table-header button (8px sides, 6px top and bottom, 12px corners) over a slate/100 hairline. */
function Header({ className, onSort, children }: { className?: string; onSort?: () => void; children: ReactNode }) {
  const inner = (
    <>
      <span className="px-1 text-sm font-semibold leading-6 text-muted-foreground">{children}</span>
      {onSort && <ArrowDownUp className="size-4 text-muted-foreground" strokeWidth={1.5} aria-hidden />}
    </>
  )
  const button = 'flex min-w-16 shrink-0 items-center justify-center rounded-xl px-2 py-1.5'
  return (
    <div className={cn('relative flex shrink-0 items-center py-1', className)}>
      {onSort
        ? <button type="button" onClick={onSort} className={cn(button, 'transition-colors hover:bg-muted')}>{inner}</button>
        : <span className={button}>{inner}</span>}
      <span className="absolute inset-x-0 bottom-0 h-px bg-muted" />
    </div>
  )
}

function Row({ driver, importance, bespoke, leaders, thin }: (typeof d.rows)[number]) {
  const gap = bespoke - leaders
  const ahead = gap >= 0
  const lo = Math.min(bespoke, leaders), hi = Math.max(bespoke, leaders)
  const bespokeInk = thin ? 'text-muted-foreground' : 'text-data-bespoke-ink'
  return (
    <li className="flex items-center gap-2 py-1.5">
      <span className="relative h-4 w-14 shrink-0">
        <span className="absolute inset-y-0 right-0 rounded-[4px]" style={{ width: `${importance * 10}%`, background: c.importance, boxShadow: c.importanceGloss }} />
      </span>
      <span className="w-14 shrink-0 text-right text-sm font-semibold leading-5 text-foreground">{importance.toFixed(1)}</span>
      <span className="w-[188px] shrink-0 text-center text-sm leading-5 text-foreground">{driver}</span>
      <span
        className={cn('w-14 shrink-0 text-sm font-semibold leading-5', thin ? 'text-muted-foreground' : ahead && 'text-data-up-ink')}
        style={!thin && !ahead ? { color: c.behindInk } : undefined}
      >
        {s(gap)}
      </span>
      <span className="relative h-5 min-w-0 flex-1">
        {/* the dashed guide: 3.02px dashes, starting on a half dash */}
        <span
          className="absolute left-0 top-[9px] h-px"
          style={{ right: GUTTER, backgroundImage: 'linear-gradient(to right, var(--border) 50%, transparent 50%)', backgroundSize: '6.04px 1px', backgroundPosition: '-1.51px 0' }}
        />
        <span className="absolute -top-1.5 h-8 w-px bg-muted-foreground/40" style={{ left: x(0) }} />
        <span
          className={cn('absolute top-[8.5px] h-[3px] rounded-[2px]', thin && 'bg-border')}
          style={{ left: x(lo), width: `calc(${x(hi)} - ${x(lo)})`, background: thin ? undefined : ahead ? c.ahead : c.behind }}
        />
        <At v={leaders} className="top-[2.5px]"><Leader /></At>
        <At v={bespoke} className="top-px">{thin ? <Hollow /> : <Gem />}</At>
        <Label v={lo} side="left" className={lo === bespoke ? bespokeInk : 'text-muted-foreground'} />
        <Label v={hi} side="right" className={hi === bespoke && lo !== bespoke ? bespokeInk : 'text-muted-foreground'} />
      </span>
    </li>
  )
}

/** Centres a marker on a value. */
function At({ v, className, children }: { v: number; className?: string; children: ReactNode }) {
  return <span className={cn('absolute flex -translate-x-1/2', className)} style={{ left: x(v) }}>{children}</span>
}

/** A value beside its marker: 10px clear of the centre on the left, 14px on the right, as Figma sets them. */
function Label({ v, side, className }: { v: number; side: 'left' | 'right'; className: string }) {
  const style: CSSProperties = side === 'left'
    ? { left: x(v), transform: 'translateX(calc(-100% - 10px))' }
    : { left: `calc(${x(v)} + 14px)` }
  return <span className={cn('absolute top-[2px] whitespace-nowrap text-sm font-semibold leading-5', className)} style={style}>{s(v)}</span>
}

const Gem = () => <img src={gem} alt="" width={18} height={18} className="block" />
const Hollow = () => <img src={under20} alt="" width={18} height={18} className="block" />
const Leader = () => <span className="block size-[15px] rounded-[1.654px] border-[0.882px] border-chart-card bg-brand-400" style={{ boxShadow: c.leaderGloss }} />
const Line = ({ color }: { color: string }) => <span className="block h-[3px] w-3 rounded-[2px]" style={{ background: color }} />

/** A legend entry, 4px from its name: a marker in a 20px box, or a bare 12px line. */
function Key({ mark, bare, children }: { mark: ReactNode; bare?: boolean; children: ReactNode }) {
  return (
    <li className="flex items-center gap-1 px-1">
      {bare ? mark : <span className="grid size-5 place-items-center">{mark}</span>}
      <span>{children}</span>
    </li>
  )
}
