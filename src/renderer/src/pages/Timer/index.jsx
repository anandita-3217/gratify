import { Box, Button, Group, Stack, Text, Title, NumberInput, SegmentedControl } from '@mantine/core'

import useTimer from './useTimer'
import TimerControls from './TimerControls'
import TimerRing from './TimerRing'
import TimerSettings from './TimerSettings'
import { useDisclosure } from '@mantine/hooks'

function getGreeting(){
    const hour = new Date().getHours()
    if (hour < 12) return ('Good Morning!')
    if (hour < 18) return ('Good Afternoon!')
    return 'Good Evening!' 
}

// owns nothing except drawer open state
// gets everything from usePomodoro()
// layout: session type label → TimerRing → TimerControls → stats summary (sessions done today)
// settings button top right → opens TimerSettings drawer

export default function Timer() {
  // const { ...everything } = usePomodoro()
  const {seconds, totalSeconds, isRunning, resetKey, start, stop, pause, reset, setDuration}  = useTimer()
  const minutes = Math.floor(seconds / 60)
  // const [settingsOpened, { open, close }] = useDisclosure(false)
  const [settingsOpened, { open, close }] = useDisclosure(false)
  // layout here

  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={2}>
            <Title fw={600} order={2}>{getGreeting()}</Title>
            <Group gap={8}>
                <Text c="dimmed" size='sm'>
                    {
                        new Date().toLocaleDateString('en-us',{
                            weekday: 'long', month: 'long', day: 'numeric'
                        })
                    }
                </Text>
            </Group>
            <Stack>
                <Box h={1} bg='pink'/>
                <Group gap={8}>
                    <SegmentedControl fullWidth withItemsBorders={false} radius='md' 
                     data={[
                        { label: 'Basic', value: 'basic' },
                        { label: 'Focus', value: 'focus' },
                     ]} />
                     
                </Group>
                
                <TimerRing seconds={seconds} totalSeconds={totalSeconds} isRunning={isRunning}/>
                <TimerControls 
                isRunning={isRunning} 
                onStart={start} 
                onPause={pause} 
                onStop={stop} 
                onReset={reset}
                resetKey={resetKey} 
                totalSeconds={totalSeconds}
                onDurationChange={(totalSecs) => setDuration(totalSecs)}/>
                <Button onClick={open}>Open Drawer</Button>
                <TimerSettings opened={settingsOpened} onClose={close}/>
            </Stack>

        </Stack>

    </Box>
    )
}