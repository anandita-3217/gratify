/*
 * @typedef {Object} TimerState
 * @property {number} seconds          // current seconds remaining
 * @property {number} totalSeconds     // total seconds for current duration
 * @property {boolean} isRunning
 *
 * @typedef {Object} TimerControls
 * @property {function} start
 * @property {function} pause
 * @property {function} reset
 * @property {function} setDuration    // takes minutes, sets total and resets timer
 */

import { useEffect, useState, useRef } from "react";
import useTimerTechniques from "./useTimerTechniques";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function useTimer(){
    const {technique, setTechnique,
        settings,updateSettings,
        cyclesBeforeLongBreak, getPhaseSeconds, addCustomTechnique,
        TECHNIQUES, BUILT_IN_TECHNIQUES, deleteTechnique, editTechnique
    } = useTimerTechniques()
    
    const [mode, setMode] = useState('basic')
    const [phase, setPhase] = useState('work')
    const [isRunning, setIsRunning] = useState(false)
    const [basicDuration, setBasicDuration] = useState(60)

    const [seconds, setSeconds] = useState(basicDuration)
    const [totalSeconds, setTotalSeconds] = useState(basicDuration)
    const [cyclesCompleted, setCyclesCompleted] = useLocalStorage('cyclesCompleted', 0)
    const [resetKey, setResetKey] = useState(0)
    
    const modeRef = useRef(mode)
    const secondsRef = useRef(seconds)
    const phaseRef = useRef(phase)
    const cyclesRef = useRef(cyclesCompleted)

    useEffect(() => {
        secondsRef.current = seconds
    },[seconds])
    
    useEffect(() => {
        modeRef.current = mode
    },[mode])
    
    useEffect(() => {
        phaseRef.current = phase
    },[phase])
    
    useEffect(() => {
        cyclesRef.current = cyclesCompleted
    },[cyclesCompleted])

    useEffect(() => {
        if(mode === 'focus') {
            setPhase('work')
            const secs = getPhaseSeconds('work')
            setSeconds(secs)
            setTotalSeconds(secs)
            secondsRef.current = secs
            setIsRunning(false)
        }
    },[technique])
    
    useEffect(() => {
      if (mode === 'basic') {
        const secs = basicDuration
        setSeconds(secs)
        setTotalSeconds(secs)
        secondsRef.current = secs
      }
      else{
        const secs = getPhaseSeconds('work')
        setSeconds(secs)
        setTotalSeconds(secs)
        secondsRef.current = secs
        setPhase('work')
      }
    }, [mode])
   

    useEffect(() => {
        if(!isRunning) return
        const interval = setInterval(() => {
            if(secondsRef.current <= 0){
                if (modeRef.current === 'focus') handlePhaseComplete()
                else handleTimeUp()
                clearInterval(interval)
                return
            }
            setSeconds(s => s - 1) 
        }, 1000);
        return () => clearInterval(interval)
    },[isRunning])

    function start(){
        setIsRunning(true)
    }

    function stop(){
        setIsRunning(false)
        setSeconds(totalSeconds)
        secondsRef.current = totalSeconds
        setResetKey(k => k + 1)
    }

    function skip(){
        if(mode !== 'focus') return 
        handlePhaseComplete()
    }

    function pause(){
        setIsRunning(false)
    }

    function reset(){
        setIsRunning(false)
        setSeconds(totalSeconds)
        secondsRef.current = totalSeconds
        setResetKey(k => k + 1)
    }
    function setDuration(totalSecs){
        setSeconds(totalSecs)
        setTotalSeconds(totalSecs)
        secondsRef.current = totalSecs
        if (mode === 'basic') setBasicDuration(totalSecs)

    }
    
    function handlePhaseComplete(){
        setIsRunning(false)

        if(phaseRef.current === 'work'){
            const newCycles = cyclesRef.current + 1 
            setCyclesCompleted(newCycles)
            if(cyclesBeforeLongBreak && newCycles % cyclesBeforeLongBreak === 0){
                setPhase('longBreak')
                setDuration(getPhaseSeconds('longBreak'))
            } else{
                setPhase('shortBreak')
                setDuration(getPhaseSeconds('shortBreak'))
            }
        } else {
            setPhase('work')
            setDuration(getPhaseSeconds('work'))
        }
    }

    function handleTimeUp() {
      setIsRunning(false)
      // play sound + notify will go here
    }

    return {
        seconds, totalSeconds, isRunning, resetKey,
        mode, setMode,
        phase,
        cyclesCompleted,
        technique, setTechnique,
        settings, updateSettings,
        TECHNIQUES,
        start, stop, pause, reset, skip,
        setDuration, addCustomTechnique,
        BUILT_IN_TECHNIQUES, deleteTechnique, editTechnique
    }
}