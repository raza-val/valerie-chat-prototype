import { useEffect, useRef, useState } from 'react'
import { Moon, Play, Square, Sun } from 'lucide-react'
import { Mascot, type Concept, type Expression, type MascotHandle } from '@/components/brand/Mascot'
import { loadClip, playClip, voice as productVoice } from '@/lib/voice'
import { cn } from '@/lib/cn'

/**
 * /lab?view=character: choose Valerie's mascot and voice by eye and ear (a design tool, not linked from the product).
 * The chosen hexagon (now Aura in the product) beside the four options kept for leadership, each at hero size and at
 * answer-header size. They blink, look at the pointer, take an expression, and react to a recorded voice while its
 * words turn to ink below.
 */
const concepts: { id: Concept; name: string; idea: string }[] = [
  { id: 'hex-liquid', name: 'Hexagon · Liquid chrome', idea: 'The polished hexagon’s outline cast in liquid metal, the chrome Aura started with. Bands flow faster as it thinks.' },
  { id: 'cloud-liquid', name: 'Cloud · Liquid chrome', idea: 'A full cloud in the same liquid chrome.' },
  { id: 'constellation', name: 'Constellation', idea: 'The Valerie sparkle drawn in data points, abstract, no face. Waiting, it spreads into the night sky and traces one constellation after another.' },
  { id: 'hex-chrome', name: 'Hexagon · Polished chrome', idea: 'Inflated into a chrome pebble that reflects a slowly turning studio. Wobbles as it thinks.' },
  { id: 'cloud-soft', name: 'Cloud · Soft', idea: 'A soft 3D cumulus with cool shadows in its creases. Billows as it thinks.' },
]
const IN_PRODUCT = 'In product'
/** The two mascots built into the prototype, for leadership to compare: Version A at /, Version B at /v2/. */
const VERSIONS: Partial<Record<string, string>> = { 'hex-liquid': 'Version A', constellation: 'Version B' }
const voices = [
  { id: 'nicky', name: 'Nicky', accent: 'US' },
  { id: 'aaron', name: 'Aaron', accent: 'US' },
  { id: 'martha', name: 'Martha', accent: 'UK' },
  { id: 'arthur', name: 'Arthur', accent: 'UK' },
  { id: 'catherine', name: 'Catherine', accent: 'Australia' },
  { id: 'samantha', name: 'Samantha', accent: 'US, classic' },
]
const lines = [{ id: 'tagline', name: 'Tagline' }, { id: 'lead-hear-the-buyers', name: 'Headline' }]
const expressions: Expression[] = ['neutral', 'listening', 'thinking', 'happy', 'concerned', 'wink']

export function CharacterLab() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const [expression, setExpression] = useState<Expression>('neutral')
  const [playing, setPlaying] = useState<string | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [said, setSaid] = useState(-1)
  const handles = useRef<(MascotHandle | null)[]>([])
  const stop = useRef<(() => void) | null>(null)
  useEffect(() => () => stop.current?.(), [])

  const play = async (voice: string, line: string) => {
    stop.current?.()
    const key = `${voice}-${line}`
    const clip = await loadClip(`/voice/${voice}/${line}`)
    setWords(clip.words.map((w) => w.w))
    setSaid(-1)
    setPlaying(key)
    setExpression('neutral')
    stop.current = playClip(clip, (f) => { setSaid(f.word); handles.current.forEach((h) => h?.level(f.level)) }, () => {
      setPlaying(null)
      stop.current = null
      handles.current.forEach((h) => h?.level(0))
    })
  }

  const talking = playing !== null

  return (
    <div className="min-h-full bg-canvas px-10 py-8 text-foreground">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Mascot</h1>
          <span className="text-sm text-muted-foreground">Five options. Move the pointer, try an expression, play a voice.</span>
          <span className="flex-1" />
          <button onClick={() => setDark((d) => !d)} className="grid size-9 place-items-center rounded-full bg-surface shadow-hairline" aria-label="Theme">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-3">
          {concepts.map((c, i) => (
            <div key={c.id} className="flex flex-col rounded-2xl bg-surface p-5 shadow-hairline">
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="mt-1 min-h-[40px] text-xs leading-5 text-muted-foreground">{c.idea}</p>
              <div className="my-7 grid place-items-center">
                <Mascot ref={(h) => { handles.current[i] = h }} concept={c.id} expression={expression} talking={talking} size={128} />
              </div>
              <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-sm">
                <Mascot ref={(h) => { handles.current[i + concepts.length] = h }} concept={c.id} expression={expression} talking={talking} size={28} />
                <span className="font-semibold">Valerie</span><span className="text-muted-foreground">· 8.9s</span>
                {VERSIONS[c.id] && <span className="ml-auto whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{VERSIONS[c.id]}</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 min-h-[64px] max-w-[720px] text-center text-[22px] font-semibold leading-8 tracking-[-0.02em] text-pretty">
          {words.map((w, j) => <span key={j} className={cn('transition-colors duration-150', j <= said ? 'text-foreground' : 'text-muted-foreground/45')}>{w} </span>)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-sm text-muted-foreground">Expression</span>
          {expressions.map((e) => (
            <button key={e} onClick={() => setExpression(e)} className={cn('h-8 rounded-full px-3 text-sm capitalize', expression === e && !talking ? 'bg-surface font-medium shadow-hairline' : 'text-muted-foreground hover:text-foreground')}>{e}</button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-x-2 rounded-2xl bg-surface p-2 shadow-hairline">
          {voices.map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <span className="w-20 text-sm font-medium">{v.name}</span>
              <span className="flex-1 text-sm text-muted-foreground">{v.accent}{v.id === productVoice && ` · ${IN_PRODUCT}`}</span>
              {lines.map((l) => {
                const on = playing === `${v.id}-${l.id}`
                return (
                  <button key={l.id} onClick={() => (on ? stop.current?.() : play(v.id, l.id))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm [&_svg]:size-3.5', on ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70')}>
                    {on ? <Square /> : <Play />} {l.name}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
