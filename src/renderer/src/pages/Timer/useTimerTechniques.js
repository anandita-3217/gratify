// /*
//  * @typedef {Object} Technique
//  * @property {string} label                        // 'pomodoro' | '52/17' | 'custom'
//  * @property {string} name                         // display name e.g. 'Pomodoro'
//  * @property {number} work                         // minutes
//  * @property {number} shortBreak                   // minutes
//  * @property {number | null} longBreak             // minutes, null for 52/17
//  * @property {number | null} cyclesBeforeLongBreak // null for 52/17
//  *
//  * @typedef {Object} TimerTechniquesState  
//  * @property {string} technique                    // current technique key
//  * @property {Object.<string, Technique>} settings // all technique settings
//  * @property {number | null} cyclesBeforeLongBreak // shortcut to current technique's value
//  * @property {function} getPhaseSeconds            // (phase) => seconds
//  * @property {function} setTechnique
//  * @property {function} updateSettings
//  */

import { useLocalStorage } from "../../hooks/useLocalStorage"
import { useState } from "react"

// const BUILT_IN_TECHNIQUES = {
//   pomodoro: {name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15, cyclesBeforeLongBreak: 4 },
//   '52/17': {name: '52/17', work: 52, shortBreak: 17, longBreak: null, cyclesBeforeLongBreak: null },
// }

// export default function useTimerTechniques(){

//   const [technique, setTechnique] = useLocalStorage('technique','pomodoro')
  
//   const [customTechnique, setCustomTechnique] = useLocalStorage('customTechniques',{})
  
//   const settings = { ...customTechniques, ...BUILT_IN_TECHNIQUES }

  
//   const cyclesBeforeLongBreak = settings[technique].cyclesBeforeLongBreak

//   function getPhaseSeconds(phase){
//     const duration = settings[technique][phase]
//     if(!duration) return 0
//     return duration * 60
//   }

//   function addCustomTechnique(name, work, shortBreak, longBreak, cyclesBeforeLongBreak) {
//     const key = name.toLowerCase().replace(/\s+/g, '-')
//     setSettings (prev => ({
//       ...prev,
//       [key] : { name, work, shortBreak, longBreak, cyclesBeforeLongBreak }
//     }))
//     setTechnique(key)
//   }
//   function deleteTechnique(key) {
//   // don't allow deleting built-in techniques
//   if (key === 'pomodoro' || key === '52/17') return
//   setSettings(prev => {
//     const next = { ...prev }
//     delete next[key]
//     return next
//   })
//   // if currently on deleted technique, switch to pomodoro
//   if (technique === key) setTechnique('pomodoro')
// }

// function editTechnique(key, newValues) {
//   setSettings(prev => ({
//     ...prev,
//     [key]: { ...prev[key], ...newValues }
//   }))
// }
//   function updateSettings(techniqueKey, newValues){
//     setSettings(prev => ({
//       ...prev, [techniqueKey]: {...prev[techniqueKey], ...newValues}
//     }))
//   }

//   return {technique, setTechnique, settings, updateSettings, cyclesBeforeLongBreak, getPhaseSeconds, 
//     addCustomTechnique, editTechnique, deleteTechnique, TECHNIQUES}
// }
/**
 * // new technique shape
{
  name: 'My Technique',
  phases: [
    { name: 'Work', duration: 25 },
    { name: 'Short Break', duration: 5 },
    { name: 'Long Break', duration: 15 },
  ]
}
 */

const BUILT_IN_TECHNIQUES = {
  pomodoro: {
    name: 'Pomodoro',
    phases: [
      { name: 'Work', duration: 25 },
      { name: 'Short Break', duration: 5 },
      { name: 'Long Break', duration: 15 },
    ],
    cyclesBeforeLongBreak: 4
  },
  '52/17': {
    name: '52/17',
    phases: [
      { name: 'Work', duration: 52 },
      { name: 'Short Break', duration: 17 },
    ],
    cyclesBeforeLongBreak: null
  },

}

export default function useTimerTechniques() {
  const [technique, setTechnique] = useLocalStorage('technique', 'pomodoro')
  
  // only user-created techniques in localStorage
  const [customTechniques, setCustomTechniques] = useLocalStorage('customTechniques', {})

  // merge built-ins with user-created — built-ins always win on conflict
  const settings = { ...customTechniques, ...BUILT_IN_TECHNIQUES }

  const cyclesBeforeLongBreak = settings[technique]?.cyclesBeforeLongBreak

  function getPhaseSeconds(phase) {
    const duration = settings[technique]?.[phase]
    if (!duration) return 0
    return duration * 60
  }

  function addCustomTechnique(name, work, shortBreak, longBreak, cyclesBeforeLongBreak) {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    setCustomTechniques(prev => ({
      ...prev,
      [key]: { name, work, shortBreak, longBreak, cyclesBeforeLongBreak }
    }))
    setTechnique(key)
  }

  function deleteTechnique(key) {
    if (BUILT_IN_TECHNIQUES[key]) return // can't delete built-ins
    setCustomTechniques(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (technique === key) setTechnique('pomodoro')
  }

  function editTechnique(key, newValues) {
    if (BUILT_IN_TECHNIQUES[key]) return // can't edit built-ins
    setCustomTechniques(prev => ({
      ...prev,
      [key]: { ...prev[key], ...newValues }
    }))
  }

  function updateSettings(techniqueKey, newValues) {
    if (BUILT_IN_TECHNIQUES[techniqueKey]) return
    editTechnique(techniqueKey, newValues)
  }

  return {
    technique, setTechnique,
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