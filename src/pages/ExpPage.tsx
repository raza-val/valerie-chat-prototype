import { useEffect, useState, type ComponentType } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Moon, Sun, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Glass } from '@/components/exp/Glass'
import { Plasma } from '@/components/exp/Plasma'
import { Hologram } from '@/components/exp/Hologram'
import { Orb } from '@/components/exp/Orb'
import { Halo } from '@/components/exp/Halo'
import type { ExpProps, ExpState } from '@/components/exp/motion'

/**
 * /exp: experiments for Aura after leadership passed on the chrome hexagon and the cloud (28 Oct).
 * No face, nothing human: three take the Valerie mark into new materials, two are new forms.
 * Each shows idle, thinking and speaking, at stage size and at Home (64) and thread (28) sizes.
 * A design tool, like /lab: not linked from the product. ?e=<id> opens one full screen; ?state= sets the state.
 */
export type Exp = { id: string; name: string; note: string; C: ComponentType<ExpProps> }
export type ExpGroup = { name: string; items: Exp[] }

const groups: ExpGroup[] = [
  {
    name: 'From the logo',
    items: [
      { id: 'glass', name: 'Glass', note: 'Cut glass with light moving through it. Thinking: the halves part.', C: Glass },
      { id: 'plasma', name: 'Plasma', note: 'Energy pooled inside the mark. Thinking: the current runs hot.', C: Plasma },
      { id: 'hologram', name: 'Hologram', note: 'The mark in depth, a scan reading down it. Thinking: the parts spin against each other. Speaking: echoes run out.', C: Hologram },
    ],
  },
  {
    name: 'New forms',
    items: [
      { id: 'orb', name: 'Orb', note: 'A glass sphere with light-smoke inside. Thinking: the smoke churns.', C: Orb },
      { id: 'halo', name: 'Halo', note: 'Rings of light on one circle. Thinking: a comet chases round.', C: Halo },
    ],
  },
]
const states: ExpState[] = ['idle', 'thinking', 'speaking']
const label: Record<ExpState, string> = { idle: 'Idle', thinking: 'Thinking', speaking: 'Speaking' }
const CYCLE_MS = 4000

export function ExpPage() {
  return <ExpBoard title="Experiments" groups={groups} link={{ href: '/exp/bot', label: 'Bot experiments' }} />
}

/** The board both experiment pages share: the state controls, a card per experiment, and ?e=<id> full screen. */
export function ExpBoard({ title, groups, link }: { title: string; groups: ExpGroup[]; link?: { href: string; label: string } }) {
  const all = groups.flatMap((g) => g.items)
  const [params, setParams] = useSearchParams()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const fixed = states.find((s) => s === params.get('state'))
  const [state, setState] = useState<ExpState>(fixed ?? 'idle')
  const [cycle, setCycle] = useState(!fixed)
  useEffect(() => {
    if (!cycle) return
    const id = setInterval(() => setState((s) => states[(states.indexOf(s) + 1) % states.length]), CYCLE_MS)
    return () => clearInterval(id)
  }, [cycle])
  const focus = all.find((e) => e.id === params.get('e'))
  const open = (id: string | null) => setParams((p) => { id ? p.set('e', id) : p.delete('e'); return p })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open(null)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const controls = (
    <div className="flex items-center gap-2">
      <div className="flex rounded-full bg-surface p-1 shadow-hairline">
        {states.map((s) => (
          <button key={s} onClick={() => { setState(s); setCycle(false) }} className={cn('h-8 rounded-full px-3.5 text-sm font-medium transition-colors', state === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
            {label[s]}
          </button>
        ))}
      </div>
      <button onClick={() => setCycle((c) => !c)} aria-pressed={cycle} className={cn('h-10 rounded-full px-4 text-sm font-medium shadow-hairline transition-colors', cycle ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200' : 'bg-surface text-muted-foreground hover:text-foreground')}>
        Cycle
      </button>
      <button onClick={() => setDark((d) => !d)} className="grid size-10 place-items-center rounded-full bg-surface text-muted-foreground shadow-hairline hover:text-foreground" aria-label="Toggle theme">
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </div>
  )

  if (focus) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-foreground">
        <header className="flex items-center justify-between px-8 pt-6">
          <h1 className="text-xl font-semibold">{focus.name}</h1>
          <div className="flex items-center gap-2">
            {controls}
            <button onClick={() => open(null)} className="grid size-10 place-items-center rounded-full bg-surface text-muted-foreground shadow-hairline hover:text-foreground" aria-label="Close"><X className="size-4" /></button>
          </div>
        </header>
        <div className="grid flex-1 place-items-center"><focus.C state={state} size={360} /></div>
        <footer className="flex items-center justify-center gap-6 pb-10"><focus.C state={state} size={64} /><focus.C state={state} size={28} /></footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas px-8 pb-12 pt-6 text-foreground">
      <header className="mx-auto flex max-w-[1376px] items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          {link && <a href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">{link.label} →</a>}
        </div>
        {controls}
      </header>
      {groups.map((g) => (
        <section key={g.name} className="mx-auto mt-8 max-w-[1376px]">
          <h2 className="text-sm font-semibold text-muted-foreground">{g.name}</h2>
          <div className={cn('mt-3 grid gap-4', g.items.length === 2 || g.items.length === 4 ? 'grid-cols-2' : 'grid-cols-3')}>
            {g.items.map((e) => <Card key={e.id} exp={e} state={state} onOpen={() => open(e.id)} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

function Card({ exp: { name, note, C }, state, onOpen }: { exp: Exp; state: ExpState; onOpen: () => void }) {
  return (
    <article className="flex flex-col rounded-3xl bg-surface shadow-hairline">
      <button onClick={onOpen} className="grid h-56 place-items-center rounded-t-3xl" aria-label={`Open ${name}`}>
        <C state={state} size={168} />
      </button>
      <footer className="flex items-center gap-4 px-6 pb-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>
        </div>
        <C state={state} size={64} />
        <C state={state} size={28} />
      </footer>
    </article>
  )
}
