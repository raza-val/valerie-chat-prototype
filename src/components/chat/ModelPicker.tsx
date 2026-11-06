import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { modelCopy } from '@/data/ui'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

/** The model picker: inside the composer on Home, beside the persona; in the main design's thread, under the composer on its
 * own line (`compact`), so it never takes width from the text. The name only, muted until opened.
 * The menu opens below it on Home (`below`); in the thread the composer sits at the foot of the screen, so it opens above. */
export function ModelPicker({ below = false, compact = false }: { below?: boolean; compact?: boolean }) {
  const { model, setModel } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`${modelCopy.label}: ${model.name}`} aria-expanded={open} className={cn('flex items-center gap-1 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', compact ? 'h-8' : 'h-9', open && 'bg-muted text-foreground')}>
        {model.name}
        <ChevronDown className="size-3.5" />
      </button>
      {open && (
        <div role="menu" aria-label={modelCopy.label} className={cn('absolute right-0 z-30 w-56 rounded-xl border border-border bg-background p-1.5 shadow-xl', below ? 'top-11' : 'bottom-11')}>
          {modelCopy.models.map((m) => (
            <button key={m.id} role="menuitemradio" aria-checked={m.id === model.id} onClick={() => { setModel(m); setOpen(false) }} className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted', m.id === model.id && 'bg-muted font-semibold')}>
              <span className="flex-1">{m.name}</span>
              {m.id === model.id && <Check className="size-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
