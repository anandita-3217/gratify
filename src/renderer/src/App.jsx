// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
// import Sidebar from './components/Sidebar'
// function App() {
//   const ipcHandle = () => window.electron.ipcRenderer.send('ping')

//   return (
//     <>
//       <img alt="logo" className="logo" src={electronLogo} />
//       <div className="creator">Powered by electron-vite</div>
//       <div className="text">
//         Build an Electron app with <span className="react">React</span>
//       </div>
//       <p className="tip">
//         Please try pressing <code>F12</code> to open the devTool
//       </p>
//       <div className="actions">
//         <div className="action">
          
//         </div>
//         <div className="action">
//           <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
//             Send IPC
//           </a>
//         </div>
//       </div>
//       <Versions></Versions>
//     </>
//   )
// }

// export default App


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
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" />
      <HashRouter>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'auto' }}>
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