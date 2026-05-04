/*
 * Techniques:
 * pomodoro: work 25, shortBreak 5, longBreak 15, sessionsBeforeLongBreak 4
 * 52/17: work 52, shortBreak 17, no longBreak, sessionsBeforeLongBreak: null
 * custom: user defined
 */

/*
* @typedef {Object} Timer
* @property {basic | technique} mode
* @property {'Pomodoro' | '52/17' | 'Custom'} technique          : 'Pomodoro' | '52/17' | 'Custom'
* @property {string} phase  : 'work' | 'shortBreak' | 'longBreak'
* @property {} secondsRemaining
* @property {boolean} isRunning
* @property {number} cyclesCompleted
* @property {Object} Settings
*/

// cycle — one full round of work + breaks
// phase — the current part (work / shortBreak / longBreak)



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
    const secondsRef = useRef(secondsRemaining)

    useEffect(() => {
        secondsRef.current = secondsRemaining
    },[secondsRemaining])

    useEffect(() => {
        if(!isRunning) return
        const interval = setInterval(() => {
            if (secondsRef.current <= 0){
                if(mode === 'basic') handlePhaseComplete()
                else handleBasicComplete()
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

    }

    function handlePhaseComplete(){
        // if phase was 'work':
        //   increment cyclesCompleted
        //   if cyclesCompleted % cyclesBeforeLongBreak === 0 → go to longBreak
        //   else → go to shortBreak
        // if phase was 'shortBreak' or 'longBreak':
        //   go back to work
        // set secondsRemaining to the new phase duration
        // setIsRunning(false) — user manually starts next phase
        if(phase === 'work'){
            cyclesCompleted += 1
            if (cyclesCompleted % cyclesBeforeLongBreak === 0){
                setPhase('longBreak')
            }

        }
        if (phase === 'shortBreak' || phase === 'longBreak') {
            setPhase('work')
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
        if(mode === 'basic') setBasicSeconds(25*60)
        if(mode === "technique") setPhase('work')

    }

    function updateSettings(newSettings){
        // merge newSettings into settings
        // if current technique is custom, update secondsRemaining too
    }

    function getTotalSeconds(){
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