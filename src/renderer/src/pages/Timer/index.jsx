import { Box, Button, Group, Stack, Text, Title } from '@mantine/core'

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
  const {seconds, totalSeconds, isRunning, start, stop, pause, reset, setDuration}  = useTimer()
  
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
                <TimerRing seconds={seconds} totalSeconds={totalSeconds} isRunning={true}/>
                {/* <TimerControls/> */}
                {/* <Button onClick={open}>Open Drawer</Button> */}
                {/* <TimerSettings/> */}
            </Stack>

        </Stack>

    </Box>
    )
}