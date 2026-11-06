import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { BookmarkPlus, Check, ChevronDown, FileText, RefreshCw, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { Aura } from '@/components/brand/Aura'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { StepsList } from './StepsList'
import { Tip } from './ChatHeader'
import { briefs, type Brief, type BriefSection } from '@/data/briefs'
import type { Persona } from '@/data/personas'
import type { Prompt } from '@/data/prompts'
import { briefCopy } from '@/data/ui'
import { VERSION } from '@/lib/aura'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

/**
 * The content strategist's output (main design, 6 Nov). Brie's questions are answered with a document, not a reply in the
 * thread: like Claude's artifacts and ChatGPT's canvas, the chat steps into a column on the left and the document opens in its
 * own panel on the right. The split is resizable. The thread keeps Valerie's line and a card for the document, which reopens it.
 */
export const briefFor = (prompt: Prompt, persona: Persona): Brief | undefined =>
  VERSION === 'main' && persona.writes === 'brief' ? briefs[prompt.id] : undefined

/** The split: the chat's width while a document is open (dragged between its bounds, remembered per viewer), and the gap. */
export const SPLIT = { chat: 480, minChat: 360, minDoc: 520, gap: 8 }

/** In the thread: Aura and what Valerie did (opens the steps), Valerie's line, the document's card, then the quiet actions. */
export function BriefReply({ prompt, persona, brief, open, onOpen, stream = false }: {
  prompt: Prompt; persona: Persona; brief: Brief
  /** this document is the one showing beside the chat */
  open: boolean
  onOpen: () => void
  /** just finished live: the line and the card come in one after the other */
  stream?: boolean
}) {
  const [stepsOpen, setStepsOpen] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const { openTraces } = useStore()
  const toast = useToast()
  const after = (ms: number): CSSProperties | undefined => (stream ? { animationDelay: `${ms}ms` } : undefined)
  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-[720px] animate-rise">
        <div className="flex items-center gap-2.5">
          <Aura size={28} state="idle" continues={stream} />
          <button onClick={() => setStepsOpen((o) => !o)} className="-ml-1.5 flex h-8 min-w-0 items-center gap-1 rounded-lg px-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" aria-expanded={stepsOpen}>
            <span className="truncate">{prompt.summary} in {prompt.steps.length} steps</span>
            <ChevronDown className={cn('size-3.5 shrink-0 transition-transform', stepsOpen && 'rotate-180')} />
          </button>
        </div>
        {stepsOpen && (
          <div className="mt-4 animate-rise pl-[38px]">
            <StepsList steps={prompt.steps} showDetail={persona.toolDetail} />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{prompt.footnote}</p>
            <Button variant="ghost" className="-ml-3 mt-2" onClick={() => openTraces(prompt.id)}>Open full trace</Button>
          </div>
        )}

        <p className={cn('mt-3 text-base leading-6', stream && 'animate-rise')}>{brief.reply}</p>

        {/* The document, as a card: its icon, title and kind. Ringed while it shows beside the chat; a click brings it back. */}
        <button
          onClick={onOpen}
          aria-pressed={open}
          className={cn(
            'mt-4 flex w-full items-center gap-3 rounded-2xl bg-surface p-3 pr-4 text-left shadow-hairline transition-shadow hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
            open && 'ring-1 ring-brand-200',
            stream && 'animate-rise',
          )}
          style={after(160)}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><FileText className="size-[18px]" /></span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-sm font-semibold leading-5">{brief.title}</span>
            <span className="mt-0.5 block truncate text-xs leading-4 text-muted-foreground">{brief.kind}</span>
          </span>
        </button>

        <div className={cn('-ml-2 mt-3 flex items-center gap-0.5 [&_button]:size-7 [&_svg]:!size-[15px]', stream && 'animate-rise')} style={after(320)}>
          <Button variant="ghost" size="icon" aria-label="Good answer" className={cn(rating === 'up' && 'text-brand-600')} onClick={() => { setRating('up'); toast('Thanks for the feedback') }}><ThumbsUp /></Button>
          <Button variant="ghost" size="icon" aria-label="Bad answer" className={cn(rating === 'down' && 'text-brand-600')} onClick={() => { setRating('down'); toast('Thanks, we’ll look into it') }}><ThumbsDown /></Button>
          <Button variant="ghost" size="icon" aria-label="Regenerate" onClick={() => toast('Regenerate isn’t live in this prototype')}><RefreshCw /></Button>
        </div>
      </div>
    </section>
  )
}

/**
 * The handle between the chat and the document: drag it to resize, double-click to reset; focused, the arrow keys move it.
 * It sits in the gap, a short grey grip. Pointed at (or focused), the gap lights up: a navy line the panel's full height, the
 * grip navy and a little taller, so it reads as live; while dragging, both a shade darker.
 */
export function SplitHandle({ at, dragging = false, onResize, onDragging, onReset }: {
  /** the chat's width */
  at: number
  dragging?: boolean
  onResize: (chatWidth: number) => void
  onDragging: (dragging: boolean) => void
  onReset: () => void
}) {
  const start = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    const el = e.currentTarget
    const left = (el.parentElement as HTMLElement).getBoundingClientRect().left
    el.setPointerCapture(e.pointerId)
    onDragging(true)
    const move = (ev: PointerEvent) => onResize(ev.clientX - left - SPLIT.gap / 2)
    const end = () => {
      onDragging(false)
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', end); el.removeEventListener('pointercancel', end)
    }
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end)
  }
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={briefCopy.resize}
      aria-valuenow={Math.round(at)}
      tabIndex={0}
      onPointerDown={start}
      onDoubleClick={onReset}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); onResize(at - 32) }
        if (e.key === 'ArrowRight') { e.preventDefault(); onResize(at + 32) }
      }}
      className="group absolute inset-y-2 z-40 flex w-4 cursor-col-resize touch-none items-center justify-center focus-visible:outline-none"
      style={{ left: at + SPLIT.gap / 2 - 8 }}
    >
      <span aria-hidden className={cn('absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100', dragging ? 'bg-brand-600 opacity-100' : 'bg-brand-400')} />
      <span aria-hidden className={cn('relative w-1 rounded-full transition-[height,background-color] duration-150 group-hover:h-14 group-hover:bg-brand-500 group-focus-visible:h-14 group-focus-visible:bg-brand-500', dragging ? 'h-14 bg-brand-700' : 'h-10 bg-muted-foreground/25')} />
    </div>
  )
}

/**
 * The document beside the chat: a white panel inset from the canvas by the gap, its toolbar level with the chat's controls
 * (the title; Save as report and Close on the right), and the brief under it in one reading column.
 */
export function BriefPanel({ brief, left, saved, onSave, onClose }: {
  brief: Brief; left: number
  /** saved as a report; a click on the button switches it */
  saved: boolean
  onSave: () => void
  onClose: () => void
}) {
  return (
    <aside aria-label={brief.title} className="absolute inset-y-2 right-2 z-30 flex animate-panel flex-col overflow-hidden rounded-2xl bg-surface shadow-hairline" style={{ left }}>
      <header className="flex h-11 shrink-0 items-center gap-1 border-b border-border pl-4 pr-1.5">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <p className="ml-1.5 min-w-0 flex-1 truncate text-sm font-semibold">{brief.title}</p>
        <SaveButton saved={saved} onToggle={onSave} />
        <span aria-hidden className="mx-1.5 h-4 w-px bg-border" />
        <Tip label={briefCopy.close} end>
          <Button variant="ghost" size="icon" aria-label={briefCopy.close} onClick={onClose}><X /></Button>
        </Tip>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <BriefDocument brief={brief} />
      </div>
    </aside>
  )
}

/**
 * Save as report, a switch with two states (DS outline Button, xs): "Save as report" with its bookmark, and "Saved" with a
 * tick, in the label's own colour. Switching, the label slides up and out as the other slides in, the button eases to the new label's width, and
 * the tick draws itself in; switching back reverses it. Only a switch made here animates: a brief reopened already saved
 * simply shows "Saved".
 */
function SaveButton({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  const [moved, setMoved] = useState(false)
  const off = useRef<HTMLSpanElement>(null)
  const on = useRef<HTMLSpanElement>(null)
  const [w, setW] = useState<{ off: number; on: number } | null>(null)
  useLayoutEffect(() => { if (off.current && on.current) setW({ off: off.current.offsetWidth, on: on.current.offsetWidth }) }, [])
  const label = 'absolute left-0 top-0 whitespace-nowrap transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]'
  return (
    <Button variant="ds" aria-pressed={saved} onClick={() => { setMoved(true); onToggle() }} className="ml-2">
      <span className="grid size-4 shrink-0 place-items-center">
        {saved
          ? <Check key="on" className={cn(moved && 'animate-pop [&_path]:animate-draw [&_path]:[stroke-dasharray:24]')} strokeWidth={2.5} />
          : <BookmarkPlus key="off" className={cn(moved && 'animate-pop')} />}
      </span>
      <span className={cn('relative block h-6 overflow-hidden', moved && 'transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]')} style={w ? { width: saved ? w.on : w.off } : undefined}>
        <span ref={off} aria-hidden={saved} className={cn(label, saved ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100')}>{briefCopy.save}</span>
        <span ref={on} aria-hidden={!saved} className={cn(label, saved ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>{briefCopy.saved}</span>
      </span>
    </Button>
  )
}

/**
 * The brief as a report, in one reading column (680 at most, about 75 characters a line) so a section of any length flows:
 * - the masthead: its kind (small caps, navy) and the date on one line over a hairline, then the title (DS text-3xl);
 * - each section: its number (small, muted) over its heading (20/28 semibold), then the text (16/28), 48px between sections;
 * - the message is a pull quote on a navy rule; in a list, an item's closing parenthesis (its source) is muted so the claim
 *   reads first.
 * The words are the live product's, untouched.
 */
function BriefDocument({ brief }: { brief: Brief }) {
  return (
    <article className="mx-auto max-w-[760px] px-10 pb-28 pt-12">
      <header className="animate-rise">
        <div className="flex items-baseline justify-between gap-6 border-b border-border pb-3">
          <p className="text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-brand-600">{brief.kind}</p>
          <p className="shrink-0 text-xs leading-4 text-muted-foreground">{brief.date}</p>
        </div>
        <h1 className="mt-6 text-3xl font-semibold leading-9 tracking-[-0.025em] text-balance">{brief.title}</h1>
      </header>
      {brief.sections.map((s, i) => (
        <section key={s.title} className="mt-12 animate-rise" style={{ animationDelay: `${120 + i * 70}ms` }}>
          <p className="text-xs font-semibold leading-4 tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</p>
          <h2 className="mt-1.5 text-xl font-semibold leading-7 tracking-[-0.01em]">{s.title}</h2>
          <div className="mt-3"><SectionBody s={s} /></div>
        </section>
      ))}
    </article>
  )
}

function SectionBody({ s }: { s: BriefSection }) {
  if ('quote' in s) return (
    <blockquote className="border-l-2 border-brand-500 py-0.5 pl-5 text-xl font-medium leading-8 tracking-[-0.01em] text-pretty">{s.quote}</blockquote>
  )
  if ('items' in s) return (
    <ul className="flex flex-col gap-3 text-base leading-7">
      {s.items.map((item) => {
        const m = item.match(/^(.*) (\([^()]*\))$/s)
        return (
          <li key={item} className="relative pl-5 text-pretty before:absolute before:left-0.5 before:top-[11px] before:size-1.5 before:rounded-full before:bg-brand-300">
            {m ? <>{m[1]} <span className="text-muted-foreground">{m[2]}</span></> : item}
          </li>
        )
      })}
    </ul>
  )
  return <p className="text-base leading-7 text-pretty">{s.text}</p>
}
