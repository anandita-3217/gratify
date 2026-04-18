import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HashRouter } from 'react-router-dom'
import { Box } from '@mantine/core'

import Sidebar from './components/Sidebar'

// Pages — create stub files for any you haven't built yet
import Dashboard from './pages/Dashboard'
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
    <>
      <Notifications position="top-right" />
      <HashRouter>
        <div className='flex h-screen w-screen overflow-hidden'>
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <main className='flex-1'>
            {activePage === 'dashboard' && <div><Dashboard/></div>}
            {activePage === 'tasks' && <div><Stub name="Tasks" /></div>}
            {activePage === 'notes' && <div><Stub name="Notes" /></div>}
            {activePage === 'timer' && <div><Stub name="Pomodoro Timer" /></div>}
            {activePage === 'calendar' && <div><Stub name="Calendar" /></div>}
            {/* {activePage === 'stats' && <div>Stats Page</div>} */}
            
          </main>
        </div>
      </HashRouter>
    </>
  )
}