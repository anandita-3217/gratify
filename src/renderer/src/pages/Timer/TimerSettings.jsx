// Drawer from the right — same pattern as NoteDrawer
// props: opened, onClose, settings, technique, onTechniqueChange, onSettingsChange
// sections:
//   1. technique picker (Pomodoro / 52-17 / Custom)
//   2. duration inputs (only editable when custom)
//   3. sound settings (placeholder for now)
//   4. encouraging message toggle (placeholder for now)
import { useLocalStorage } from '../../hooks/useLocalStorage'
import useTimerPreferences from '../../hooks/useTimerPreferences'
import { Drawer, Divider, Stack, Switch, Text } from '@mantine/core'
import { useState } from 'react'
import { BellRing, BellOff } from 'lucide-react'
import PropTypes from 'prop-types'

export default function TimerSettings({
  opened,
  onClose,
  settings,
  technique,
  onTechniqueChange,
  onSettingsChange
}) {
  const { sound, setSound, notifications, setNotifications } = useTimerPreferences()
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Timer Settings"
      position="right"
      styles={{
        title: { color: '#c2255c', fontWeight: 600 } // TODO: change this to be governed by the accent color in settings
      }}
    >
      <Divider />
      <Stack gap="lg">
        <Text>Sounds</Text>
        <Switch
          size="md"
          thumbIcon={
            sound ? <BellRing size={12}    /> : <BellOff size={12} color="gray" />  // TODO: change this to be governed by the accent color in settings
          }
          onLabel="ON"
          offLabel="OFF"
          checked={sound}
          onChange={(e) => setSound(e.currentTarget.checked)}
          label="Sound On"
        />
        <Divider    />
        <Text>Notifications</Text>
        <Switch
          size="md"
          thumbIcon={
            notifications ? <BellRing size={12}    /> : <BellOff size={12} color="gray" />
          }
          onLabel="ON"
          offLabel="OFF"
          checked={notifications}
          onChange={(e) => setNotifications(e.currentTarget.checked)}
          label="Notifications On"
        />
        <Text size="xs" c="dimmed">
          Enabling this allows Gratify to send system notifications when a phase ends.
        </Text>
      </Stack>
    </Drawer>
  )
}
TimerSettings.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  settings: PropTypes.array,
  technique: PropTypes.shape(),
  onTechniqueChange: PropTypes.func,
  onSettingsChange: PropTypes.func
}
