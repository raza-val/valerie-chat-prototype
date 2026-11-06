import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Mic, Plus, Square } from 'lucide-react'
import { PersonaPicker } from './PersonaPicker'
import { ModelPicker } from './ModelPicker'
import { Aura } from '@/components/brand/Aura'
import { MORPH_MS, VERSION } from '@/lib/aura'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

/**
 * In the thread, one thin row, like the modern assistants: attach (+), the text, model, voice, send. Thin so it
 * never hides the thread it floats over. Once the text wraps it opens into two rows (below); it grows to six lines,
 * then scrolls, and is one row again once sent.
 * `tall` (Home): the same controls under a two-line input, + and the persona on the left, model, voice and send on the right.
 * The model can change mid-chat (a divider marks it in the thread). In the main design's thread it sits under the box
 * (6 Nov, like Claude): inside the one-row box it took width from the text.
 * The persona (Milo, Brie) is chosen on Home only (`pickPersona`); a chat keeps the persona it started with.
 * The same 10px padding on every side: the buttons sit as far from the left and right edges as from the top and bottom.
 * 36px wider than the 720 text column (756), so that inset puts the + glyph on the text's left edge and the send arrow
 * on its right edge, like Claude and ChatGPT (Home: the placeholder and the starters too). A hairline and a deeper shadow (D19) set it
 * apart from the white cards in the thread. Corners at 16px, buttons at 8px: squarer than a pill, like Claude.
 * Send is the screen's one filled button, and only once there is something to send.
 * `docked`: Valerie is working out of view, so Aura sits at the left of the pill until you scroll back.
 * `seed` (Home v4): a suggested question picked beside the composer types itself into the box, then sends, so
 * the card and the composer read as one thing.
 */
export function Composer({ placeholder, onSubmit, busy = false, onStop, disabled = false, autoFocus = false, tall = false, pickPersona = false, pickModel = true, onTyping, docked = false, seed, className }: {
  placeholder: string; onSubmit: (text: string) => void; busy?: boolean; onStop?: () => void; disabled?: boolean; autoFocus?: boolean; tall?: boolean; pickPersona?: boolean
  /** The model picker inside the box. Off in the main design's thread, where it sits under the box instead (ChatPage). */
  pickModel?: boolean
  seed?: { text: string; n: number }
  /** Whether there is text in the box (Home: Aura listens while you type). */
  onTyping?: (typing: boolean) => void
  docked?: boolean
  className?: string
}) {
  // Aura forms in the dock and melts out of it, so it stays mounted while leaving
  const [dock, setDock] = useState<'in' | 'out' | null>(docked ? 'in' : null)
  useEffect(() => {
    if (docked) return setDock('in')
    setDock((d) => (d ? 'out' : null))
    const t = window.setTimeout(() => setDock(null), MORPH_MS)
    return () => clearTimeout(t)
  }, [docked])
  const [text, setText] = useState('')
  // In the thread it is one row until the text needs a second line; then it opens into Home's layout (the text on
  // top, full width, the controls under it), like ChatGPT, and stays open until the text is sent or cleared.
  // One grid either way, so the textarea never remounts: the cursor and focus stay put.
  const [opened, setOpened] = useState(false)
  const two = tall || opened
  const ref = useRef<HTMLTextAreaElement>(null)
  const toast = useToast()
  const ready = busy || (!disabled && !!text.trim())
  const grow = (el: HTMLTextAreaElement) => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  useLayoutEffect(() => { if (opened && ref.current) grow(ref.current) }, [opened]) // re-measure at the new width
  // A seeded question types in at a reading pace (about 0.6s whatever its length), holds a beat, then sends.
  useEffect(() => {
    if (!seed) return
    const el = ref.current
    let i = 0, t = 0
    const per = Math.max(1, Math.ceil(seed.text.length / 28))
    const iv = window.setInterval(() => {
      i = Math.min(seed.text.length, i + per)
      setText(seed.text.slice(0, i))
      if (el) requestAnimationFrame(() => grow(el))
      if (i < seed.text.length) return
      clearInterval(iv)
      t = window.setTimeout(() => { onSubmit(seed.text); setText(''); if (el) el.style.height = '' }, 350)
    }, 22)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [seed?.n])
  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (busy) return onStop?.()
    if (disabled || !text.trim()) return
    onSubmit(text.trim())
    setText('')
    setOpened(false)
    onTyping?.(false)
    if (ref.current) ref.current.style.height = ''
  }
  const iconBtn = 'grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
  return (
    <form
      onSubmit={submit}
      className={cn(
        'grid w-full grid-cols-[auto_1fr_auto] items-end gap-x-0.5 rounded-2xl bg-surface p-2.5 shadow-composer ring-1 ring-border transition-shadow focus-within:ring-brand-300 dark:focus-within:ring-brand-700',
        two ? "gap-y-2 [grid-template-areas:'input_input_input'_'lead_._tools']" : "[grid-template-areas:'lead_input_tools']",
        // The main design's rim: a light that glides round the edge while the box is active (D23). The archive keeps the plain ring.
        VERSION === 'main' && 'composer-rim',
        className,
      )}
    >
      <div className="flex items-center gap-0.5 [grid-area:lead]">
        {dock && <span className={cn('grid size-9 shrink-0 place-items-center', dock === 'in' ? 'animate-form' : 'animate-melt')}><Aura size={24} state="thinking" continues /></span>}
        <button type="button" onClick={() => toast('Attachments aren’t part of this prototype')} className={iconBtn} aria-label="Attach"><Plus className="size-5" /></button>
        {pickPersona && <PersonaPicker />}
      </div>
      <textarea
        ref={ref}
        rows={tall ? 2 : 1}
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => {
          const el = e.target
          setText(el.value); grow(el); onTyping?.(!!el.value.trim())
          // A single line is 36px tall here (24 + 12 padding); anything taller has wrapped.
          if (!tall) setOpened((o) => !!el.value && (o || el.scrollHeight > 36))
        }}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        placeholder={placeholder}
        className={cn('block max-h-[156px] w-full min-w-0 resize-none bg-transparent text-base leading-6 tracking-[-0.01em] outline-none [grid-area:input] placeholder:text-muted-foreground', two ? 'px-2 pt-1.5' : 'px-1 py-1.5')}
      />
      <div className="flex items-center gap-0.5 [grid-area:tools]">
        {pickModel && <ModelPicker below={tall} />}
        <button type="button" onClick={() => toast('Voice input isn’t part of this prototype')} className={iconBtn} aria-label="Voice"><Mic className="size-[18px]" /></button>
        <button
          type="submit"
          aria-label={busy ? 'Stop' : 'Send'}
          disabled={disabled && !busy}
          className={cn('grid size-9 shrink-0 place-items-center rounded-lg transition-colors disabled:opacity-50', ready ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground')}
        >
          {busy ? <Square className="size-3.5 fill-current" /> : <ArrowUp className="size-[18px]" />}
        </button>
      </div>
    </form>
  )
}
