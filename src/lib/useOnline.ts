import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Tracks the browser's online/offline status. */
export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])
  return online
}

/** Offline when the browser is, or when simulated with ?offline=1. `reconnect` clears the simulation once back online. */
export function useOffline() {
  const online = useOnline()
  const [params, setParams] = useSearchParams()
  const offline = !online || params.get('offline') === '1'
  const reconnect = () => {
    if (!navigator.onLine) return
    const next = new URLSearchParams(params); next.delete('offline'); setParams(next, { replace: true })
  }
  return { offline, reconnect }
}
