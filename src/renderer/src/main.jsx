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
import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { useLocalStorage } from './hooks/useLocalStorage'

const colorSchemeManager = localStorageColorSchemeManager({ key: 'colorScheme' })

function ThemedApp() {
  const [accentColor] = useLocalStorage('accentColor', 'violet')

  const theme = createTheme({
    primaryColor: accentColor
  })

  return (
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="dark"
    >
      <App />
    </MantineProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>
)
