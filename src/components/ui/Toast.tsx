import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type ToastAction = { label: string; onClick: () => void }
type ShowToast = (msg: string, action?: ToastAction) => void

const ToastCtx = createContext<ShowToast>(() => {})
export const useToast = () => useContext(ToastCtx)

/** Text only: most toasts say something isn't in the prototype, so a success tick would read wrong. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; action?: ToastAction } | null>(null)
  const timer = useRef<number>()
  const show = useCallback<ShowToast>((msg, action) => {
    setToast({ msg, action })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), action ? 4000 : 2200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={`fixed bottom-44 left-1/2 z-[60] -translate-x-1/2 transition-all duration-200 ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
        <div className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 pl-4 pr-1.5 text-sm text-white shadow-lg dark:ring-1 dark:ring-white/10">
          <span className={toast?.action ? '' : 'pr-2.5'}>{toast?.msg}</span>
          {toast?.action && (
            <button
              onClick={() => { toast.action!.onClick(); setToast(null) }}
              className="ml-2 h-7 rounded-lg px-2.5 text-sm font-semibold text-brand-300 hover:bg-white/10"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>
    </ToastCtx.Provider>
  )
}
