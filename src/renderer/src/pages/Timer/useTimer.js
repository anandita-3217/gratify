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
import useNotifications from "../../hooks/useNotifications";
import useTimerPreferences from "../../hooks/useTimerPreferences";

export default function useTimer(){
    
    const {technique, setTechnique,
        settings,updateSettings,
        cyclesBeforeLongBreak, getPhaseSeconds, addCustomTechnique,
        TECHNIQUES, BUILT_IN_TECHNIQUES, deleteTechnique, editTechnique
    } = useTimerTechniques()

    const {sound, notifications} = useTimerPreferences()
    const {notify} = useNotifications()
    
    const [mode, setMode] = useState('basic')
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [basicDuration, setBasicDuration] = useState(1200)

    const [seconds, setSeconds] = useState(basicDuration)
    const [totalSeconds, setTotalSeconds] = useState(basicDuration)
    const [cyclesCompleted, setCyclesCompleted] = useLocalStorage('cyclesCompleted', 0)
    const [resetKey, setResetKey] = useState(0)
    
    const currentPhase = settings[technique]?.phases?.[phaseIndex]
    const modeRef = useRef(mode)
    const secondsRef = useRef(seconds)
    const phaseIndexRef  = useRef(phaseIndex)
    const cyclesRef = useRef(cyclesCompleted)

    useEffect(() => {
        secondsRef.current = seconds
    },[seconds])
    
    useEffect(() => {
        modeRef.current = mode
    },[mode])
    
    useEffect(() => {
        phaseIndexRef.current = phaseIndex
    },[phaseIndex])
    
    useEffect(() => {
        cyclesRef.current = cyclesCompleted
    },[cyclesCompleted])

    useEffect(() => {
        if(mode === 'focus') {
            setPhaseIndex(0)
            const secs = getPhaseSeconds(0)
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
        const secs = getPhaseSeconds(0)
        setSeconds(secs)
        setTotalSeconds(secs)
        secondsRef.current = secs
        setPhaseIndex(0)
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


    function playSound(){
        try{
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.value = 520
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.8)
        }
        catch(err){
            console.error("An Error occured: ", err);
            
        }
    }

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
        const phases =  settings[technique]?.phases ?? []
        const nextIndex = phaseIndexRef.current + 1
        const nextPhase = phases[nextIndex] ?? phases[0]
        if (sound) playSound()
        if (notifications) notify({
            title: `${currentPhase?.name ?? 'Phase'} complete!`,
            message: nextPhase ? `Up next :${nextPhase.name}` : 'Cycle complete',
            color: 'purple',
            sound: false
        })
            if(nextIndex >= phases.length){
            setCyclesCompleted(c => c + 1)
            setPhaseIndex(0)
            setDuration(getPhaseSeconds(0))
        } else {
            setPhaseIndex(nextIndex)
            setDuration(getPhaseSeconds(nextIndex))
        }
    }

    function handleTimeUp() {
      setIsRunning(false)
      if(sound) playSound()
        if (notifications) notify({
            title: 'Timer complete!',
            message: 'Time up!',
            color: 'pink',
            sound: false
        })
    // play sound + notify will go here
    }

    return {
        seconds, totalSeconds, isRunning, resetKey,
        mode, setMode,
        phaseIndex, setPhaseIndex,
        currentPhase,
        cyclesCompleted,
        technique, setTechnique,
        settings, updateSettings,
        TECHNIQUES,
        start, stop, pause, reset, skip,
        setDuration, addCustomTechnique,
        BUILT_IN_TECHNIQUES, deleteTechnique, editTechnique
    }
}