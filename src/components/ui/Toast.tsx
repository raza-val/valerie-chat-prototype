import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'

const ToastCtx = createContext<(msg: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((m: string) => {
    setMsg(m)
    window.clearTimeout((show as unknown as { t?: number }).t)
    ;(show as unknown as { t?: number }).t = window.setTimeout(() => setMsg(null), 2200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 transition-all duration-200 ${msg ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          <Check className="size-4 text-emerald-400" /> {msg}
        </div>
      </div>
    </ToastCtx.Provider>
  )
}
