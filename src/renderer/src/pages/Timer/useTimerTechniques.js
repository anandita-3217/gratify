/*
 * @typedef {Object} Technique
 * @property {string} label                        // 'pomodoro' | '52/17' | 'custom'
 * @property {string} name                         // display name e.g. 'Pomodoro'
 * @property {number} work                         // minutes
 * @property {number} shortBreak                   // minutes
 * @property {number | null} longBreak             // minutes, null for 52/17
 * @property {number | null} cyclesBeforeLongBreak // null for 52/17
 *
 * @typedef {Object} TimerTechniquesState  
 * @property {string} technique                    // current technique key
 * @property {Object.<string, Technique>} settings // all technique settings
 * @property {number | null} cyclesBeforeLongBreak // shortcut to current technique's value
 * @property {function} getPhaseSeconds            // (phase) => seconds
 * @property {function} setTechnique
 * @property {function} updateSettings
 */

import { useLocalStorage } from "../../hooks/useLocalStorage"
import { useState } from "react"

const TECHNIQUES = {
  pomodoro: {name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15, cyclesBeforeLongBreak: 4 },
  '52/17': {name: '52/17', work: 52, shortBreak: 17, longBreak: null, cyclesBeforeLongBreak: null },
}

export default function useTimerTechniques(){

  const [technique, setTechnique] = useLocalStorage('technique','pomodoro')
  const [settings, setSettings] = useLocalStorage('timerSettings', TECHNIQUES)
  const cyclesBeforeLongBreak = settings[technique].cyclesBeforeLongBreak

  function getPhaseSeconds(phase){
    const duration = settings[technique][phase]
    if(!duration) return 0
    return duration * 60
  }

  function addCustomTechnique(name, work, shortBreak, longBreak, cyclesBeforeLongBreak) {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    setSettings (prev => ({
      ...prev,
      [key] : { name, work, shortBreak, longBreak, cyclesBeforeLongBreak }
    }))
    setTechnique(key)
  }

  function updateSettings(techniqueKey, newValues){
    setSettings(prev => ({
      ...prev, [techniqueKey]: {...prev[techniqueKey], ...newValues}
    }))
  }

  return {technique, setTechnique, settings, updateSettings, cyclesBeforeLongBreak, getPhaseSeconds, addCustomTechnique, TECHNIQUES}
}