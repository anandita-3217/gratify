// useTimerTechniques.js
// owns: TECHNIQUES constant, settings state, technique state
// exposes: technique, setTechnique, settings, updateSettings,
//          getPhaseSeconds(technique, phase), cyclesBeforeLongBreak

import { useLocalStorage } from '../../hooks/useLocalStorage'

export const TECHNIQUES = {
  pomodoro: { name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 },
  '52/17': { name: '52/17', work: 52, shortBreak: 17, longBreak: null, sessionsBeforeLongBreak: null },
  custom: { name: 'Custom', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 }
}

export default function useTimerTechniques() {
  const [technique, setTechnique] = useLocalStorage('technique', 'pomodoro')
  const [settings, setSettings] = useLocalStorage('timerSettings', TECHNIQUES)

  function updateSettings(newSettings) {
    // merge newSettings into settings
    setSettings(prev => ({ ...prev, ...newSettings}))
        if(technique === 'custom'){
          setSecondsRemaining(newSettings.custom?.work * 60 ?? secondsRemaining)
    }
  }

  function getPhaseSeconds(phase) {
    // returns seconds for given phase under current technique
    // hint: settings[technique][phase] * 60
    const seconds = settings[technique][phase] * 60
    // handle null longBreak for 52/17
    if (technique == '52/17'){
      const seconds = 0
    }    
    return seconds
  }

  const cyclesBeforeLongBreak = settings[technique].sessionsBeforeLongBreak

  return {
    technique, setTechnique,
    settings, updateSettings,
    getPhaseSeconds,
    cyclesBeforeLongBreak,
    TECHNIQUES
  }
}