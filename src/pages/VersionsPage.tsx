import { lazy, Suspense, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Hologram } from '@/components/exp/Hologram'
import { MarkOrb } from '@/components/exp/MarkOrb'
import { Constellation } from '@/components/brand/Constellation'
import { versionsCopy } from '@/data/ui'
import type { ExpProps } from '@/components/exp/motion'

/**
 * /archive: every archived version on one page, opened from the logo, so presenting needs no typing in the address bar.
 * Each card shows that version's Aura live; pointing at a card sets it thinking. Plain links (not router links):
 * each version is its own basename, read once at load.
 */
const SIZE = 96
/** v1's Solid acrylic is 3D (three.js), so it loads on its own. */
const SolidAcrylic = lazy(() => import('@/components/exp/bot/Solid').then((m) => ({ default: m.SolidAcrylic })))
const forms: Record<string, (p: ExpProps) => React.ReactNode> = { v1: SolidAcrylic, v2: Constellation, v3: MarkOrb, v4: Hologram }

function Preview({ tag, active }: { tag: string; active: boolean }) {
  const C = forms[tag]
  return <Suspense fallback={null}><C state={active ? 'thinking' : 'idle'} size={SIZE} /></Suspense>
}

export function VersionsPage() {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div data-canvas className="flex h-full flex-col items-center overflow-y-auto bg-canvas px-6 pb-16 pt-16">
      <div className="w-full max-w-[1120px]">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">{versionsCopy.title}</h1>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {versionsCopy.versions.map((v) => (
            <a
              key={v.tag}
              href={v.href}
              onMouseEnter={() => setHover(v.tag)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(v.tag)}
              onBlur={() => setHover(null)}
              className="group flex flex-col rounded-3xl bg-surface p-6 shadow-hairline transition-shadow hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="grid h-40 place-items-center"><Preview tag={v.tag} active={hover === v.tag} /></span>
              <span className="mt-4 text-sm font-medium text-brand-600 dark:text-brand-300">{v.tag}</span>
              <span className="mt-0.5 flex items-center justify-between gap-2 text-base font-semibold">
                {v.name}
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{v.home}</span>
            </a>
          ))}
        </div>
        <div className="mt-6 flex gap-6">
          {[versionsCopy.current, versionsCopy.experiments, versionsCopy.botExperiments].map((l) => (
            <a key={l.href} href={l.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label} <ArrowRight className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
