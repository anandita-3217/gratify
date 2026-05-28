import { useLocalStorage } from "./useLocalStorage";

export default function useTimerPreferences(){
    const [sound, setSound] = useLocalStorage('timerSound', true)
    const [notifications, setNotifications] = useLocalStorage('timerNotifications', true)

    

    return {sound, setSound, notifications, setNotifications}

}