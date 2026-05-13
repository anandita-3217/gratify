// // TimerRing.jsx
// // SVG circular progress ring + time display in center
// // props:
// //   seconds      — current seconds remaining
// //   totalSeconds — full duration (for progress calculation)
// //   isRunning    — drives breathing animation
// // import useTimer from "./useTimer"

// import {Box, RingProgress, Stack, Text } from '@mantine/core'


// export default function TimerRing({ seconds, totalSeconds, isRunning, phase, mode }) {
//   const phaseColor = mode === 'focus' ? phase === 'work' ? 'pink' : phase === 'shortBreak' ? 'teal' : 'violet' : 'pink'
  
//   const progress = totalSeconds === 0 ? 0 :(seconds/totalSeconds) * 100 

//   const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
//   const secs = (seconds % 60).toString().padStart(2,'0')
  
//   return (
//     <Stack align="center" justify="center">
//       <RingProgress 
//       size={300} 
//       thickness={14} 
//       roundCaps
//       transitionDuration={1000}
//       style={{
//         //  animation: isRunning ? 'breathe 1s ease-in-out infinite' : 'none',
//         transitionTimingFunction: 'linear' }}
//       sections={[{value: progress, color: phaseColor}]} 
//       label={
//         <Stack align="center" gap={0}>
//           <Text size="2.5rem" fw={700} ta="center">{minutes}:{secs}</Text>
//         </Stack>
//       }/>
//     </Stack>
//   )
// }

import { RingProgress, Stack, Text } from '@mantine/core'

const PHASE_COLOR = {
  work: 'pink',
  shortBreak: 'teal',
  longBreak: 'violet',
}
const PHASE_LABEL = { work: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' }



export default function TimerRing({ seconds, totalSeconds, isRunning, phase, mode, cyclesCompleted  }) {
  const color = mode === 'focus' ? (PHASE_COLOR[phase] ?? 'pink') : 'pink'
  const progress = totalSeconds === 0 ? 0 : (seconds / totalSeconds) * 100
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0')
  const ss = (seconds % 60).toString().padStart(2, '0')

  return (
    <Stack align="center" justify="center">
      <RingProgress
        size={300}
        thickness={14}
        roundCaps
        transitionDuration={1000}
        style={{ transitionTimingFunction: 'linear' }}
        sections={[{ value: progress, color }]}
        label={
          <Stack align='center'>
            {mode === 'focus' &&(
              <Text size='xs' c={PHASE_COLOR[phase]} tt='uppercase' fw={600} lts={1}>{PHASE_LABEL[phase]}</Text>
            )}
            <Text size="2.5rem" fw={700} ta="center">
              {mm}:{ss}
            </Text>
            {mode === 'focus' &&(
              <Text size='xs' c="dimmed">cycle: {cyclesCompleted + 1}</Text>
            )}
          </Stack>
        }
      />
    </Stack>
  )
}