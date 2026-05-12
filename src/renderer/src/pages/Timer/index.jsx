import { Box, Button, Group, Stack, Text, Title, NumberInput, SegmentedControl } from '@mantine/core'

import useTimer from './useTimer'
import TimerControls from './TimerControls'
import TimerRing from './TimerRing'
import TimerSettings from './TimerSettings'
import CustomTechniqueModal from './CustomTechniqueModal'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'

function getGreeting(){
    const hour = new Date().getHours()
    if (hour < 12) return ('Good Morning!')
    if (hour < 18) return ('Good Afternoon!')
    return 'Good Evening!' 
}
export default function Timer() {

  const {seconds, totalSeconds, cyclesCompleted,
    isRunning, setDuration, phase, 
    mode, setMode, resetKey, settings, updateSettings, techniqueName, addCustomTechnique,
    start, stop, pause, skip, reset, technique, setTechnique, TECHNIQUES}  = useTimer()
  const minutes = Math.floor(seconds / 60)
  const [settingsOpened, { open, close }] = useDisclosure(false)
  const [customOpened, { open: openCustom, close: closeCustom }] = useDisclosure(false)

    useEffect(()=>{
        if(technique === 'custom') openCustom()
    },[technique])

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
                <Stack gap={4} align='center' >
                    <SegmentedControl value={mode} onChange={setMode} fullWidth withItemsBorders={false} radius='md' 
                     data={[
                        { label: 'Basic', value: 'basic' },
                        { label: 'Focus', value: 'focus' },
                     ]} />
                     {mode === 'focus' && (
                         <SegmentedControl
                             fullWidth
                             withItemsBorders={false}
                             radius='md'
                             value={technique}
                             onChange={(val) => {
                                 if(val === 'custom') openCustom()
                                 else setTechnique(val)}}
                             data={[
                               ...Object.entries(TECHNIQUES).map(([key, val]) => ({ label: val.name, value: key })),
                               { label: '+ Custom', value: 'custom' }
                             ]}/>
                    )}
                </Stack>
                {mode === 'focus' && (
                    <Stack align="center" gap={4}>
                        <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
                          {phase === 'work' ? 'Focus' : phase === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Cycle {cyclesCompleted + 1}
                        </Text>
                     </Stack>
                )}
                <TimerRing
                    mode={mode}
                    phase={phase} 
                    seconds={seconds} 
                    totalSeconds={totalSeconds} 
                    isRunning={isRunning}/>
                <TimerControls
                    mode={mode} 
                    isRunning={isRunning} 
                    onStart={start} 
                    onPause={pause} 
                    onStop={stop} 
                    onReset={reset}
                    onSkip={skip}
                    resetKey={resetKey}
                    totalSeconds={totalSeconds}
                    onDurationChange={(totalSecs) => setDuration(totalSecs)}/>
                
                <TimerSettings 
                opened={settingsOpened} onClose={close}
                settings={settings} onSettingsChange={updateSettings}/>

                <CustomTechniqueModal
                opened={customOpened} onClose={closeCustom} onSave={addCustomTechnique}/>
                
            </Stack>

        </Stack>

    </Box>
    )
}