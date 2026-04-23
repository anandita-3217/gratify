import { notifications  } from '@mantine/notifications'
import { useEffect } from 'react'

function playSound() {
    // 1. create an AudioContext
    const audio = new AudioContext()
    // 2. create an oscillator and a gain node
    const oscillator = audio.createOscillator()
    // 3. connect them: osc → gain → ctx.destination
    const gain = audio.createGain()
    oscillator.connect(gain)
    gain.connect(audio.destination)
    // 4. set the frequency to 520 and type to 'sine'
    oscillator.frequency.value = 520
    oscillator.type = 'sine'
    // 5.1 set volume to 0.3 right now
    gain.gain.setValueAtTime(0.3,audio.currentTime)
    // 5.2 set the gain to fade out over 0.8 seconds
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.8)
  // 6. start and stop the oscillator
  oscillator.start(audio.currentTime)
  oscillator.stop(audio.currentTime + 0.5)
}

export default function useNotifications() {
    
    useEffect(()=>{
        // request notification permission here
        if (window.Notification && window.Notification.permission === 'default') {
            window.Notification.requestPermission()
        }
    },[])
    
    function notify({ title, message, color = "pink", sound = true }){
        // 1. show a Mantine toast with notifications.show()
        notifications.show({title, message, color, autoClose: 8000})
        // 2. if Notification.permission === 'granted', fire a desktop notification
        if (window.Notification && window.Notification.permission === 'granted') {
            new window.Notification(title, { body: message })
        }
        // 3. if sound is true, call playSound()
        if (sound)playSound()
    }
    
    return { notify }
}