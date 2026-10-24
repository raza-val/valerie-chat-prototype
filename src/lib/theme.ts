import { useEffect, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('valerie-theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('valerie-theme', dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}
