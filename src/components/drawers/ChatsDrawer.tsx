import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Trash2 } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { prompts } from '@/data/prompts'
import { useStore } from '@/lib/store'
import { chatsCopy } from '@/data/ui'
import { useToast } from '@/components/ui/Toast'
import { VERSION } from '@/lib/aura'
import { cn } from '@/lib/cn'

/**
 * Main design (6 Nov): rows in text-base (16/24, as the live product), day labels text-sm/leading-5/medium, and a delete
 * button on each row, shown on hover or focus, with Undo in the toast. No icon or date on every row: the day groups say it once.
 */
const main = VERSION === 'main'

export function ChatsDrawer() {
  const { chatsOpen, setChatsOpen } = useStore()
  const [q, setQ] = useState('')
  const [gone, setGone] = useState<string[]>([])
  const toast = useToast()
  const navigate = useNavigate()
  const id = useLocation().pathname.split('/chat/')[1]
  const [params] = useSearchParams()
  const needle = q.toLowerCase()
  const groups = useMemo(() => {
    const list = prompts.filter((p) => !gone.includes(p.id) && p.chatTitle.toLowerCase().includes(needle))
    return ['Today', 'Yesterday', 'Mon'].map((w) => ({ w, items: list.filter((p) => p.when === w) })).filter((g) => g.items.length)
  }, [needle, gone])
  const shell = params.get('shell') ? `?shell=${params.get('shell')}` : ''
  const open = (chatId: string) => { setChatsOpen(false); navigate(`/chat/${chatId}${shell ? shell + '&' : '?'}state=answer`) }
  const remove = (chatId: string) => {
    setGone((g) => [...g, chatId])
    if (chatId === id) navigate({ pathname: '/', search: shell })
    toast(chatsCopy.deleted, { label: chatsCopy.undo, onClick: () => setGone((g) => g.filter((x) => x !== chatId)) })
  }
  return (
    <Sheet open={chatsOpen} onClose={() => setChatsOpen(false)} title="Chats" width={400}>
      <label className="flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm focus-within:border-brand-300">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      {groups.map((g) => (
        <div key={g.w} className="mt-5">
          <p className={cn('font-medium text-muted-foreground', main ? 'text-sm leading-5' : 'text-xs')}>{g.w === 'Mon' ? 'Earlier this week' : g.w}</p>
          <ul className="-mx-2.5 mt-1.5">
            {g.items.map((p) => main ? (
              <li key={p.id} className={cn('group flex items-center rounded-lg pr-1 hover:bg-muted focus-within:bg-muted', p.id === id && 'bg-muted')}>
                <button onClick={() => open(p.id)} className={cn('min-w-0 flex-1 truncate px-2.5 py-2 text-left text-base leading-6 focus-visible:outline-none', p.id === id && 'font-semibold')}>
                  {p.chatTitle}
                </button>
                {/* The DS Icon Button, ghost: 32px, 12px corners, 16px icon; there on hover or keyboard focus. */}
                <button
                  onClick={() => remove(p.id)}
                  aria-label={`${chatsCopy.delete}: ${p.chatTitle}`}
                  title={chatsCopy.delete}
                  className="grid size-8 shrink-0 place-items-center rounded-xl text-muted-foreground opacity-0 transition-[opacity,color,background-color] hover:bg-background hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 group-hover:opacity-100 group-focus-within:opacity-100 [&_svg]:size-4"
                >
                  <Trash2 />
                </button>
              </li>
            ) : (
              <li key={p.id}>
                <button
                  onClick={() => open(p.id)}
                  className={cn('block w-full truncate rounded-lg px-2.5 py-2.5 text-left text-sm hover:bg-muted', p.id === id && 'bg-muted font-semibold')}
                >
                  {p.chatTitle}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!groups.length && <p className="mt-10 text-center text-sm text-muted-foreground">No chats match “{q}”.</p>}
    </Sheet>
  )
}
