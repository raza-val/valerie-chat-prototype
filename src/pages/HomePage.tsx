import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuraOrb } from '@/components/brand/AuraOrb'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { Composer } from '@/components/chat/Composer'
import { StarterIcon } from '@/components/chat/StarterIcon'
import { matchPrompt, prompts } from '@/data/prompts'
import { site } from '@/data/site'

export function HomePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const go = (id: string, q?: string) => {
    const sp = new URLSearchParams(params)
    if (q) sp.set('q', q)
    navigate(`/chat/${id}?${sp.toString()}`)
  }
  const ask = (text: string) => { const m = matchPrompt(text); go(m ? m.id : 'unknown', text) }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto">
      <ChatHeader />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[560px] -translate-x-1/2 rounded-full bg-brand-100 opacity-50 blur-[100px] dark:opacity-10" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-20">
        <div className="flex w-full max-w-[720px] flex-col items-center">
          <AuraOrb size={88} halo />
          <h1 className="mt-6 text-center text-3xl font-semibold tracking-[-0.02em]">{site.tagline}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {site.stats.map((s, i) => (
              <span key={s.label}>{i > 0 && <span className="mx-2">·</span>}<span className="font-semibold text-foreground">{s.value}</span> {s.label}</span>
            ))}
          </p>
          <Composer className="mt-8" placeholder={site.placeholder} onSubmit={ask} autoFocus />
          <div className="mt-8 grid w-full grid-cols-3 gap-3">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => go(p.id)}
                title={p.question}
                className="group flex h-[72px] items-center gap-3 rounded-xl border border-border bg-background px-3 text-left transition hover:border-brand-200 hover:bg-brand-50/50 hover:shadow-sm dark:hover:bg-muted"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300">
                  <StarterIcon name={p.icon} className="size-4" />
                </span>
                <span className="line-clamp-2 text-sm font-semibold leading-5">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
