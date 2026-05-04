// Drawer from the right — same pattern as NoteDrawer
// props: opened, onClose, settings, technique, onTechniqueChange, onSettingsChange
// sections:
//   1. technique picker (Pomodoro / 52-17 / Custom)
//   2. duration inputs (only editable when custom)
//   3. sound settings (placeholder for now)
//   4. encouraging message toggle (placeholder for now)
import useTimer from './useTimer'
import { Box, Drawer, Stack, Text, Title } from '@mantine/core'

export default function TimerSettings({ opened, onClose, settings, technique, onTechniqueChange, onSettingsChange }) {
    // Drawer here
  return (
    <Drawer
    opened={opened} onClose={onClose} position='right' title="Timer Settings">

    <Box>
        <Title order={1} fw={500}>I am Timer Settings and i work</Title>
    </Box>
    </Drawer>
  )
}