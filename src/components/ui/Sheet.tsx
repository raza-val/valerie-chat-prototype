import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { VERSION } from '@/lib/aura'
import { cn } from '@/lib/cn'

/**
 * Right-hand drawer used for Chats and Traces. Closes on Esc and on backdrop click.
 * Main design: the DS Sheet: 24px in, title text-lg/leading-7 semibold, description text-sm/leading-5 muted,
 * closed by a ghost Icon Button (36px, 12px corners, 16px icon).
 */
const ds = VERSION === 'main'
export function Sheet({ open, onClose, title, description, children, width = 420 }: {
  open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; width?: number
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={open ? 'pointer-events-auto' : 'pointer-events-none'} aria-hidden={!open}>
      <div onClick={onClose} className={`fixed inset-0 z-40 bg-slate-950/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        role="dialog"
        aria-label={title}
        style={{ width }}
        className={`fixed right-0 top-0 z-50 flex h-full max-w-full flex-col border-l border-border bg-background shadow-2xl transition-[transform,visibility] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? 'visible translate-x-0' : 'invisible translate-x-full'}`}
      >
        <header className={cn('flex items-start gap-3', ds ? 'px-6 pb-6 pt-6' : 'px-5 pb-4 pt-5')}>
          <div className="min-w-0 flex-1">
            <h2 className={ds ? 'text-lg font-semibold leading-7' : 'text-base font-semibold'}>{title}</h2>
            {description && <p className={cn('text-sm text-muted-foreground', ds ? 'mt-1.5 leading-5' : 'mt-1')}>{description}</p>}
          </div>
          {ds
            ? <button onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-xl text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-4"><X /></button>
            : <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close"><X /></Button>}
        </header>
        <div className={cn('min-h-0 flex-1 overflow-y-auto', ds ? 'px-6 pb-6' : 'px-5 pb-6')}>{children}</div>
      </aside>
    </div>
  )
}
