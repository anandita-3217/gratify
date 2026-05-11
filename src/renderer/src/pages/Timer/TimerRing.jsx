// TimerRing.jsx
// SVG circular progress ring + time display in center
// props:
//   seconds      — current seconds remaining
//   totalSeconds — full duration (for progress calculation)
//   isRunning    — drives breathing animation
// import useTimer from "./useTimer"

import {Box, RingProgress, Stack, Text } from '@mantine/core'


export default function TimerRing({ seconds, totalSeconds, isRunning, phase, mode }) {
  const phaseColor = mode === 'focus' ? phase === 'work' ? 'pink' : phase === 'shortBreak' ? 'teal' : 'violet' : 'pink'
  
  const progress = totalSeconds === 0 ? 0 :(seconds/totalSeconds) * 100 

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2,'0')
  
  return (
    <Stack align="center" justify="center">
            <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); } /* Subtle expansion */
          100% { transform: scale(1); }
        }
      `}</style>
      <RingProgress 
      size={300} 
      thickness={14} 
      roundCaps
      transitionDuration={1000}
      style={{
        //  animation: isRunning ? 'breathe 1s ease-in-out infinite' : 'none',
        transitionTimingFunction: 'linear' }}
      sections={[{value: progress, color: phaseColor}]} 
      label={
        <Stack align="center" gap={0}>
          <Text size="2.5rem" fw={700} ta="center">{minutes}:{secs}</Text>
        </Stack>
      }/>
    </Stack>
  )
}