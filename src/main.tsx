import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { StoreProvider } from '@/lib/store'
import { BASENAME, CONSTELLATION } from '@/lib/aura'
import { versionCopy } from '@/data/ui'
import { ToastProvider } from '@/components/ui/Toast'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/dm-sans/wght-italic.css' // a true italic (Figma's "(share /year)"), not a slanted upright
import './styles/index.css'

if (CONSTELLATION) document.title = versionCopy.titleB

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASENAME}>
      <StoreProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
