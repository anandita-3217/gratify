// import './assets/main.css'
// import { MantineProvider } from '@mantine/core'

// import '@mantine/core/styles.css'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <MantineProvider defaultColorScheme="dark" theme={{ primaryColor: 'violet' }}>
//       <App />
//     </MantineProvider>
//   </StrictMode>
// )

import './assets/main.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemedApp from './ThemedApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>
)
