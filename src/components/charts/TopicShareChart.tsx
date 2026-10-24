import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from './ChartCard'
import { topicShare as d } from '@/data/charts'
import { cn } from '@/lib/cn'

export function TopicShareChart() {
  const [tab, setTab] = useState(d.activeTab)
  const rows = d.quarters.map((q, i) => Object.fromEntries([['q', q], ...d.series.map((s) => [s.topic, s.values[i]])]))
  return (
    <ChartCard eyebrow={d.eyebrow} title={d.title} howTo="Each bar is one quarter of Needs mentions split by topic; segments add to 100%. Lists below use the full 3-year window. Only the Needs dimension is loaded in this prototype.">
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {d.tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('rounded-md px-3 py-1 text-sm', t === tab ? 'bg-background font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground')}>{t}</button>
        ))}
      </div>
      {tab !== d.activeTab ? (
        <p className="grid h-72 place-items-center text-sm text-muted-foreground">Only the Needs dimension is loaded in this prototype.</p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-[1fr_200px] gap-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} barCategoryGap={6} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="q" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(q: string) => q.replace(' 20', ' ’')} interval={0} />
                  <YAxis hide width={0} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                  {d.series.map((s) => <Bar key={s.topic} dataKey={s.topic} stackId="a" fill={s.color} radius={0} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1 text-xs text-muted-foreground">
              {d.series.map((s) => <li key={s.topic} className="flex items-start gap-2"><span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: s.color }} />{s.topic}</li>)}
            </ul>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <List title={d.topTopics.title} subtitle={d.topTopics.subtitle} rows={d.topTopics.rows} kind="share" />
            <List title={d.fastestGrowing.title} subtitle={d.fastestGrowing.subtitle} rows={d.fastestGrowing.rows} kind="growth" />
            <List title={d.mostDeclining.title} subtitle={d.mostDeclining.subtitle} rows={d.mostDeclining.rows} kind="growth" />
          </div>
        </>
      )}
    </ChartCard>
  )
}

function List({ title, subtitle, rows, kind }: { title: string; subtitle: string; rows: [string, number][]; kind: 'share' | 'growth' }) {
  const max = Math.max(...rows.map((r) => r[1]))
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <ul className="mt-3">
        {rows.map(([name, v]) => (
          <li key={name} className="flex h-11 items-center gap-3 border-b border-border text-sm last:border-0">
            <span className="min-w-0 flex-1 truncate">{name}</span>
            {kind === 'share' ? (
              <span className="flex w-24 items-center gap-2"><span className="h-2 rounded-full bg-slate-300 dark:bg-slate-600" style={{ width: `${(v / max) * 56}px` }} /><span className="tabular-nums text-xs">{v}%</span></span>
            ) : (
              <span className={cn('w-14 text-right tabular-nums text-xs font-semibold', v >= 0 ? 'text-data-up' : 'text-data-down')}>{v > 0 ? '+' : '−'}{Math.abs(v).toFixed(1)}%</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
