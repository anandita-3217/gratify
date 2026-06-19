import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import App from './App'
import { useLocalStorage } from './hooks/useLocalStorage'

const colorSchemeManager = localStorageColorSchemeManager({ key: 'colorScheme' })

export default function ThemedApp() {
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
