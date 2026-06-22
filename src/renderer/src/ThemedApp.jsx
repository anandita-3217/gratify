import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import App from './App'
import { SettingsProvider, useSettings } from './context/SettingsContext'

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
