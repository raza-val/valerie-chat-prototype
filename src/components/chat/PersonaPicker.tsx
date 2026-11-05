import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { personas, type Persona } from '@/data/personas'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

export function Avatar({ p, size = 24 }: { p: Persona; size?: number }) {
  return p.avatar ? (
    <img src={p.avatar} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-800" style={{ width: size, height: size }}>{p.initials}</span>
  )
}

/** "Answer as" picker inside the composer, beside the +: the name only; the role is in the menu, which opens below it (Home only). */
export function PersonaPicker() {
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
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`${persona.name}, ${persona.role}`} aria-expanded={open} className={cn('flex h-9 items-center gap-1.5 rounded-lg pl-1.5 pr-2 text-sm font-medium transition-colors hover:bg-muted', open && 'bg-muted')}>
        <Avatar p={persona} size={20} />
        {persona.name}
        <ChevronDown className="-ml-0.5 size-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-30 w-64 rounded-xl border border-border bg-background p-1.5 shadow-xl">
          {personas.map((p) => (
            <button key={p.id} onClick={() => { setPersona(p); setOpen(false) }} className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted', p.id === persona.id && 'bg-muted')}>
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
