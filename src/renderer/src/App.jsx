import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HashRouter } from 'react-router-dom'

import Sidebar from './components/Sidebar'

// Pages — create stub files for any you haven't built yet
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import Timer from './pages/Timer'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import { useState } from 'react'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  return (
    <div className="flex h-screen w-screen">
      <Notifications position="top-right" />
      <HashRouter>
        <div className="flex h-full w-full">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <main className="flex-1">
            {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
            {activePage === 'tasks' && <Tasks />}
            {activePage === 'notes' && <Notes />}
            {activePage === 'timer' && <Timer />}
            {activePage === 'calendar' && <Calendar />}
            {activePage === 'settings' && <Settings />}
          </main>
        </div>
      </HashRouter>
    </div>
  )
}
