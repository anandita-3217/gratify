import { ActionIcon, Group, NumberInput, Stack } from '@mantine/core'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'


export default function TimerControls({ isRunning, onStart, onPause,  onStop,  onReset,minutes, onDurationChange}) {
    // start, pause, reset, skip buttons
    // props: isRunning, onStart, onPause, onReset, onSkip
    // buttons here
  return (
    <Stack align="center" gap="md">
      {!isRunning && (
        <NumberInput value={minutes} onChange={onDurationChange} min={1} max={180} ta="center"/>
      )}
      <Group justify='center' gap="xl">

      {isRunning ? (
        <ActionIcon variant="filled"size="xl" onClick={onPause}> <Pause size={16}/> </ActionIcon>
        
      ):(
        <ActionIcon variant="filled"size="xl" onClick={onStart}> <Play size={16}/> </ActionIcon>
        
      )}
        <ActionIcon variant="filled"size="xl" onClick={onStop}> <Square size={16}/> </ActionIcon>
        <ActionIcon variant="filled"size="xl" onClick={onReset}> <RotateCcw size={16}/> </ActionIcon>
      </Group>
    </Stack>
  )
}