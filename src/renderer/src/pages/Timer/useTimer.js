/*
 * Techniques:
 * pomodoro: work 25, shortBreak 5, longBreak 15, sessionsBeforeLongBreak 4
 * 52/17: work 52, shortBreak 17, no longBreak, sessionsBeforeLongBreak: null
 * custom: user defined
 */

/*
 * @typedef {Object} TimerSession
 * @property {number} id                          // timestamp
 * @property {'basic' | 'technique'} mode
 * @property {'pomodoro' | '52/17' | 'custom'} technique  // null if basic
 * @property {'work' | 'shortBreak' | 'longBreak'} phase  // null if basic
 * @property {number} duration                    // seconds
 * @property {number} completedAt                 // timestamp
 *
 * @typedef {Object} TimerSettings
 * @property {number} work                        // minutes
 * @property {number} shortBreak                  // minutes
 * @property {number} longBreak                   // minutes
 * @property {number | null} sessionsBeforeLongBreak
 *
 * @typedef {Object} TimerState
 * @property {'basic' | 'technique'} mode
 * @property {'pomodoro' | '52/17' | 'custom'} technique
 * @property {'work' | 'shortBreak' | 'longBreak'} phase
 * @property {number} secondsRemaining
 * @property {boolean} isRunning
 * @property {number} cyclesCompleted
 * @property {TimerSettings} settings
 */


import { useState, useEffect, useRef, use } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const TECHNIQUES = {
  pomodoro: { name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 },
  '52/17': { name: '52/17', work: 52, shortBreak: 17, longBreak: null, sessionsBeforeLongBreak: null },
  custom: { name: 'Custom', work: 25, shortBreak: 5, longBreak: 15, sessionsBeforeLongBreak: 4 }
}

export default function useTimer() {
    // ── Mode ────────────────────────────────────────────────
    // 'basic' = plain countdown timer
    // 'technique' = pomodoro/52-17/custom with phases
    const [mode, setMode] = useState('basic')
    // ── Basic timer ─────────────────────────────────────────
    const [basicSeconds, setBasicSeconds] = useState(25*60)
    // ── Technique timer ──────────────────────────────────────
    const [technique, setTechnique] = useState('pomodoro')
    const [phase, setPhase] = useState('work')
    
    const [cyclesCompleted, setCyclesCompleted] = useLocalStorage('cyclesCompleted', 0)
    const [settings, setSettings] = useLocalStorage('timerSettings', TECHNIQUES)
    // ── Shared ───────────────────────────────────────────────
    const [secondsRemaining, setSecondsRemaining] = useState(TECHNIQUES['pomodoro'].work * 60)
    const [isRunning, setIsRunning] = useState(false)

    const cyclesBeforeLongBreak = settings[technique].sessionsBeforeLongBreak

    const secondsRef = useRef(secondsRemaining)

    useEffect(() => {
        secondsRef.current = secondsRemaining
    },[secondsRemaining])

    useEffect(() => {
        if(!isRunning) return
        const interval = setInterval(() => {
            if (secondsRef.current <= 0){
                if(mode === 'basic') handleBasicComplete()
                else handlePhaseComplete()
                // play sound
                // notify
                clearInterval(interval)
                return
            }
            setSecondsRemaining(s => s - 1)
        }, 1000);
        return () => clearInterval(interval)
    },[isRunning])

    function handleBasicComplete(){
        setIsRunning(false)
        setSecondsRemaining(0)
         // play sound + notify will go here
    }

    function handlePhaseComplete(){
        setIsRunning(false)
        if(phase === 'work'){
            const newCycles = cyclesCompleted + 1
            setCyclesCompleted(newCycles)
            if (newCycles % cyclesBeforeLongBreak === 0){
                setPhase('longBreak')
                setSecondsRemaining(settings[technique].longBreak * 60)
            } else{
                setPhase('shortBreak')
                setSecondsRemaining(settings[technique].shortBreak * 60)
            }

        }else {
            setPhase('work')
            setSecondsRemaining(settings[technique].work * 60)
        }

    }
    // ── Controls ─────────────────────────────────────────────
    function start(){
        setIsRunning(true)
    }

    function stop(){
        setIsRunning(false)
        setSecondsRemaining(0)
    }

    function skip(){
        if(mode !== 'technique') return
        setPhase('shortBreak')
    }
    
    function pause(){
        setIsRunning(false)
    }
    
    function reset(){
        // setIsRunning(false)
        // if basic mode: reset to basicSeconds
        // if technique mode: reset to current phase duration
        setIsRunning(false)
        if(mode === 'basic') {
            setSecondsRemaining(basicSeconds)
        }
        else {
            setPhase('work')
            setSecondsRemaining(settings[technique].work * 60)
        }
    }

    function updateSettings(newSettings){
        // merge newSettings into settings
        setSettings(prev => ({ ...prev, ...newSettings}))
        if(technique === 'custom'){
            setSecondsRemaining(newSettings.custom?.work * 60 ?? secondsRemaining)
        }
        // if current technique is custom, update secondsRemaining too
    }

    function getTotalSeconds(){
        if (mode === 'basic') return basicSeconds
        if(phase === 'work') return settings[technique].work * 60
        if(phase === 'shortBreak') return settings[technique].shortBreak * 60
        if(phase === 'longBreak') return settings[technique].longBreak * 60
        // returns total seconds for current phase or basicSeconds
        // used by TimerRing to calculate progress percentage
    }

    return {
        mode, setMode,
        basicSeconds, setBasicSeconds,
        technique, setTechnique,
        phase,
        cyclesCompleted,
        secondsRemaining,
        isRunning,
        settings, updateSettings,
        start, stop, pause, skip, reset,
        getTotalSeconds,
        TECHNIQUES
    }
}