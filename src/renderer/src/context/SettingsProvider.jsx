import { SettingsContext } from './SettingsContext'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
// Bugs in Tasks
const DEFAULTS = {
  accentColor: 'violet',
  defaultPriority: 'low',
  showCompleted: true,
  weekStartsOn: 'sunday',
  timeFormat: '12h'
}

export default function SettingsProvider({ children }) {
  const [accentColor, setAccentColorState] = useState(DEFAULTS.accentColor)
  const [defaultPriority, setDefaultPriorityState] = useState(DEFAULTS.defaultPriority)
  const [showCompleted, setShowCompletedState] = useState(DEFAULTS.showCompleted)
  const [weekStartsOn, setWeekStartsOnState] = useState(DEFAULTS.weekStartsOn)
  const [timeFormat, setTimeFormatState] = useState(DEFAULTS.timeFormat)

  useEffect(() => {
    window.api.settings
      .getAll()
      .then((saved) => {
        if (saved.accentColor) setAccentColorState(saved.accentColor)
        if (saved.defaultPriority) setDefaultPriorityState(saved.defaultPriority)
        if (saved.showCompleted !== undefined) setShowCompletedState(saved.showCompleted === 'true')
        if (saved.weekStartsOn) setWeekStartsOnState(saved.weekStartsOn)
        if (saved.timeFormat) setTimeFormatState(saved.timeFormat)
      })
      .catch((err) => console.error('Failed to load settings: ', err))
  }, [])
  async function setAccentColor(value) {
    await window.api.settings.set('accentColor', value)
    setAccentColorState(value)
  }

  async function setDefaultPriority(value) {
    await window.api.settings.set('defaultPriority', value)
    setDefaultPriorityState(value)
  }

  async function setShowCompleted(value) {
    await window.api.settings.set('showCompleted', value)
    setShowCompletedState(value)
  }

  async function setWeekStartsOn(value) {
    await window.api.settings.set('weekStartsOn', value)
    setWeekStartsOnState(value)
  }
  async function setTimeFormat(value) {
    await window.api.settings.set('timeFormat', value)
    setTimeFormatState(value)
  }

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
