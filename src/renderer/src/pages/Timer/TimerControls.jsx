import { ActionIcon, Group, NumberInput, Stack, Text } from '@mantine/core'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'


const PRESETS = [
  {label: '1m', minutes: 1, seconds: 0},
  {label: '5m', minutes: 5, seconds: 0},
  {label: '10m', minutes: 10, seconds: 0},
  {label: '25m', minutes: 25, seconds: 0},
  {label: '45m', minutes: 45, seconds: 0},
  {label: '60m', minutes: 60, seconds: 0},
]

export default function TimerControls({ isRunning, onStart, onPause,  onStop,  onReset,minutes, onDurationChange, totalSeconds}) {
    const [inputMinutes, setInputMinutes] = useState(25)
    const [inputSeconds, setInputSeconds] = useState(0)
    const [activePreset, setActivePreset] = useState('25m')

    useEffect(() => {
      if(!isRunning){
        setInputMinutes(Math.floor(totalSeconds/60))
        setInputSeconds(totalSeconds % 60)
      }
    },[isRunning, totalSeconds])

    function handlePreset(preset){
      setActivePreset(preset.label)
      setInputMinutes(preset.minutes)
      setInputSeconds(preset.seconds)
      onDurationChange(preset.minutes * 60)
    }


    function handleCustomChange(mins, secs){
      setActivePreset(null)
      const total = (mins * 60) + secs
      onDurationChange(total)
    }

  return (
    <Stack align="center" gap="md">
      {!isRunning && (
        <Stack align='center' gap="sm">
          <Group gap='xs'>
            {PRESETS.map(p => (
              <ActionIcon key={p.label} variant={ activePreset === p.label ? 'filled' : 'light'} 
              color='pink' size='lg' radius='xl' 
              onClick={() => handlePreset(p)}>
                <Text size='xs' fw={600}>{p.label}</Text>
              </ActionIcon>
            ))}
          </Group>
          <Group gap='xs' align='center'>
            <Stack align='center' gap={2}>
              <Text size='xs' c='dimmed'>min</Text>
              <NumberInput value={inputMinutes} 
              onChange={(val) => { setInputMinutes(val)
                handleCustomChange(val, inputMinutes)
              }} 
              min={0} max={180} 
              hideControls
              styles={{
                input: {
                  fontSize: '2.5rem',
                  fontWeight: 400,
                  fontFamily: 'sans-serif',
                  textAlign: 'center',
                  width: '100px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--mantine-color-pink-8)',
                  borderRadius: '0',
                  padding: '0 8px'
                }
              }}/>

            </Stack>
            <Text size='2.5rem' fw={700} c='pink' mb={4}>:</Text>
            <Stack align='center' gap={2}>
              <Text size='xs' c='dimmed'>sec</Text>
              <NumberInput value={inputSeconds} 
              onChange={(val) => { setInputSeconds(val)
                handleCustomChange(inputMinutes, val)
              }} 
              min={0} max={59} 
              hideControls
              styles={{
                input: {
                  fontSize: '2.5rem',
                  fontWeight: 400,
                  fontFamily: 'sans-serif',
                  textAlign: 'center',
                  width: '100px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--mantine-color-pink-8)',
                  borderRadius: '0',
                  padding: '0 8px'
                }
              }}/>

            </Stack>
          </Group>
        </Stack>

      )}
      <Group justify='center' gap="xl">
      {isRunning ? (
        <ActionIcon variant="filled" color='pink' size="xl" radius='xl' onClick={onPause}> <Pause size={16}/> </ActionIcon>
        // Both pause and stop should be displayed when isRunning === true
      ):(
        <ActionIcon variant="filled" color='pink' size="xl" radius='xl' onClick={onStart}> <Play size={16}/> </ActionIcon>
        
      )}
        <ActionIcon variant="filled" color='pink' size="xl" radius='xl' onClick={onStop}> <Square size={16}/> </ActionIcon>
        <ActionIcon variant="filled" color='pink' size="xl" radius='xl' onClick={onReset}> <RotateCcw size={16}/> </ActionIcon>
      </Group>
    </Stack>
  )
}