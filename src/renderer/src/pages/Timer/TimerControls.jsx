import { ActionIcon, Group, Stack, Text } from '@mantine/core'
import { Play, Pause, Square, RotateCcw, SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'
// import { TimeInput } from '@mantine/dates'
import PropTypes from 'prop-types'

const PRESETS = [
  { label: '25m', minutes: 25, seconds: 0 },
  { label: '45m', minutes: 45, seconds: 0 },
  { label: '60m', minutes: 60, seconds: 0 }
]

const INPUT_STYLES = {
  input: {
    fontSize: '2.5rem',
    fontWeight: 400,
    textAlign: 'center',
    width: '120px',
    background: 'transparent',
    border: 'none',
    borderRadius: '0',
    padding: '0 8px'
  }
}

export default function TimerControls({
  mode,
  isRunning,
  onStart,
  onPause,
  onSkip,
  onStop,
  onReset,
  onDurationChange,
  totalSeconds
}) {
  const [inputMinutes, setInputMinutes] = useState(20)
  const [inputSeconds, setInputSeconds] = useState(0)
  const [activePreset, setActivePreset] = useState('25m')

  useEffect(() => {
    if (!isRunning) {
      setInputMinutes(Math.floor(totalSeconds / 60))
      setInputSeconds(totalSeconds % 60)
    }
  }, [isRunning, totalSeconds])

  function handlePreset(preset) {
    setActivePreset(preset.label)
    setInputMinutes(preset.minutes)
    setInputSeconds(preset.seconds)
    onDurationChange(preset.minutes * 60)
  }

  function handleCustomChange(mins, secs) {
    setActivePreset(null)
    const total = mins * 60 + secs
    onDurationChange(total)
  }

  return (
    <>
      {!isRunning && mode === 'basic' && (
        <Stack align="center" gap="md">
          {/* DOesnt work for values greater than 24 */}
          <Group gap="xs" align="center">
            <input
              type="number"
              value={String(inputMinutes).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.min(180, Math.max(0, parseInt(e.target.value) || 0))
                setInputMinutes(val)
                handleCustomChange(val, inputSeconds)
              }}
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                textAlign: 'center',
                width: '90px',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid var(--mantine-color-pink-8)',
                borderRadius: 0,
                padding: '0 8px',
                color: 'inherit',
                outline: 'none'
              }}
            />
            <Text size="2.5rem" fw={700} c="pink">
              :
            </Text>
            <input
              type="number"
              value={String(inputSeconds).padStart(2, '0')}
              onChange={(e) => {
                const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
                setInputSeconds(val)
                handleCustomChange(inputMinutes, val)
              }}
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                textAlign: 'center',
                width: '90px',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid var(--mantine-color-pink-8)',
                borderRadius: 0,
                padding: '0 8px',
                color: 'inherit',
                outline: 'none'
              }}
            />
          </Group>
        </Stack>
      )}
      <Stack>
        <Group justify="center" gap="xl">
          {isRunning ? (
            <>
              <ActionIcon variant="filled"    size="xl" radius="xl" onClick={onPause}>
                {' '}
                <Pause size={16} />{' '}
              </ActionIcon>
              {mode === 'focus' ? (
                <ActionIcon variant="filled" color="teal" size="xl" radius="xl" onClick={onSkip}>
                  {' '}
                  <SkipForward size={16} />{' '}
                </ActionIcon>
              ) : (
                <ActionIcon variant="filled"    size="xl" radius="xl" onClick={onStop}>
                  {' '}
                  <Square size={16} />{' '}
                </ActionIcon>
              )}
            </>
          ) : (
            <ActionIcon variant="filled"    size="xl" radius="xl" onClick={onStart}>
              {' '}
              <Play size={16} />{' '}
            </ActionIcon>
          )}
          <ActionIcon variant="filled"    size="xl" radius="xl" onClick={onReset}>
            {' '}
            <RotateCcw size={16} />{' '}
          </ActionIcon>
        </Group>
      </Stack>
    </>
  )
}
TimerControls.propTypes = {
  mode: PropTypes.shape(),
  isRunning: PropTypes.bool,
  onStart: PropTypes.func,
  onPause: PropTypes.func,
  onSkip: PropTypes.func,
  onStop: PropTypes.func,
  onReset: PropTypes.func,
  onDurationChange: PropTypes.func,
  totalSeconds: PropTypes.number
}