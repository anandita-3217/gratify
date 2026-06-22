// src/renderer/src/context/SettingsContext.jsx
import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SettingsContext = createContext()

// TODO: use async?

export function SettingsProvider({ children }) {
  const [accentColor, setAccentColor] = useLocalStorage('accentColor', 'violet')
  const [defaultPriority, setDefaultPriority] = useLocalStorage('defaultPriority', 'low')
  const [showCompleted, setShowCompleted] = useLocalStorage('showCompleted', true)

  return (
    <SettingsContext.Provider
      value={{
        accentColor,
        setAccentColor,
        defaultPriority,
        setDefaultPriority,
        showCompleted,
        setShowCompleted
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
