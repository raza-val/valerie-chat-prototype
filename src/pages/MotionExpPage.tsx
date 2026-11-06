import { useEffect, useState, type ComponentType } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Moon, Sun, X } from 'lucide-react'
import type { ExpProps } from '@/components/exp/motion'
import { Assemble, Breathe, Flip, Follow, Glint, Orbit, Ripple, Shiver, SplitSnap, Unfold } from '@/components/exp/emblem/EmblemMotions'

/**
 * /exp/motion (6 Nov): ten motions for the main design's emblem (the Hologram), grouped by the moment each is for,
 * so the user can pick one per scenario. Each card shows it at stage size and at Home (64) and thread (28) sizes.
 * A design tool, like /exp: not linked from the product. ?e=<id> opens one full screen.
 */
type Motion = { id: string; name: string; note: string; C: ComponentType<ExpProps> }
const groups: { name: string; items: Motion[] }[] = [
  {
    name: 'At rest',
    items: [
      { id: 'breathe', name: 'Breathe', note: 'The slices draw apart and close again, slowly. Nothing turns.', C: Breathe },
      { id: 'glint', name: 'Glint', note: 'Now and then a light catches the face, and the mark leans into it. Also for hover.', C: Glint },
      { id: 'follow', name: 'Follow', note: 'Turns a little toward the pointer; the slices open as it comes near. Move the pointer.', C: Follow },
    ],
  },
  {
    name: 'Listening, while the user types',
    items: [{ id: 'ripple', name: 'Ripple', note: 'A quick, small wave runs back through the slices, like sound going in.', C: Ripple }],
  },
  {
    name: 'Working',
    items: [
      { id: 'orbit', name: 'Orbit', note: 'Leans round in a slow circle like a gyroscope settling. It never spins.', C: Orbit },
      { id: 'split', name: 'Split & snap', note: 'The parts draw apart and snap back together, a beat per step.', C: SplitSnap },
      { id: 'assemble', name: 'Assemble', note: 'Slices arrive from the back and build the mark, then leave from the front. For a longer wait.', C: Assemble },
    ],
  },
  {
    name: 'Arrival',
    items: [{ id: 'unfold', name: 'Unfold', note: 'Turns in from edge-on and fans out its slices, settling with a little give. The first time Home opens.', C: Unfold }],
  },
  {
    name: 'Done',
    items: [{ id: 'flip', name: 'Flip', note: 'One clean turn, the slices fanning mid-turn, landing face-on. When the answer is ready.', C: Flip }],
  },
  {
    name: 'Error',
    items: [{ id: 'shiver', name: 'Shiver', note: 'A short shake runs through the slices out of step; the mark dips, then recovers.', C: Shiver }],
  },
]

export function MotionExpPage() {
  const all = groups.flatMap((g) => g.items)
  const [params, setParams] = useSearchParams()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const focus = all.find((m) => m.id === params.get('e'))
  const open = (id: string | null) => setParams((p) => { id ? p.set('e', id) : p.delete('e'); return p })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open(null)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])
  const theme = (
    <button onClick={() => setDark((d) => !d)} className="grid size-10 place-items-center rounded-full bg-surface text-muted-foreground shadow-hairline hover:text-foreground" aria-label="Toggle theme">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )

  if (focus) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-foreground">
        <header className="flex items-center justify-between px-8 pt-6">
          <h1 className="text-xl font-semibold">{focus.name}</h1>
          <div className="flex items-center gap-2">
            {theme}
            <button onClick={() => open(null)} className="grid size-10 place-items-center rounded-full bg-surface text-muted-foreground shadow-hairline hover:text-foreground" aria-label="Close"><X className="size-4" /></button>
          </div>
        </header>
        <div className="grid flex-1 place-items-center"><focus.C state="idle" size={360} /></div>
        <footer className="flex items-center justify-center gap-6 pb-10"><focus.C state="idle" size={64} /><focus.C state="idle" size={28} /></footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas px-8 pb-12 pt-6 text-foreground">
      <header className="mx-auto flex max-w-[1376px] items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl font-semibold">Emblem motion</h1>
          <a href="/exp" className="text-sm font-medium text-muted-foreground hover:text-foreground">All experiments →</a>
        </div>
        {theme}
      </header>
      {/* One grid in scenario order; each card names its scenario, so single-motion scenarios don't leave empty rows. */}
      <div className="mx-auto mt-6 grid max-w-[1376px] grid-cols-3 gap-4">
        {groups.flatMap((g) => g.items.map((m) => ({ ...m, scenario: g.name }))).map((m) => (
              <article key={m.id} className="flex flex-col rounded-3xl bg-surface shadow-hairline">
                <button onClick={() => open(m.id)} className="grid h-56 place-items-center rounded-t-3xl" aria-label={`Open ${m.name}`}>
                  <m.C state="idle" size={168} />
                </button>
                <footer className="flex items-center gap-4 px-6 pb-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-4 text-muted-foreground">{m.scenario}</p>
                    <h3 className="mt-1 text-base font-semibold">{m.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{m.note}</p>
                  </div>
                  <m.C state="idle" size={64} />
                  <m.C state="idle" size={28} />
                </footer>
              </article>
        ))}
      </div>
    </div>
  )
}
