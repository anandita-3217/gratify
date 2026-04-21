
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HashRouter } from 'react-router-dom'
import { Box } from '@mantine/core'

import Sidebar from './components/Sidebar'

// Pages — create stub files for any you haven't built yet
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Settings  from './pages/Settings'
import { useState } from 'react'

// Stubs — replace these with real pages as you build them
const Stub = ({ name }) => (
  <Box p="xl">
    <h2>{name}</h2>
    <p style={{ color: 'var(--mantine-color-dimmed)' }}>Coming soon.</p>
  </Box>
)

export default function App() {

  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className='flex h-screen w-screen'>
      <Notifications position="top-right" />
      <HashRouter>
        <div className='flex h-full w-full'>
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <main className='flex-1'>
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'tasks'     && <Tasks/>}
            {activePage === 'notes'     && <Stub name="Notes" />}
            {activePage === 'timer'     && <Stub name="Pomodoro Timer" />}
            {activePage === 'calendar'  && <Stub name="Calendar" />}
            {activePage === 'settings'  && <Stub name="Settings" />}
          </main>
        </div>
      </HashRouter>
    </div>

  )
}