import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import App from './App'
import SettingsProvider from './context/SettingsProvider'
import useSettings from './hooks/useSettings'

const colorSchemeManager = localStorageColorSchemeManager({ key: 'colorScheme' })

function MantineThemedApp() {
  const { accentColor } = useSettings()
  const theme = createTheme({ primaryColor: accentColor })

  return (
    <MantineProvider
      key={accentColor}
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="dark"
    >
      <App />
    </MantineProvider>
  )
}

export default function ThemedApp() {
  return (
    <SettingsProvider>
      <MantineThemedApp />
    </SettingsProvider>
  )
}
