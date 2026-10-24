import { createContext, useContext, useState, type ReactNode } from 'react'
import { personas, type Persona } from '@/data/personas'

type Store = {
  persona: Persona
  setPersona: (p: Persona) => void
  chatsOpen: boolean
  setChatsOpen: (v: boolean) => void
  tracesOpen: boolean
  /** open the traces drawer, optionally focused on one chat id */
  openTraces: (focusId?: string | null) => void
  closeTraces: () => void
  traceFocus: string | null
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(personas[0])
  const [chatsOpen, setChatsOpen] = useState(false)
  const [tracesOpen, setTracesOpen] = useState(false)
  const [traceFocus, setTraceFocus] = useState<string | null>(null)
  return (
    <Ctx.Provider
      value={{
        persona, setPersona, chatsOpen, setChatsOpen, tracesOpen, traceFocus,
        openTraces: (id = null) => { setTraceFocus(id); setTracesOpen(true) },
        closeTraces: () => setTracesOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useStore = () => {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
