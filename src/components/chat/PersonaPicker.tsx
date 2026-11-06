import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { personas, type Persona } from '@/data/personas'
import { personaCopy } from '@/data/ui'
import { VERSION } from '@/lib/aura'
import { MenuTitle } from './ModelPicker'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

export function Avatar({ p, size = 24 }: { p: Persona; size?: number }) {
  return p.avatar ? (
    <img src={p.avatar} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-800" style={{ width: size, height: size }}>{p.initials}</span>
  )
}

/**
 * "Answer as" picker: on Home inside the composer, beside the +, its menu opening below. The name only; the role is in the menu.
 * `compact` (main design's thread, 6 Nov): under the composer on the left, opposite the model picker, h-8 and muted like it,
 * the menu opening above. Switching mid-chat adds a "Now tuned for" divider to the thread.
 */
export function PersonaPicker({ compact = false }: { compact?: boolean }) {
  const { persona, setPersona } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`${persona.name}, ${persona.role}`} aria-expanded={open} className={cn('flex items-center gap-1.5 rounded-lg pl-1.5 pr-2 text-sm font-medium transition-colors hover:bg-muted', compact ? 'h-8 text-muted-foreground hover:text-foreground' : 'h-9', open && 'bg-muted', open && compact && 'text-foreground')}>
        <Avatar p={persona} size={20} />
        {persona.name}
        <ChevronDown className={cn('-ml-0.5 size-3.5', !compact && 'text-muted-foreground')} />
      </button>
      {open && (
        <div role="menu" aria-label={VERSION === 'main' ? personaCopy.title : undefined} className={cn('absolute z-30 w-64 rounded-xl border border-border bg-background p-1.5 shadow-xl', compact ? 'bottom-10 left-0' : 'left-0 top-11')}>
          {VERSION === 'main' && <MenuTitle>{personaCopy.title}</MenuTitle>}
          {personas.map((p) => (
            <button key={p.id} role="menuitemradio" aria-checked={p.id === persona.id} onClick={() => { setPersona(p); setOpen(false) }} className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted', p.id === persona.id && 'bg-muted')}>
              <Avatar p={p} size={28} />
              <span className="flex-1"><span className="block font-semibold">{p.name}</span><span className="block text-xs text-muted-foreground">{p.role}</span></span>
              {p.id === persona.id && <Check className="size-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
