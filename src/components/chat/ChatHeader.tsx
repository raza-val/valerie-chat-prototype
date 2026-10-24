import { Activity, History, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

/** The chat's own bar: conversation title on the left, chat actions on the right. */
export function ChatHeader({ title, chatId }: { title?: string; chatId?: string }) {
  const navigate = useNavigate()
  const { setChatsOpen, openTraces } = useStore()
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-background/90 px-6 backdrop-blur">
      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</h1>
      {title && <Button onClick={() => navigate({ pathname: '/', search: location.search })}><Plus /> New chat</Button>}
      <Button onClick={() => openTraces(chatId ?? null)}><Activity /> View traces</Button>
      <Button onClick={() => setChatsOpen(true)}><History /> Chats</Button>
    </div>
  )
}
