import { Fragment, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Compass, EyeOff, Gem, Globe, LayoutGrid, MessageSquare, Tag, Telescope, TrendingUp, Trophy } from 'lucide-react'
import { Aura, type AuraHandle } from '@/components/brand/Aura'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { Composer } from '@/components/chat/Composer'
import { matchPrompt, prompts, type Lens, type Prompt, type StarterIcon } from '@/data/prompts'
import { homeCopy, startersCopy, voiceCopy } from '@/data/ui'
import { site } from '@/data/site'
import { OfflineStrip } from '@/components/chat/OfflineStrip'
import { useOffline } from '@/lib/useOnline'
import { useStore } from '@/lib/store'
import { canPlay, play, useSound } from '@/lib/sound'
import { line, playClip, playSilent, saidBy, wordTimes } from '@/lib/voice'
import { cn } from '@/lib/cn'
import { CONSTELLATION, VOICE } from '@/lib/aura'

/** Starters read like an analyst's path: the category, then the competition, then the brand. */
const lensOrder: Lens[] = ['Industry', 'Competitive', 'Brand']
const starters = [...prompts].sort((a, b) => lensOrder.indexOf(a.lens) - lensOrder.indexOf(b.lens))
type Tab = 'All' | Lens
const tabs: { key: Tab; label: string; icon: typeof Globe }[] = [
  { key: 'All', label: startersCopy.all, icon: LayoutGrid },
  { key: 'Industry', label: 'Industry', icon: Globe },
  { key: 'Competitive', label: 'Competitive', icon: Trophy },
  { key: 'Brand', label: 'Brand', icon: Gem },
]

const icons: Record<StarterIcon, typeof Globe> = { tag: Tag, telescope: Telescope, eyeOff: EyeOff, compass: Compass, trendingUp: TrendingUp, messageSquare: MessageSquare }

/**
 * Where the suggested questions sit. `tabs` (/) is the original; the others are layouts leadership asked to compare,
 * all leading to the same chat:
 * - `side` (/v4): Aura beside the headline and the composer on the left, the questions stacked on the right. Pointing
 *   at a question previews it in the composer, and picking it types it in and sends.
 * - `below` (/v3): the same cards and behaviour as `side`, stacked under the composer at its width.
 * - `pairs` (/v1): the same cards under the composer, two to a row; an odd last card takes the whole row.
 */
export type HomeLayout = 'tabs' | 'side' | 'below' | 'pairs'

/** Aura greets once per visit, the first time Home shows with sound on. */
let greeted = false

/**
 * Home on the calm canvas: Aura and the headline, the composer as the one primary object,
 * and the starters in one quiet card under it: lens tabs (All first), then the questions as plain rows.
 * With sound on, Aura says the headline (it's Valerie's greeting) and each word inks as it's said; tap Aura to hear it again.
 * Without a voice, the tap plays the same greeting silently: the words ink and Aura moves on the recording's timing.
 */
export function HomePage({ layout = 'tabs' }: { layout?: HomeLayout }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { startFlight } = useStore()
  const hero = useRef<HTMLDivElement>(null)
  const [typing, setTyping] = useState(false)
  const go = (id: string, q?: string) => {
    if (hero.current) startFlight(hero.current.getBoundingClientRect())
    play('send')
    const sp = new URLSearchParams(params)
    if (q) sp.set('q', q)
    navigate(`/chat/${id}?${sp.toString()}`)
  }
  const ask = (text: string) => { const m = prompts.find((p) => p.question === text) ?? matchPrompt(text); go(m ? m.id : 'unknown', text) }
  // v4: the picked question types itself into the composer, then sends; pointing at one previews it there.
  const [seed, setSeed] = useState<{ text: string; n: number }>()
  const [picked, setPicked] = useState<string>()
  const [preview, setPreview] = useState<string>()
  const fill = (p: Prompt) => { setPicked(p.id); setPreview(undefined); setSeed({ text: p.question, n: Date.now() }) }
  const { offline, reconnect } = useOffline()
  const words = site.tagline.split(' ')
  const split = site.tagline.split(', ')[0].split(' ').length // the first clause is ink, the rest grey

  const aura = useRef<AuraHandle>(null)
  const [said, setSaid] = useState<number | null>(null) // words said so far, while Aura says the headline
  const hush = useRef<(() => void) | null>(null)
  const greet = () => {
    hush.current?.()
    setSaid(0)
    void line('tagline').then((clip) => {
      const at = wordTimes(site.tagline, clip)
      hush.current = (VOICE ? playClip : playSilent)(clip, (f) => { aura.current?.level(f.level); setSaid(saidBy(at, f.t)) }, () => { hush.current = null; setSaid(null) })
    })
  }
  const sound = useSound()
  useEffect(() => {
    if (!sound || greeted || !canPlay()) return
    greeted = true
    const t = window.setTimeout(greet, 600)
    return () => clearTimeout(t)
  }, [sound])
  useEffect(() => { void line('tagline'); return () => hush.current?.() }, []) // fetch the greeting early; it's small

  // v4 sets Aura beside the headline, both on the left, so the column starts level with the questions.
  const beside = layout === 'side'
  const intro = (
    <>
      <div className={cn('flex', beside ? 'w-full items-start gap-6' : 'flex-col items-center')}>
        {/* Beside the headline (v4, the Hologram), Aura rises 16px: the mark sits that far inside its box (it tilts ±2px), and the ink should start level with the text. */}
        <div ref={hero} className={cn('flex shrink-0 animate-rise', beside && '-mt-4')}>
          <Aura ref={aura} size={112} live state={typing ? 'listening' : said !== null ? 'speaking' : 'idle'} onTap={() => (said !== null ? hush.current?.() : greet())} label={said !== null ? voiceCopy.stop : VOICE ? voiceCopy.listen : voiceCopy.replay} />
        </div>
        <div className={cn('flex flex-col', beside ? 'items-start' : 'items-center')}>
          <h1 aria-label={site.tagline} className={cn('animate-rise text-[36px] font-semibold leading-[42px] tracking-[-0.03em] [animation-delay:60ms]', beside ? 'text-left' : 'mt-6 text-center')}>
            {words.map((w, i) => (
              <Fragment key={i}>
                {i === split && <br />}
                <span aria-hidden className={cn('transition-colors duration-150', said !== null && i >= said ? 'text-muted-foreground/45' : i < split ? 'text-foreground' : 'text-muted-foreground')}>{w}</span>
                {i < words.length - 1 && i !== split - 1 && ' '}
              </Fragment>
            ))}
          </h1>
        </div>
      </div>
      {/* Above the questions below it, so the composer's menus open over them. */}
      <div className="relative z-20 mt-10 w-full animate-rise [animation-delay:180ms]">
        <Composer tall pickPersona placeholder={preview ?? site.placeholder} onSubmit={ask} disabled={offline} onTyping={setTyping} seed={seed} className="relative z-10" />
        {offline && <OfflineStrip onRetry={reconnect} />}
      </div>
    </>
  )
  const hover = (p?: Prompt) => setPreview(p && !seed ? p.question : undefined)

  if (layout === 'side') return (
    <div data-canvas className="relative flex h-full flex-col overflow-y-auto bg-canvas">
      <ChatHeader />
      {/* Both columns start on one line: Aura and the headline level with the "Suggested questions" heading. The space under the composer is left open. */}
      <div className="flex flex-1 items-start justify-center gap-10 px-6 pb-16 pt-12">
        <div className="flex w-full max-w-[756px] flex-col items-start">{intro}</div>
        <SuggestionStack picked={picked} onPick={fill} onHover={hover} disabled={offline} />
      </div>
    </div>
  )

  return (
    <div data-canvas className="relative flex h-full flex-col overflow-y-auto bg-canvas">
      <ChatHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="flex w-full max-w-[756px] flex-col items-center">
          {intro}
          {layout === 'below' || layout === 'pairs'
            ? <SuggestionStack below pairs={layout === 'pairs'} picked={picked} onPick={fill} onHover={hover} disabled={offline} />
            : <Starters onPick={go} disabled={offline} />}
        </div>
      </div>
    </div>
  )
}

/** The question's icon in a quiet round chip (v4's suggestion cards). */
function IconChip({ p, className }: { p: Prompt; className?: string }) {
  const Icon = icons[p.icon]
  return <span className={cn('grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4', className)}><Icon /></span>
}

/** One suggested question beside the composer (v4): icon, title, and the question in full, in grey. */
function Suggestion({ p, picked, onPick, onHover, disabled }: { p: Prompt; picked?: string; onPick: (p: Prompt) => void; onHover: (p?: Prompt) => void; disabled: boolean }) {
  return (
    <button
      onClick={() => onPick(p)}
      onMouseEnter={() => onHover(p)}
      onMouseLeave={() => onHover()}
      onFocus={() => onHover(p)}
      onBlur={() => onHover()}
      disabled={disabled || !!picked}
      className={cn(
        'flex size-full items-start gap-3 rounded-xl p-3 text-left transition-[box-shadow,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none',
        'bg-surface shadow-hairline hover:shadow-float',
        picked === p.id && 'ring-2 ring-brand-300 dark:ring-brand-700',
        picked && picked !== p.id && 'opacity-50',
      )}
    >
      <IconChip p={p} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold leading-5 text-foreground">{p.title}</span>
        <span className="text-sm leading-5 text-muted-foreground">{p.question}</span>
      </span>
    </button>
  )
}

/**
 * The questions as white cards: stacked beside the composer, on the right (v4); under it at its full width (v3, `below`);
 * or under it two to a row (v1, `pairs`), the cards in a row the same height, an odd last one across the whole row.
 */
function SuggestionStack({ below, pairs, ...props }: { below?: boolean; pairs?: boolean; picked?: string; onPick: (p: Prompt) => void; onHover: (p?: Prompt) => void; disabled: boolean }) {
  return (
    <aside className={cn('shrink-0 animate-rise [animation-delay:240ms]', pairs ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2', below ? 'mt-8 w-full' : 'w-[360px]')} aria-label={homeCopy.suggestions}>
      <p className={cn('px-1 pb-1 text-sm font-semibold text-muted-foreground', pairs && 'col-span-2')}>{homeCopy.suggestions}</p>
      {starters.map((p, i) => (
        <div key={p.id} className={cn(pairs && i === starters.length - 1 && starters.length % 2 === 1 && 'col-span-2')}>
          <Suggestion p={p} {...props} />
        </div>
      ))}
    </aside>
  )
}

/**
 * The starters, straight on the canvas (no card fill): lens tabs with their icons, then the questions,
 * inside a hairline frame that fades out downward. White only marks what you touch: the selected tab, and a row under the pointer. Switching tabs never moves the page:
 * the space for "All" stays reserved, so a shorter list leaves canvas below the card, not a jump above it.
 */
function Starters({ onPick, disabled }: { onPick: (id: string) => void; disabled: boolean }) {
  const [tab, setTab] = useState<Tab>('All')
  const card = useRef<HTMLDivElement>(null)
  const [reserve, setReserve] = useState<number>()
  useLayoutEffect(() => { if (tab === 'All' && card.current) setReserve(card.current.offsetHeight) }, [tab])
  const shown = tab === 'All' ? starters : starters.filter((p) => p.lens === tab)
  const step = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const i = (tabs.findIndex((t) => t.key === tab) + d + tabs.length) % tabs.length
    setTab(tabs[i].key)
    ;(e.currentTarget.children[i] as HTMLElement).focus()
  }

  return (
    <div className="relative mt-4 w-full animate-rise [animation-delay:240ms]" style={{ minHeight: reserve }}>
      {/* A hairline frame, solid at the top and fading out down the sides: it holds the group without a fill. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl border border-border [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" />
      {/* 6px round the edge plus each item's 12px puts the tab icons and the questions on the composer's + line (18px in).
          The tabs' corners are the frame's less that 6px (16 − 6 = 10), so the gap is even all round the selected one. */}
      <div ref={card} className="relative p-1.5">
        <div role="tablist" aria-label={startersCopy.tabs} onKeyDown={step} className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-[10px] px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-4 [&_svg]:shrink-0',
                tab === t.key ? 'bg-surface text-foreground shadow-hairline' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <t.icon /> {t.label}
            </button>
          ))}
        </div>
        {/* v2's rows carry whole questions, so they breathe more: 44px rows, 4px apart. */}
        <div key={tab} role="tabpanel" className={cn('flex flex-col', CONSTELLATION ? 'mt-2 gap-1' : 'mt-1.5')}>
          {shown.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              disabled={disabled}
              title={CONSTELLATION ? undefined : p.question}
              style={{ animationDelay: `${i * 30}ms` }}
              className={cn('group flex animate-rise items-center gap-3 rounded-lg px-3 text-left text-sm leading-5 transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-60', CONSTELLATION ? 'py-3' : 'py-2')}
            >
              {/* v2 shows the question itself: the rows run the composer's full width, so there's room for it. */}
              <span className="min-w-0 flex-1">{CONSTELLATION ? p.question : p.title}</span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
