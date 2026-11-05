import { ChartCard } from './ChartCard'
import { topicShare as d } from '@/data/charts'

/**
 * R1 · Fastest share gainers, as Figma draws it (119:50016): the dimension legend, a 48px row per topic (its
 * dimension's dot, the topic, the growth in emerald on the right, hairlines between), then the reading note.
 */
export function TopicShareChart() {
  return (
    <ChartCard title={d.title} subtitle={d.subtitle}>
      <div className="flex flex-col gap-5">
        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {Object.entries(d.dimensions).map(([name, color]) => (
            <li key={name} className="flex items-center gap-1 px-1">
              <span className="size-3 shrink-0 rounded-full" style={{ background: color }} />
              <span className="whitespace-nowrap text-xs font-semibold leading-4 text-muted-foreground">{name}</span>
            </li>
          ))}
        </ul>
        <ol>
          {d.rows.map((r) => (
            <li key={r.topic} className="flex h-12 items-center border-b border-border">
              <span className="flex min-w-0 flex-1 items-center gap-2 px-4">
                <span className="size-3 shrink-0 rounded-full" style={{ background: d.dimensions[r.dimension] }} />
                <span className="min-w-0 flex-1 text-sm leading-5 text-foreground">{r.topic}</span>
              </span>
              <span className="w-[180px] shrink-0 px-4 text-right text-sm font-semibold leading-5 text-data-up-ink tabular-nums">+{r.growth.toFixed(1)}%</span>
            </li>
          ))}
        </ol>
        <p className="rounded-2xl bg-chart-card p-4 text-sm leading-5 text-ink-soft">{d.note}</p>
      </div>
    </ChartCard>
  )
}
