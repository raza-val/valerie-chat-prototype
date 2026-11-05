import { ChartCard } from './ChartCard'
import { leavesOut as d, type Verdict } from '@/data/charts/leavesOut'
import { cn } from '@/lib/cn'

/** Figma's "Badge-custom": green for the one trend worth watching, amber for the ones Bespoke can leave out. */
const verdictTone: Record<Verdict, string> = {
  'Worth watching': 'border-badge-up-border from-badge-up-from to-badge-up-to text-data-up-ink',
  'Not a fit': 'border-badge-warn-border from-badge-warn-from to-badge-warn-to text-badge-warn-ink',
  'Too small': 'border-badge-warn-border from-badge-warn-from to-badge-warn-to text-badge-warn-ink',
}

/**
 * The growing trends Bespoke doesn't play in, as Figma draws them (AI-chat-screen 119:41805): one slate/50 card per
 * trend (name, dimension and growth), with a white box inside for its share of the conversation, the verdict and why;
 * then the closing line. Figma draws its strokes inside the frame, so a bordered box's padding here is Figma's less 1px
 * (card 16 → 15, badge 12 × 6 → 11 × 5); the inner white box is the exception, Figma lays it out 13px in (12 + its stroke).
 */
export function LeavesOutCards() {
  return (
    <ChartCard title={d.title}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {d.items.map((it) => (
            <section key={it.topic} className="flex flex-col gap-4 rounded-2xl border border-border bg-chart-card p-[15px]">
              <div className="flex flex-col gap-3">
                <h4 className="text-xl font-semibold leading-6 tracking-[-0.6px] text-foreground">{it.topic}</h4>
                <div className="flex items-center gap-4">
                  <p className="min-w-0 flex-1 text-base font-semibold leading-6 text-muted-foreground">{it.dimension}</p>
                  <p className="flex shrink-0 items-center gap-1 whitespace-nowrap">
                    <span className="text-sm font-semibold leading-5 text-data-up-ink">+{it.growth.toFixed(1)}%</span>
                    <span className="text-xs italic leading-4 text-ink-faint">{d.growthUnit}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-xl border border-muted bg-background p-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-semibold leading-6 tracking-[-0.6px] text-foreground">{it.share.toFixed(1)}%</p>
                  <span className={cn('flex shrink-0 items-center whitespace-nowrap rounded-2xl border bg-gradient-to-b px-[11px] py-[5px] text-xs font-semibold leading-4', verdictTone[it.verdict])}>{it.verdict}</span>
                </div>
                <p className="text-base leading-6 text-ink-soft">{it.text}</p>
              </div>
            </section>
          ))}
        </div>
        <p className="text-lg leading-6 text-muted-foreground">{d.footer}</p>
      </div>
    </ChartCard>
  )
}
