/*
 * Techniques:
 * pomodoro: work 25, shortBreak 5, longBreak 15, sessionsBeforeLongBreak 4
 * 52/17: work 52, shortBreak 17, no longBreak, sessionsBeforeLongBreak: null
 * custom: user defined
 */

import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const TECHNIQUES = {
  pomodoro: { name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 },
  '52/17': { name: '52/17', work: 52, shortBreak: 17, longBreak: null, sessionsBeforeLongBreak: null },
  custom: { name: 'Custom', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 }
}

export default function useTimer() {
  // current technique
  // session type: 'work' | 'shortBreak' | 'longBreak'
  // seconds remaining
  // is running
  // completed sessions count — save to localStorage for stats
  // settings (durations per technique) — save to localStorage

  // useEffect for the interval — same pattern as task reminders
  // when seconds hit 0: handle session complete, play sound, notify

  // handleSessionComplete — figure out next session type
  // based on completedSessions and sessionsBeforeLongBreak

  // return everything the UI needs
  return {
    // technique, setTechnique
    // sessionType
    // seconds
    // isRunning
    // completedSessions
    // settings, updateSettings
    // start, pause, reset, skip
  }
}