import { lazy, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MeshGradient } from '@paper-design/shaders-react'
import { Check, Copy, Moon, Sun } from 'lucide-react'
import { CHROME_TINT, auraPresets, calm, calmDark, chromePresets, frameOf, useCssVar, type AuraState, type MetalPreset } from '@/lib/aura'
import { cn } from '@/lib/cn'
import { CharacterLab } from './CharacterLab'

const AuraMetal = lazy(() => import('@/components/brand/AuraMetal'))

/**
 * /lab: tune Aura by eye (a tool for the design team, not linked from the product).
 * Looks side by side, live sliders for the selected one, Copy preset → paste into src/lib/aura.ts.
 * Capture mode renders the stills: /lab?capture=light|dark&size=288 (transparent page, at AURA_FRAME); &shape=hex or cloud for the chrome shapes.
 */
type Look = 'navy' | 'chrome' | 'frosted'
type Frost = { speed: number; distortion: number; swirl: number; blur: number }

const metalRanges: [keyof MetalPreset, number, number, number][] = [
  ['speed', 0, 2, 0.05], ['repetition', 0.5, 6, 0.1], ['softness', 0, 1, 0.01], ['distortion', 0, 0.5, 0.01], ['contour', 0, 1, 0.01],
  ['angle', 0, 180, 1], ['shiftRed', -1, 1, 0.01], ['shiftBlue', -1, 1, 0.01], ['scale', 0.5, 1.2, 0.01],
]
const frostRanges: [keyof Frost, number, number, number][] = [['speed', 0, 2, 0.05], ['distortion', 0, 1, 0.01], ['swirl', 0, 1, 0.01], ['blur', 0, 16, 0.5]]
const looks: { id: Look; name: string }[] = [{ id: 'navy', name: 'A2 · Navy metal (calm)' }, { id: 'chrome', name: 'A · Chrome metal' }, { id: 'frosted', name: 'E · Frosted orb' }]
const states: AuraState[] = ['idle', 'listening', 'thinking', 'speaking', 'error']

export function LabPage() {
  const [params] = useSearchParams()
  const capture = params.get('capture')
  const chrome = params.get('shape') === 'hex' ? 'hex' : params.get('shape') === 'cloud' ? 'cloud' : null
  if (capture) return <Capture dark={capture === 'dark'} chrome={chrome} frame={Number(params.get('frame') ?? frameOf(chrome ?? 'mark'))} size={Number(params.get('size') ?? 288)} />
  if (params.get('view') === 'character') return <CharacterLab />
  return <Lab />
}

function Capture({ dark, chrome, frame, size }: { dark: boolean; chrome: 'hex' | 'cloud' | null; frame: number; size: number }) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.background = document.body.style.background = 'transparent'
  }, [dark])
  return (
    <div id="capture" className="relative" style={{ width: size, height: size }}>
      <Suspense fallback={null}>{chrome ? <AuraMetal shape={chrome} preset={chromePresets.idle} tintVar={CHROME_TINT} frame={frame} preserve /> : <AuraMetal frame={frame} preserve />}</Suspense>
    </div>
  )
}

function Lab() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const [look, setLook] = useState<Look>('navy')
  const [state, setState] = useState<AuraState>('idle')
  const chrome = { ...calm, repetition: 2, softness: 0.1, shiftRed: 0.3, shiftBlue: 0.3 }
  const [presets, setPresets] = useState({ light: { navy: calm, chrome }, dark: { navy: calmDark, chrome } })
  const theme = dark ? 'dark' : 'light'
  const metal = presets[theme]
  const setMetal = (fn: (m: typeof metal) => typeof metal) => setPresets((ps) => ({ ...ps, [theme]: fn(ps[theme]) }))
  const [frost, setFrost] = useState<Frost>({ speed: 0.3, distortion: 0.8, swirl: 0.6, blur: 6 })
  const [copied, setCopied] = useState(false)

  const preset = look === 'frosted' ? frost : { ...metal[look], speed: state === 'idle' ? metal[look].speed : auraPresets[theme][state].speed }
  const copy = () => { navigator.clipboard?.writeText(JSON.stringify(look === 'frosted' ? frost : metal[look], null, 2)); setCopied(true); setTimeout(() => setCopied(false), 1400) }
  const set = (k: string, v: number) => (look === 'frosted' ? setFrost((f) => ({ ...f, [k]: v })) : setMetal((m) => ({ ...m, [look]: { ...m[look as 'navy'], [k]: v } })))
  const ranges = look === 'frosted' ? frostRanges : metalRanges

  return (
    <div className="flex h-full bg-canvas">
      <div className="grid min-w-0 flex-1 grid-cols-3 gap-4 p-6">
        {looks.map((l) => (
          <button key={l.id} onClick={() => setLook(l.id)} className={cn('flex flex-col items-center rounded-3xl bg-surface px-6 pb-8 pt-6 text-left shadow-hairline transition-shadow', look === l.id ? 'ring-2 ring-brand-400' : 'hover:shadow-float')}>
            <span className="self-start text-sm font-semibold">{l.name}</span>
            <span className="mt-16 grid h-40 place-items-center"><Specimen look={l.id} size={128} state={state} metal={l.id === 'frosted' ? undefined : { ...metal[l.id], speed: look === l.id ? (preset as MetalPreset).speed : metal[l.id].speed }} frost={frost} /></span>
            <span className="mt-16 flex items-center gap-2.5 self-start">
              <Specimen look={l.id} size={28} state={state} metal={l.id === 'frosted' ? undefined : metal[l.id]} frost={frost} />
              <span className="text-sm font-semibold">Valerie <span className="font-normal text-muted-foreground">· 8.9s</span></span>
            </span>
          </button>
        ))}
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-5 overflow-y-auto border-l border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{looks.find((l) => l.id === look)!.name} <span className="font-normal text-muted-foreground">· {theme}</span></span>
          <button onClick={() => setDark((d) => !d)} className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Toggle theme">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {states.map((s) => <button key={s} onClick={() => setState(s)} className={cn('h-8 rounded-xl px-3 text-[13px] font-medium', state === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/80 hover:bg-border/70')}>{s}</button>)}
        </div>
        <div className="flex flex-col gap-4">
          {ranges.map(([k, min, max, step]) => {
            const v = (preset as Record<string, number>)[k]
            return (
              <label key={k} className="text-[13px]">
                <span className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="tabular-nums">{v}</span></span>
                <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(k, Number(e.target.value))} className="mt-1.5 w-full accent-[var(--brand-500)]" />
              </label>
            )
          })}
        </div>
        <button onClick={copy} className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copy preset
        </button>
      </aside>
    </div>
  )
}

function Specimen({ look, size, state, metal, frost }: { look: Look; size: number; state: AuraState; metal?: MetalPreset; frost: Frost }) {
  const c = [useCssVar('--brand-100'), useCssVar('--brand-300'), useCssVar('--brand-500'), useCssVar('--brand-700')]
  if (look === 'frosted') {
    return (
      <span className="relative block overflow-hidden rounded-full" style={{ width: size, height: size, filter: `blur(${(frost.blur * size) / 128}px)` }}>
        <MeshGradient className="absolute inset-0" colors={c} distortion={frost.distortion} swirl={frost.swirl} speed={frost.speed} />
      </span>
    )
  }
  return (
    <span className="relative block" style={{ width: size, height: size }}>
      <Suspense fallback={null}><AuraMetal state={state} preset={metal} tintVar={look === 'chrome' ? '--primary-foreground' : '--aura-tint'} /></Suspense>
    </span>
  )
}
