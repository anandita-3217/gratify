import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mantine/core'

import Sidebar from './components/Sidebar'

// Pages — create stub files for any you haven't built yet
import Dashboard from './pages/Dashboard'
import Settings  from './pages/Settings'

// Stubs — replace these with real pages as you build them
const Stub = ({ name }) => (
  <Box p="xl">
    <h2>{name}</h2>
    <p style={{ color: 'var(--mantine-color-dimmed)' }}>Coming soon.</p>
  </Box>
)

export default function App() {
  return (
    // TODO: use the inbuilt mantine color schems for light, dark  by adding a themeToggle
    <MantineProvider defaultColorScheme="dark">
      <Notifications position="top-right" />
      <HashRouter>
        <div className='flex h-screen w-screen overflow-hidden'>
          <Sidebar />
          <main className='flex-1'>
            <Routes>
              <Route path="/"          element={<Dashboard />} />
              <Route path="/pomodoro"  element={<Stub name="Pomodoro Timer" />} />
              <Route path="/tasks"     element={<Stub name="Tasks" />} />
              <Route path="/notes"     element={<Stub name="Notes" />} />
              <Route path="/calendar"  element={<Stub name="Calendar" />} />
              <Route path="/stats"     element={<Stub name="Stats" />} />
              <Route path="/settings"  element={<Settings />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </MantineProvider>
  )
}