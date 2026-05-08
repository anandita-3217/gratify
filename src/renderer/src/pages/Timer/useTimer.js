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

export default function useTimer(){
    const [isRunning, setIsRunning] = useState(false)
    const [seconds, setSeconds] = useState(60)
    const [totalSeconds, setTotalSeconds] = useState(60)
    const [resetKey, setResetKey] = useState(0)
    const secondsRef = useRef(seconds)
   
    useEffect(() => {
        secondsRef.current = seconds
    },[seconds])

    useEffect(() => {
        if(!isRunning) return
        const interval = setInterval(() => {
            if(secondsRef.current <= 0){
                setIsRunning(false)
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
    }
    function handleTimeUp(){
        // TODO: should handle clean up and notif and play sound after the timer is up 
    }
    return {seconds, totalSeconds, isRunning, resetKey, start, stop, pause, reset, setDuration}
}