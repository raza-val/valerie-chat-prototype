import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { Composer } from '@/components/chat/Composer'
import { UserBubble } from '@/components/chat/UserBubble'
import { AnswerView, WorkingView } from '@/components/chat/AnswerView'
import { AuraOrb } from '@/components/brand/AuraOrb'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { getPrompt, matchPrompt, prompts } from '@/data/prompts'
import { site } from '@/data/site'

/**
 * One conversation. The answer plays out like the live product:
 * working (steps tick through) → answer text → chart.
 * Share a frozen state with ?state=working or ?state=answer.
 */
export function ChatPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const prompt = getPrompt(id)
  const frozen = params.get('state')
  const [active, setActive] = useState(frozen === 'answer' ? -1 : 0)
  const [chartReady, setChartReady] = useState(frozen === 'answer')
  const timers = useRef<number[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (!prompt) return
    if (frozen === 'answer') { setActive(-1); setChartReady(true); return }
    setActive(0); setChartReady(false)
    if (frozen === 'working') { setActive(Math.min(2, prompt.steps.length - 1)); return }
    let t = 0
    prompt.steps.forEach((_, i) => { t += 700; timers.current.push(window.setTimeout(() => setActive(i + 1 >= prompt.steps.length ? -1 : i + 1), t)) })
    timers.current.push(window.setTimeout(() => setChartReady(true), t + 900))
    return () => timers.current.forEach(clearTimeout)
  }, [prompt, frozen])

  const shellParams = () => { const sp = new URLSearchParams(); if (params.get('shell')) sp.set('shell', params.get('shell')!); return sp }
  const ask = (text: string) => {
    if (/full report/i.test(text)) return toast('Full reports aren’t part of this prototype')
    if (/something else/i.test(text)) return navigate({ pathname: '/', search: shellParams().toString() })
    const m = matchPrompt(text)
    if (m && m.id !== id) { const sp = shellParams(); navigate(`/chat/${m.id}?${sp}`) }
    else toast('This prototype answers the six starter questions')
  }
  const stop = () => { timers.current.forEach(clearTimeout); setActive(-1); setChartReady(true) }

  const working = active !== -1
  const question = prompt?.question ?? params.get('q') ?? ''

  return (
    <div className="relative flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatHeader title={prompt?.chatTitle ?? 'New chat'} chatId={prompt?.id} />
        <div className="mx-auto flex max-w-[1008px] flex-col px-6 pb-48 pt-4">
          <div className="mx-auto w-full max-w-[720px]"><UserBubble text={question} /></div>
          <div className="mt-8">
            {!prompt ? (
              <Unknown onPick={(pid) => navigate(`/chat/${pid}?${shellParams()}`)} />
            ) : working ? (
              <WorkingView prompt={prompt} active={active} />
            ) : (
              <AnswerView prompt={prompt} chartReady={chartReady} onFollowUp={ask} />
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background from-70% to-transparent px-6 pb-4 pt-10">
        <div className="pointer-events-auto mx-auto max-w-[720px]">
          <Composer placeholder="Ask a follow-up…" onSubmit={ask} busy={!!prompt && working} onStop={stop} />
          <p className="mt-2 text-center text-xs text-muted-foreground">{site.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}

function Unknown({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-[720px] animate-rise">
      <div className="flex items-center gap-2"><AuraOrb size={28} /><span className="text-sm font-semibold">Valerie</span></div>
      <p className="mt-4 text-base leading-[26px]">This prototype has answers for six questions. Pick one to see how Valerie responds:</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {prompts.map((p) => <Button key={p.id} variant="chip" onClick={() => onPick(p.id)}>{p.title}</Button>)}
      </div>
    </div>
  )
}
