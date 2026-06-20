import PropTypes from 'prop-types'
import useTimer from './useTimer'
import { RingProgress, Stack, Text, useMantineTheme } from '@mantine/core'

const PHASE_COLOR = ['red', 'teal', 'violet', 'orange', 'blue', 'green']

export default function TimerRing({
  seconds,
  totalSeconds,
  isRunning,
  currentPhase,
  phaseIndex,
  mode,
  cyclesCompleted
}) {
  const theme = useMantineTheme()
  const color =
    mode === 'focus' ? (PHASE_COLOR[phaseIndex] ?? theme.primaryColor) : theme.primaryColor // TODO: change this to be governed by the accent color in settings
  const progress = totalSeconds === 0 ? 0 : (seconds / totalSeconds) * 100
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
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
          <Stack align="center">
            {mode === 'focus' && (
              <Text size="xs" c={PHASE_COLOR[phaseIndex]} tt="uppercase" fw={600} lts={1}>
                {currentPhase?.name ?? ''}
              </Text>
            )}
            <Text size="2.5rem" fw={700} ta="center">
              {mm}:{ss}
            </Text>
          </Stack>
        }
      />
    </Stack>
  )
}
TimerRing.propTypes = {
  seconds: PropTypes.number,
  totalSeconds: PropTypes.func,
  isRunning: PropTypes.bool,
  currentPhase: PropTypes.string,
  phaseIndex: PropTypes.number,
  mode: PropTypes.shape(),
  cyclesCompleted: PropTypes.number
}
