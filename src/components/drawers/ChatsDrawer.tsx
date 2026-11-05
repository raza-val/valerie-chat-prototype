import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { prompts } from '@/data/prompts'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/cn'

export function ChatsDrawer() {
  const { chatsOpen, setChatsOpen } = useStore()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const id = useLocation().pathname.split('/chat/')[1]
  const [params] = useSearchParams()
  const needle = q.toLowerCase()
  const groups = useMemo(() => {
    const list = prompts.filter((p) => p.chatTitle.toLowerCase().includes(needle))
    return ['Today', 'Yesterday', 'Mon'].map((w) => ({ w, items: list.filter((p) => p.when === w) })).filter((g) => g.items.length)
  }, [needle])
  const shell = params.get('shell') ? `?shell=${params.get('shell')}` : ''
  const open = (chatId: string) => { setChatsOpen(false); navigate(`/chat/${chatId}${shell ? shell + '&' : '?'}state=answer`) }
  return (
    <Sheet open={chatsOpen} onClose={() => setChatsOpen(false)} title="Chats" width={400}>
      <label className="flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm focus-within:border-brand-300">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      {groups.map((g) => (
        <div key={g.w} className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">{g.w === 'Mon' ? 'Earlier this week' : g.w}</p>
          <ul className="-mx-2.5 mt-1.5">
            {g.items.map((p) => (
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
