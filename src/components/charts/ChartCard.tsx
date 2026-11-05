import { createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * A chart in an answer, drawn as the Figma answer designs' "Market Briefing Card" (AI-chat-screen 119:41560): a slate/50
 * card (24px corners, 24px padding, its own shadow) holding the title, an optional subtitle and a white slot (16px corners,
 * 16px padding) with the chart. No eyebrow and no card actions (Deep, pin, explain, About this card): in a chat answer
 * they are noise.
 */
export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const skeleton = useContext(Skeleton)
  const words = (text: string) => (skeleton ? <span className="skeleton-text">{text}</span> : text)
  return (
    <article aria-hidden={skeleton || undefined} className={cn('flex flex-col gap-6 rounded-[24px] bg-chart-card p-6 shadow-chart-card', skeleton && 'select-none')}>
      <header className="flex flex-col gap-2">
        <h3 className="text-xl font-bold leading-6 tracking-[-0.6px] text-foreground">{words(title)}</h3>
        {subtitle && <p className="text-base leading-6 text-ink-soft">{words(subtitle)}</p>}
      </header>
      <div className="min-h-[100px] rounded-2xl bg-background p-4">
        {skeleton ? <div className="relative"><div className="invisible">{children}</div><div className="skeleton absolute inset-0 rounded-xl opacity-50" /></div> : children}
      </div>
    </article>
  )
}

const Skeleton = createContext(false)

/**
 * A card's skeleton while its chart is on the way: the real card laid out unseen, its title and subtitle as shimmer
 * lines as long as their own lines, its chart as one block the chart's size. So the chart lands without a jump.
 */
export function ChartSkeleton({ children }: { children: ReactNode }) {
  return <Skeleton.Provider value>{children}</Skeleton.Provider>
}
