import { useEffect, useState } from 'react'
import { VERSION } from '@/lib/aura'

/** Light only in the main design (6 Nov: Figma, the source of truth, has no dark mode). The archive keeps its toggle. */
export const THEMES = VERSION !== 'main'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (!THEMES) return false
    try { return localStorage.getItem('valerie-theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    if (!THEMES) return
    try { localStorage.setItem('valerie-theme', dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}
