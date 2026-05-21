// Drawer from the right — same pattern as NoteDrawer
// props: opened, onClose, settings, technique, onTechniqueChange, onSettingsChange
// sections:
//   1. technique picker (Pomodoro / 52-17 / Custom)
//   2. duration inputs (only editable when custom)
//   3. sound settings (placeholder for now)
//   4. encouraging message toggle (placeholder for now)
import useTimer from './useTimer'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Box, Drawer,Divider, Stack, Switch, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { BellRing , BellOff  } from 'lucide-react';

export default function TimerSettings({ opened, onClose, settings, technique, onTechniqueChange, onSettingsChange }) {
    // sound enabled state — useLocalStorage
    const [sound, setSound] = useState(true)
 
    // notifications enabled state — useLocalStorage
    const [notifications, setNotifications] = useState(false)
  return (
    <Drawer
    opened={opened} onClose={onClose}
    title="Timer Settings"
    position='right'
    styles={{
      title:  { color: '#c2255c', fontWeight: 600}
    }}>
      <Divider color='pink'/>
    <Stack gap='lg'>
      <Text>Sounds</Text>
      <Switch
      // TODO: add thumb icon
      size='md'
      thumbIcon={sound ? (
        <BellRing  size={12} color='pink'/>
      ) : (
        <BellOff size={12} color='gray' />
      )}
      onLabel="ON" offLabel="OFF"
      defaultChecked
      checked={sound}
      onChange={(e) => setSound(e.currentTarget.checked) }
      label='Sound On'
      /><Divider color='pink'/>
      <Text>Notifications</Text>
      <Switch
      // TODO: add thumb icon
      size='md'
      thumbIcon={notifications ? (
        <BellRing  size={12} color='pink'/>
      ) : (
        <BellOff size={12} color='gray' />
      )}
      onLabel="ON" offLabel="OFF"
      defaultChecked
      checked={notifications}
      onChange={(e) => setNotifications(e.currentTarget.checked) }
      label='Notifications On'
      />
    </Stack>
    </Drawer>
  )
}