// src/renderer/src/context/SettingsContext.jsx
import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PropTypes from 'prop-types'

const SettingsContext = createContext()


export function SettingsProvider({ children }) {
  const [accentColor, setAccentColor] = useLocalStorage('accentColor', 'violet')
  const [defaultPriority, setDefaultPriority] = useLocalStorage('defaultPriority', 'low')
  const [showCompleted, setShowCompleted] = useLocalStorage('showCompleted', true)
  const [weekStartsOn, setWeekStartsOn] = useLocalStorage('weekStartsOn', 'sunday')
  const [timeFormat, setTimeFormat] = useLocalStorage('timeFormat', '12h')

  return (
    <SettingsContext.Provider
      value={{
        accentColor,
        setAccentColor,
        defaultPriority,
        weekStartsOn,
        timeFormat,
        setDefaultPriority,
        showCompleted,
        setShowCompleted,
        setWeekStartsOn,
        setTimeFormat
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
SettingsProvider.prototype = {
  children: PropTypes.array
}

export function useSettings() {
  return useContext(SettingsContext)
}
