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

/** "Answer as" picker inside the composer. */
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
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex h-8 items-center gap-2 rounded-full bg-muted pl-1 pr-2.5 text-sm hover:bg-border/60">
        <Avatar p={persona} />
        <span className="font-semibold">{persona.name}</span>
        <span className="text-muted-foreground">{persona.role}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute bottom-10 left-0 z-30 w-64 rounded-xl border border-border bg-background p-1.5 shadow-xl">
          <p className="px-2.5 pb-1.5 pt-1 text-xs text-muted-foreground">Tune answers for</p>
          {personas.map((p) => (
            <button key={p.id} onClick={() => { setPersona(p); setOpen(false) }} className={cn('flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-muted', p.id === persona.id && 'bg-muted')}>
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
