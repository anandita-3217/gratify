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
  const [technique, setTechnique] = useLocalStorage('technique', 'pomodoro')

  // only user-created techniques in localStorage
  const [customTechniques, setCustomTechniques] = useState({})

  useEffect(() => {
    window.api.techniques
      .getAll()
      .then((rows) => {
        const asRecord = Object.fromEntries(rows.map((r) => [r.key, r]))
        setCustomTechniques(asRecord)
      })
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
  async function addCustomTechnique(name, phases, cyclesBeforeLongBreak) {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    const newTechnique = await window.api.techniques.add({
      key,
      name,
      phases,
      cyclesBeforeLongBreak
    })
    setCustomTechniques((prev) => ({ ...prev, [key]: newTechnique }))
  }

  async function deleteTechnique(key) {
    await window.api.techniques.remove(key)
    setCustomTechniques((prev) => prev.filter((t) => t.key !== key))
  }

  async function updateSettings(techniqueKey, newValues) {
    if (BUILT_IN_TECHNIQUES[techniqueKey]) return
    await editTechnique(techniqueKey, newValues)
  }

  function editTechnique(key, newValues) {
    if (BUILT_IN_TECHNIQUES[key]) return // can't edit built-ins
    setCustomTechniques((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...newValues }
    }))
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
