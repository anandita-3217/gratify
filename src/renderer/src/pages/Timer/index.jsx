import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  SegmentedControl,
  useMantineTheme,
  Divider
} from '@mantine/core'
import { Settings2 } from 'lucide-react'
import useTimer from './useTimer'
import TimerControls from './TimerControls'
import TimerRing from './TimerRing'
import TimerSettings from './TimerSettings'
import TechniquePicker from './TechniquePicker'
import CustomTechniqueModal from './CustomTechniqueModal'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

export default function Timer() {
  const {
    seconds,
    totalSeconds,
    cyclesCompleted,
    isRunning,
    setDuration,
    phaseIndex,
    currentPhase,
    mode,
    setMode,
    resetKey,
    settings,
    updateSettings,
    techniqueName,
    addCustomTechnique,
    start,
    stop,
    pause,
    skip,
    reset,
    technique,
    setTechnique,
    TECHNIQUES,
    BUILT_IN_TECHNIQUES,
    deleteTechnique,
    editTechnique
  } = useTimer()

  const [settingsOpened, { open, close }] = useDisclosure(false)
  const [customOpened, { open: openCustom, close: closeCustom }] = useDisclosure(false)
  const [editingTechnique, setEditingTechnique] = useState(null)

  const theme = useMantineTheme()
  function handleEditTechnique(key) {
    setEditingTechnique(key)
    openCustom()
  }

  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={2} mb="xl">
        <Group gap={8} justify="space-between">
          <Title fw={600} order={2}>
            Timer
          </Title>
          <Group gap="xs">
            <SegmentedControl
              value={mode}
              onChange={setMode}
              fullWidth
              withItemsBorders={false}
              radius="md"
              data={[
                { label: 'Basic', value: 'basic' },
                { label: 'Focus', value: 'focus' }
              ]}
            />
            <Button variant="subtle" size="xs" aria-label="Timer Settings" onClick={open}>
              <Settings2 size={12} />
            </Button>
          </Group>
        </Group>
        <Text c="dimmed" size="sm">
          Focus effectively!
        </Text>
        <Stack>
          <Divider color={theme.primaryColor} />
          <TimerRing
            mode={mode}
            phaseIndex={phaseIndex}
            currentPhase={currentPhase}
            seconds={seconds}
            totalSeconds={totalSeconds}
            isRunning={isRunning}
            cyclesCompleted={cyclesCompleted}
          />

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
            onDurationChange={(totalSecs) => setDuration(totalSecs)}
          />
          {mode === 'focus' && (
            <Box justify="center" mt="xs">
              <TechniquePicker
                technique={technique}
                setTechnique={setTechnique}
                TECHNIQUES={settings}
                isRunning={isRunning}
                onNewTechnique={openCustom}
                BUILT_IN_TECHNIQUES={BUILT_IN_TECHNIQUES}
                onEdit={handleEditTechnique}
                onDelete={deleteTechnique}
              />
            </Box>
          )}
          <TimerSettings
            opened={settingsOpened}
            onClose={close}
            settings={settings}
            onSettingsChange={updateSettings}
          />

          <CustomTechniqueModal
            opened={customOpened}
            onClose={() => {
              closeCustom()
              setEditingTechnique(null)
            }}
            onSave={addCustomTechnique}
            onEdit={editTechnique}
            editingTechnique={editingTechnique ? settings[editingTechnique] : null}
            editingKey={editingTechnique}
          />
        </Stack>
      </Stack>
    </Box>
  )
}
