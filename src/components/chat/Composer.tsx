import { useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Mic, Paperclip, Square } from 'lucide-react'
import { PersonaPicker } from './PersonaPicker'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

export function Composer({ placeholder, onSubmit, busy = false, onStop, autoFocus = false, className }: {
  placeholder: string; onSubmit: (text: string) => void; busy?: boolean; onStop?: () => void; autoFocus?: boolean; className?: string
}) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const toast = useToast()
  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (busy) return onStop?.()
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
  }
  return (
    <form
      onSubmit={submit}
      className={cn('w-full rounded-3xl border border-border bg-background p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] transition-shadow focus-within:border-brand-300 focus-within:shadow-[0_0_0_4px_var(--brand-50),0_12px_32px_-12px_rgba(15,23,42,0.12)] dark:focus-within:shadow-none', className)}
    >
      <textarea
        ref={ref}
        rows={2}
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        placeholder={placeholder}
        className="block w-full resize-none bg-transparent px-2 pt-1 text-base leading-6 outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-2 flex items-center gap-1">
        <PersonaPicker />
        <button type="button" onClick={() => toast('Attachments aren’t part of this prototype')} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Attach"><Paperclip className="size-4" /></button>
        <button type="button" onClick={() => toast('Voice input isn’t part of this prototype')} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Voice"><Mic className="size-4" /></button>
        <span className="flex-1" />
        <button
          type="submit"
          aria-label={busy ? 'Stop' : 'Send'}
          className={cn('grid size-9 place-items-center rounded-full bg-brand-950 text-white shadow-sm transition hover:bg-brand-900 disabled:opacity-40 dark:bg-brand-500', !busy && !text.trim() && 'opacity-40')}
        >
          {busy ? <Square className="size-3.5 fill-current" /> : <ArrowUp className="size-4" />}
        </button>
      </div>
    </form>
  )
}
