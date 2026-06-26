import { SettingsContext } from './SettingsContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PropTypes from 'prop-types'

export default function SettingsProvider({ children }) {
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
        setDefaultPriority,
        showCompleted,
        setShowCompleted,
        weekStartsOn,
        setWeekStartsOn,
        timeFormat,
        setTimeFormat
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

SettingsProvider.propTypes = {
  children: PropTypes.node
}
