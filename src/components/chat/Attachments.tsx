import { useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Paperclip, Plus, X } from 'lucide-react'
import { attachCopy } from '@/data/ui'
import { cn } from '@/lib/cn'

/**
 * Attachments (main design, 6 Nov). The composer's + opens a menu like the persona and model menus; today it holds one
 * item, Upload a file, and later images, screenshots, video, audio and links join it. A chosen file shows as a card in the
 * composer (uploading for a moment, then its name, type and size, with a remove ×) and, once sent, above the question in
 * the thread. Nothing is read or sent anywhere: the prototype only shows the file.
 */
export type Attachment = { id: string; name: string; size: number; uploading?: boolean }

const kb = 1024
const sizeOf = (n: number) => (n < kb * kb ? `${Math.max(1, Math.round(n / kb))} KB` : `${(n / kb / kb).toFixed(1)} MB`)
/** "PDF · 1.2 MB": the extension, then the size. */
export const fileMeta = (f: Attachment) => {
  const ext = f.name.includes('.') ? f.name.split('.').pop()!.toUpperCase() : attachCopy.file
  return `${ext} · ${sizeOf(f.size)}`
}

/** The + and its menu. `below`: the composer sits high on the screen (Home), so the menu opens under it. */
export function AttachMenu({ below = false, onFiles, className }: { below?: boolean; onFiles: (files: File[]) => void; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={attachCopy.label} aria-haspopup="menu" aria-expanded={open} className={cn(className, open && 'bg-muted text-foreground')}>
        <Plus className={cn('size-5 transition-transform duration-200', open && 'rotate-45')} />
      </button>
      {open && (
        <div role="menu" aria-label={attachCopy.label} className={cn('absolute left-0 z-30 w-56 animate-pop rounded-xl border border-border bg-background p-1.5 shadow-xl', below ? 'top-11' : 'bottom-11')}>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); input.current?.click() }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted">
            <Paperclip className="size-4 shrink-0 text-muted-foreground" />
            {attachCopy.upload}
          </button>
        </div>
      )}
      <input ref={input} type="file" multiple hidden onChange={(e) => { const fs = [...(e.target.files ?? [])]; e.target.value = ''; if (fs.length) onFiles(fs) }} />
    </div>
  )
}

/**
 * A file as a card: a navy tile (a spinner while it uploads, then a document), its name and "TYPE · size".
 * In the composer it sits on the white box with a hairline and a remove ×; in the thread, white on the canvas.
 */
export function AttachmentCard({ file, onRemove, inThread = false }: { file: Attachment; onRemove?: () => void; inThread?: boolean }) {
  return (
    <div className={cn('flex h-14 w-[280px] max-w-full animate-rise items-center gap-2.5 rounded-xl bg-surface p-2', onRemove ? 'pr-1.5' : 'pr-3', inThread ? 'shadow-hairline' : 'ring-1 ring-border')}>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        {file.uploading ? <Loader2 className="size-[18px] animate-spin" /> : <FileText className="size-[18px] animate-pop" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5" title={file.name}>{file.name}</span>
        <span className="block truncate text-xs leading-4 text-muted-foreground">{file.uploading ? attachCopy.uploading : fileMeta(file)}</span>
      </span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`${attachCopy.remove} ${file.name}`} className="grid size-7 shrink-0 place-items-center self-start rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
