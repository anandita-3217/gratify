// // TimerRing.jsx
// // SVG circular progress ring + time display in center
// // props:
// //   seconds      — current seconds remaining
// //   totalSeconds — full duration (for progress calculation)
// //   isRunning    — drives breathing animation
import useTimer from "./useTimer"
import { RingProgress, Stack, Text } from '@mantine/core'

const PHASE_COLOR = ['pink', 'teal', 'violet', 'orange', 'blue', 'green']

export default function TimerRing({ seconds, totalSeconds, isRunning, currentPhase, phaseIndex, mode, cyclesCompleted  }) {
  const color = mode === 'focus' ? (PHASE_COLOR[phaseIndex] ?? 'pink') : 'pink'
  const progress = totalSeconds === 0 ? 0 : (seconds / totalSeconds) * 100
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0')
  const ss = (seconds % 60).toString().padStart(2, '0')

  return (
    <Stack align="center" justify="center">
      <RingProgress
        size={280}
        thickness={12}
        roundCaps
        transitionDuration={1000}
        style={{ transitionTimingFunction: 'linear' }}
        sections={[{ value: progress, color }]}
        label={
          <Stack align='center'>
            {mode === 'focus' &&(
              <Text size='xs' c={PHASE_COLOR[phaseIndex]} tt='uppercase' fw={600} lts={1}>{currentPhase?.name ?? ''}</Text>
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