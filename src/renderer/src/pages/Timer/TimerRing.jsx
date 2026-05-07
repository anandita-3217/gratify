// TimerRing.jsx
// SVG circular progress ring + time display in center
// props:
//   seconds      — current seconds remaining
//   totalSeconds — full duration (for progress calculation)
//   isRunning    — drives breathing animation
// import useTimer from "./useTimer"

import {Box, RingProgress, Stack, Text } from '@mantine/core'

export default function TimerRing({ seconds=1500, totalSeconds=1500, isRunning=false }) {
  
  const progress = totalSeconds === 0 ? 0 :Math.round((seconds/totalSeconds) * 100 )

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2,'0')
  
  return (
    <Stack align="center" justify="center">
      <RingProgress size={300} thickness={14} sections={[{value: progress, color: "pink"}]} label={
        <Stack align="center" gap={0}>
          <Text size="2.5rem" fw={700} ta="center">{minutes}:{secs}</Text>
        </Stack>
      }/>
    </Stack>
  )
}