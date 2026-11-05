import type { ReactNode } from 'react'
import { Activity, History, Plus, Volume2, VolumeX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store'
import { setSound, useSound } from '@/lib/sound'
import { VOICE } from '@/lib/aura'
import { soundCopy } from '@/data/ui'
import { cn } from '@/lib/cn'

const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
const ink = 'text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-[15px] [&_svg]:shrink-0'

/** The name of an icon-only button, shown under it on hover (after a beat) or keyboard focus. `end`: hug the right edge. */
function Tip({ label, end = false, children }: { label: string; end?: boolean; children: ReactNode }) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span aria-hidden className={cn('pointer-events-none absolute top-full z-10 mt-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover/tip:opacity-100 group-hover/tip:delay-300 group-has-[:focus-visible]/tip:opacity-100', end ? 'right-0' : 'left-1/2 -translate-x-1/2')}>{label}</span>
    </span>
  )
}

/**
 * The chat's own chrome: white pills floating in the top-right corner, no bar. Chats and New chat share one
 * capsule, first; then sound and traces as icons (named on hover). No visible title:
 * the first question already names the chat (the title stays for screen readers).
 * No fade behind them: they sit outside the text column, so the thread stays readable right up to the top edge.
 */
export function ChatHeader({ title, chatId }: { title?: string; chatId?: string }) {
  const navigate = useNavigate()
  const { setChatsOpen, openTraces } = useStore()
  const sound = useSound()
  return (
    <div className="pointer-events-none sticky top-0 z-20 h-14 shrink-0">
      {title && <h1 className="sr-only">{title}</h1>}
      <div className="pointer-events-auto absolute right-4 top-3 flex items-center gap-2">
        {/* Chats and New chat share one capsule: past chats, or a fresh one. */}
        <div className="flex h-9 items-center rounded-full bg-surface shadow-hairline transition-shadow hover:shadow-float">
          <button onClick={() => setChatsOpen(true)} className={cn('inline-flex h-full items-center gap-1.5 rounded-l-full pl-3.5 text-sm font-medium [&_svg]:text-muted-foreground', title ? 'pr-3' : 'rounded-r-full pr-3.5', 'text-foreground transition-colors hover:[&_svg]:text-foreground [&_svg]:size-[15px] [&_svg]:shrink-0', ring)}>
            <History /> Chats
          </button>
          {title && (
            <>
              <span className="h-4 w-px bg-border" />
              <Tip label="New chat">
                <button onClick={() => navigate({ pathname: '/', search: location.search })} aria-label="New chat" className={cn('grid h-9 w-10 place-items-center rounded-r-full pr-0.5', ink, ring)}><Plus /></button>
              </Tip>
            </>
          )}
        </div>
        {VOICE && (
          <Tip label={sound ? soundCopy.on : soundCopy.off}>
            <button onClick={() => setSound(!sound)} aria-label={soundCopy.label} aria-pressed={sound} className={cn('grid size-9 place-items-center rounded-full bg-surface shadow-hairline hover:shadow-float', ink, ring)}>
              {sound ? <Volume2 className="text-foreground" /> : <VolumeX />}
            </button>
          </Tip>
        )}
        <Tip label="View traces" end>
          <button onClick={() => openTraces(chatId ?? null)} aria-label="View traces" className={cn('grid size-9 place-items-center rounded-full bg-surface shadow-hairline hover:shadow-float', ink, ring)}><Activity /></button>
        </Tip>
      </div>
    </div>
  )
}
