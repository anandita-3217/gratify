import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { HashRouter } from 'react-router-dom'

import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import Timer from './pages/Timer'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import About from './pages/About'
import { useState } from 'react'
// TODO: Cross feature search thru ctrl + k

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Notifications position="top-right" />
      <HashRouter>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <main className="flex-1 h-screen overflow-y-auto">
            {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
            {activePage === 'tasks' && <Tasks />}
            {activePage === 'notes' && <Notes />}
            {activePage === 'timer' && <Timer />}
            {activePage === 'calendar' && <Calendar />}
            {activePage === 'settings' && <Settings />}
            {activePage === 'about' && <About />}
          </main>
        </div>
      </HashRouter>
    </div>
  )
}
