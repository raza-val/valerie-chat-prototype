import { createContext, useContext, useState, type ReactNode } from 'react'
import { personas, type Persona } from '@/data/personas'
import { modelCopy, type Model } from '@/data/ui'
import { reducedMotion } from '@/lib/motion'

/** Aura flying from the Home hero (centre x, y and size) to the seat it lands on. */
export type Flight = { from: { x: number; y: number; size: number }; seat: HTMLElement | null }

type Store = {
  persona: Persona
  setPersona: (p: Persona) => void
  model: Model
  setModel: (m: Model) => void
  chatsOpen: boolean
  setChatsOpen: (v: boolean) => void
  tracesOpen: boolean
  /** open the traces drawer, optionally focused on one chat id */
  openTraces: (focusId?: string | null) => void
  closeTraces: () => void
  traceFocus: string | null
  /** The persona each chat's answer was tuned for, by chat id */
  answeredFor: Record<string, Persona>
  setAnsweredFor: (chatId: string, p: Persona) => void
  flight: Flight | null
  /** Take off from the Home hero's box (skipped under reduced motion). */
  startFlight: (from: DOMRect) => void
  /** The first seat to come up while Aura is in the air claims the landing. */
  claimSeat: (el: HTMLElement) => void
  endFlight: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(personas[0])
  const [model, setModel] = useState<Model>(modelCopy.models[0])
  const [chatsOpen, setChatsOpen] = useState(false)
  const [tracesOpen, setTracesOpen] = useState(false)
  const [traceFocus, setTraceFocus] = useState<string | null>(null)
  const [answeredFor, setAnsweredForMap] = useState<Record<string, Persona>>({})
  const [flight, setFlight] = useState<Flight | null>(null)
  return (
    <Ctx.Provider
      value={{
        persona, setPersona, model, setModel, chatsOpen, setChatsOpen, tracesOpen, traceFocus,
        openTraces: (id = null) => { setTraceFocus(id); setTracesOpen(true) },
        closeTraces: () => setTracesOpen(false),
        answeredFor,
        setAnsweredFor: (chatId, p) => setAnsweredForMap((m) => (m[chatId]?.id === p.id ? m : { ...m, [chatId]: p })),
        flight,
        startFlight: (r) => { if (!reducedMotion()) setFlight({ from: { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width }, seat: null }) },
        claimSeat: (el) => setFlight((f) => (f && !f.seat ? { ...f, seat: el } : f)),
        endFlight: () => setFlight(null),
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
