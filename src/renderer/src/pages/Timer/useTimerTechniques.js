import { useEffect, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const BUILT_IN_TECHNIQUES = {
  pomodoro: {
    name: 'Pomodoro',
    phases: [
      { name: 'Work', duration: 25 * 60 },
      { name: 'Short Break', duration: 5 * 60 },
      { name: 'Long Break', duration: 15 * 60 }
    ],
    cyclesBeforeLongBreak: 4
  },
  '52/17': {
    name: '52/17',
    phases: [
      { name: 'Work', duration: 52 * 60 },
      { name: 'Short Break', duration: 17 * 60 }
    ],
    cyclesBeforeLongBreak: null
  }
}

export default function useTimerTechniques() {
  const [technique, setTechnique] = useState({})

  // only user-created techniques in localStorage
  const [customTechniques, setCustomTechniques] = useState({})

  useEffect(() => {
    window.api.techniques
      .getAll()
      .then(setTechnique)
      .catch((err) => console.error('Failed to load techniques: ', err))
  }, [])

  // merge built-ins with user-created — built-ins always win on conflict
  const settings = { ...customTechniques, ...BUILT_IN_TECHNIQUES }

  const cyclesBeforeLongBreak = settings[technique]?.cyclesBeforeLongBreak

  function getPhaseSeconds(phaseIndex) {
    const phases = settings[technique]?.phases
    if (!phases || !phases[phaseIndex]) return 0
    return phases[phaseIndex].duration
  }

  function addCustomTechnique(name, phases, cyclesBeforeLongBreak) {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    setCustomTechniques((prev) => ({
      ...prev,
      [key]: { name, phases, cyclesBeforeLongBreak }
    }))
    setTechnique(key)
  }

  function deleteTechnique(key) {
    if (BUILT_IN_TECHNIQUES[key]) return // can't delete built-ins
    setCustomTechniques((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (technique === key) setTechnique('pomodoro')
  }

  function editTechnique(key, newValues) {
    if (BUILT_IN_TECHNIQUES[key]) return // can't edit built-ins
    setCustomTechniques((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...newValues }
    }))
  }

  function updateSettings(techniqueKey, newValues) {
    if (BUILT_IN_TECHNIQUES[techniqueKey]) return
    editTechnique(techniqueKey, newValues)
  }

  return {
    technique,
    setTechnique,
    settings,
    cyclesBeforeLongBreak,
    getPhaseSeconds,
    addCustomTechnique,
    deleteTechnique,
    editTechnique,
    updateSettings,
    TECHNIQUES: settings,
    BUILT_IN_TECHNIQUES
  }
}
