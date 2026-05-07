// TimerRing.jsx
// SVG circular progress ring + time display in center
// props:
//   seconds      — current seconds remaining
//   totalSeconds — full duration (for progress calculation)
//   isRunning    — drives breathing animation
import useTimer from "./useTimer"

export default function TimerRing({ seconds, totalSeconds, isRunning }) {
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const progress = seconds / totalSeconds 
  const strokeDashoffset = circumference * (1 -progress)

  const minutes = Math.floor(seconds/60).toString().padStart(2,'0')
  const secs = (seconds % 60).toString().padStart(2,'0')
  
  return (
    <div className={`relative flex items-center justify-center ${isRunning ? 'animate-pulse' : ''}`}>
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* background ring — always full circle, dimmed */}

        {/* progress ring — shrinks as time runs out */}
        {/* needs: strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} */}
        {/* needs: stroke="pink", strokeLinecap="round" */}
        {/* needs: transform="rotate(-90 150 150)" to start from top */}
        {/* needs: transition style for smooth animation */}
        {/* needs: fill="none" */}

      </svg>

      {/* time display — centered absolutely over the SVG */}
      {/* show MM:SS in large text */}
      {/* show a label below like "Focus" or "Break" */}

    </div>
  )
}