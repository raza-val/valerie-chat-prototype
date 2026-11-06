import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ChatsDrawer } from '@/components/drawers/ChatsDrawer'
import { TracesDrawer } from '@/components/drawers/TracesDrawer'
import { AuraFlight } from '@/components/brand/AuraFlight'
import { HomePage, type HomeLayout } from '@/pages/HomePage'
import { VERSION } from '@/lib/aura'
import { ChatPage } from '@/pages/ChatPage'
import { VersionsPage } from '@/pages/VersionsPage'

const LabPage = lazy(() => import('@/pages/LabPage').then((m) => ({ default: m.LabPage })))
const ExpPage = lazy(() => import('@/pages/ExpPage').then((m) => ({ default: m.ExpPage })))
const BotExpPage = lazy(() => import('@/pages/BotExpPage').then((m) => ({ default: m.BotExpPage })))
const MotionExpPage = lazy(() => import('@/pages/MotionExpPage').then((m) => ({ default: m.MotionExpPage })))

export default function App() {
  return (
    <Routes>
      {/* Design tool, outside the product shell */}
      <Route path="/lab" element={<Suspense fallback={null}><LabPage /></Suspense>} />
      <Route path="/exp" element={<Suspense fallback={null}><ExpPage /></Suspense>} />
      <Route path="/exp/bot" element={<Suspense fallback={null}><BotExpPage /></Suspense>} />
      <Route path="/exp/motion" element={<Suspense fallback={null}><MotionExpPage /></Suspense>} />
      <Route path="*" element={<Product />} />
    </Routes>
  )
}

/** Each version's Home: main Aura beside the headline and the cards under the composer, two to a row; archived v1 the same cards under a centred Aura; v3 one to a row; v4 beside the composer; v2 the lens tabs. */
const layout: HomeLayout = ({ main: 'main', v1: 'pairs', v2: 'tabs', v3: 'below', v4: 'side' } as const)[VERSION]

function Product() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage layout={layout} />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/archive" element={<VersionsPage />} />
        <Route path="*" element={<HomePage layout={layout} />} />
      </Routes>
      <ChatsDrawer />
      <TracesDrawer />
      <AuraFlight />
    </AppShell>
  )
}
