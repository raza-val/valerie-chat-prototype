import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { Composer } from '@/components/chat/Composer'
import { UserBubble } from '@/components/chat/UserBubble'
import { Turn, type TurnHandle, type TurnMode } from '@/components/chat/Turn'
import { ModelDivider, PersonaDivider } from '@/components/chat/PersonaDivider'
import { Aura } from '@/components/brand/Aura'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { getPrompt, matchPrompt, prompts, type Prompt } from '@/data/prompts'
import { personas, type Persona } from '@/data/personas'
import { disclaimerCopy, threadCopy, unknownCopy, type Model } from '@/data/ui'
import { useStore } from '@/lib/store'
import { useOffline } from '@/lib/useOnline'
import { OfflineStrip } from '@/components/chat/OfflineStrip'
import { ModelPicker } from '@/components/chat/ModelPicker'
import { play } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { VERSION } from '@/lib/aura'

/**
 * One conversation: a thread of turns (question → answer). The first turn is the chat id;
 * follow-ups that match one of the five answers are added to the same thread.
 * Share a frozen state with ?state=working or ?state=answer (applies to the latest turn).
 * Error states: ?state=error (stops at step 3, Retry), ?state=chart-error (text kept, chart failed),
 * and &offline=1 (offline strip above the composer; also shown when the browser goes offline).
 * Preload a long thread with &turns=whitespace,hear-the-buyers (earlier turns are settled).
 * Start tuned for a persona with &persona=brie. Switching persona or model adds a divider to the thread.
 */
export function ChatPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const seed = [id, params.get('turns'), params.get('state'), params.get('persona')].join('|')
  return <ChatThread key={seed} />
}

type TurnState = { key: number; prompt: Prompt; persona: Persona; model: Model; mode: TurnMode }
const modes: TurnMode[] = ['answer', 'working', 'error', 'chart-error']

function ChatThread() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { offline, reconnect } = useOffline()
  const { persona, setPersona, model } = useStore()
  const prompt = getPrompt(id)
  const urlPersona = personas.find((x) => x.id === params.get('persona'))
  useEffect(() => { if (urlPersona) setPersona(urlPersona) }, [urlPersona, setPersona])

  const [turns, setTurns] = useState<TurnState[]>(() => {
    if (!prompt) return []
    const list = [prompt, ...(params.get('turns')?.split(',').map(getPrompt) ?? [])].filter((p): p is Prompt => !!p)
    const frozen = modes.find((m) => m === params.get('state')) ?? 'live'
    return list.map((p, i) => ({ key: i, prompt: p, persona: urlPersona ?? persona, model, mode: i === list.length - 1 ? frozen : 'answer' }))
  })
  const latest = turns[turns.length - 1]
  const [working, setWorking] = useState(false)
  const latestRef = useRef<TurnHandle>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [showJump, setShowJump] = useState(false)
  const [seatHidden, setSeatHidden] = useState(false)

  // "Jump to latest" shows while the latest turn starts below what the reader can see.
  const checkJump = useCallback(() => {
    const box = scroller.current
    const el = latest && document.getElementById(`turn-${latest.key}`)
    // Dock: the latest turn's Aura is above the pills or behind the composer
    const seat = el?.querySelector('[data-aura-seat]')
    if (box && seat) {
      const r = seat.getBoundingClientRect(), b = box.getBoundingClientRect()
      setSeatHidden(r.bottom < b.top + 56 || r.top > b.bottom - 150)
    } else setSeatHidden(false)
    if (!box || !el || turns.length < 2) return setShowJump(false)
    setShowJump(el.getBoundingClientRect().top > box.getBoundingClientRect().bottom - 220)
  }, [latest, turns.length])
  useEffect(() => {
    checkJump()
    window.addEventListener('resize', checkJump)
    return () => window.removeEventListener('resize', checkJump)
  }, [checkJump])
  const jumpToLatest = () => latest && document.getElementById(`turn-${latest.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // A new turn scrolls its question to the top. The first render keeps the page at the top.
  const count = useRef(turns.length)
  useEffect(() => {
    if (turns.length > count.current) jumpToLatest()
    count.current = turns.length
  }, [turns.length])

  const shellParams = () => { const sp = new URLSearchParams(); if (params.get('shell')) sp.set('shell', params.get('shell')!); return sp }
  const ask = (text: string) => {
    if (/full report/i.test(text)) return toast('Full reports aren’t part of this prototype')
    if (/something else/i.test(text)) return navigate({ pathname: '/', search: shellParams().toString() })
    const m = matchPrompt(text)
    if (!m || m.id === latest?.prompt.id) return toast('This prototype answers the five starter questions')
    if (!prompt) return navigate(`/chat/${m.id}?${shellParams()}`)
    play('send')
    setTurns((ts) => [...ts, { key: ts.length, prompt: m, persona, model, mode: 'live' }])
  }

  return (
    <div data-canvas className="relative flex h-full flex-col bg-canvas">
      <div ref={scroller} onScroll={checkJump} className="min-h-0 flex-1 overflow-y-auto">
        <ChatHeader title={prompt?.chatTitle ?? 'New chat'} chatId={prompt?.id} />
        <div className={cn('mx-auto flex max-w-[768px] flex-col px-6 pt-4', VERSION === 'main' ? 'pb-40' : 'pb-36')}>
          {!prompt ? (
            <>
              <div className="mx-auto w-full max-w-[720px]"><UserBubble text={params.get('q') ?? ''} /></div>
              <div className="mt-8"><Unknown onPick={(pid) => navigate(`/chat/${pid}?${shellParams()}`)} /></div>
            </>
          ) : (
            turns.map((t, i) => (
              <Fragment key={t.key}>
                {i > 0 && <Dividers persona={t.persona.id !== turns[i - 1].persona.id ? t.persona : undefined} model={t.model.id !== turns[i - 1].model.id ? t.model : undefined} />}
                <div id={`turn-${t.key}`} className="scroll-mt-20">
                  <Turn
                    ref={t === latest ? latestRef : undefined}
                    prompt={t.prompt}
                    persona={t.persona}
                    mode={t.mode}
                    onWorking={t === latest ? (w) => { setWorking(w); checkJump() } : undefined}
                    onFollowUp={t === latest ? ask : undefined}
                  />
                </div>
              </Fragment>
            ))
          )}
          {latest && !working && (persona.id !== latest.persona.id || model.id !== latest.model.id) && (
            <div className="mt-12"><Dividers pending persona={persona.id !== latest.persona.id ? persona : undefined} model={model.id !== latest.model.id ? model : undefined} /></div>
          )}
        </div>
      </div>
      <div className={cn('pointer-events-none absolute inset-x-0 bottom-0 px-6', VERSION === 'main' ? 'pb-3' : 'pb-6')}>
        <div className="pointer-events-auto relative mx-auto max-w-[756px]">
          {showJump && (
            <button
              onClick={jumpToLatest}
              className="absolute bottom-full left-1/2 mb-3 flex h-9 -translate-x-1/2 animate-pop items-center gap-1.5 rounded-full bg-surface pl-3 pr-3.5 text-sm font-semibold shadow-float"
            >
              <ArrowDown className="size-4 text-muted-foreground" /> {threadCopy.jump}
            </button>
          )}
          {/* No fade above the composer: the thread stays readable right up to it and slips behind it.
              Only the stack from the middle of its first piece down is solid, so nothing shows beneath or between. */}
          <div className="relative before:absolute before:inset-x-0 before:top-7 before:-bottom-6 before:bg-canvas [&>*]:relative">
            <Composer placeholder="Ask a follow-up…" onSubmit={ask} busy={!!prompt && working} onStop={() => latestRef.current?.stop()} disabled={offline} docked={working && seatHidden} pickModel={VERSION !== 'main'} className="z-10" />
            {offline && <OfflineStrip onRetry={reconnect} />}
            {/* Main design (6 Nov): the model sits under the box, right-aligned, as Claude does, so it never takes width from the text. */}
            {/* The disclaimer on the left balances it; both sit on the 720 text column's edges (DS text-xs, muted). */}
            {VERSION === 'main' && (
              <div className="mt-1.5 flex items-center justify-between pl-[18px] pr-2.5">
                <p className="text-xs leading-4 text-muted-foreground">{disclaimerCopy.text}</p>
                <ModelPicker compact />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Between turns: plain space, or a divider for each thing that changed (persona, model). `pending`: under the latest turn, before the next question. */
function Dividers({ persona, model, pending }: { persona?: Persona; model?: Model; pending?: boolean }) {
  if (!persona && !model) return <div className="h-16" />
  return (
    <div className={cn('mx-auto flex w-full max-w-[720px] flex-col gap-4', !pending && 'my-12')}>
      {persona && <PersonaDivider persona={persona} />}
      {model && <ModelDivider model={model} />}
    </div>
  )
}

function Unknown({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-[720px] animate-rise">
      <Aura size={28} seat />
      <p className="mt-4 text-base leading-[26px]">{unknownCopy.lead}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {prompts.map((p) => <Button key={p.id} variant={VERSION === 'main' ? 'ds' : 'chip'} onClick={() => onPick(p.id)}>{p.title}</Button>)}
      </div>
    </div>
  )
}
