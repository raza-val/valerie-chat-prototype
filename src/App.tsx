import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ChatsDrawer } from '@/components/drawers/ChatsDrawer'
import { TracesDrawer } from '@/components/drawers/TracesDrawer'
import { HomePage } from '@/pages/HomePage'
import { ChatPage } from '@/pages/ChatPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ChatsDrawer />
      <TracesDrawer />
    </AppShell>
  )
}
