import useTimerPreferences from '../../hooks/useTimerPreferences'
import { Drawer, Divider, Stack, Switch, Text, useMantineTheme } from '@mantine/core'
import { BellRing, BellOff } from 'lucide-react'
import PropTypes from 'prop-types'

export default function TimerSettings({ opened, onClose }) {
  const theme = useMantineTheme()
  const { sound, setSound, notifications, setNotifications } = useTimerPreferences()
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Timer Settings"
      position="right"
      styles={{
        title: { color: `var(--mantine-color-${theme.primaryColor}-5)`, fontWeight: 600 }
      }}
    >
      <Divider />
      <Stack gap="lg">
        <Text>Sounds</Text>
        <Switch
          size="md"
          thumbIcon={sound ? <BellRing size={12} /> : <BellOff size={12} color="gray" />}
          onLabel="ON"
          offLabel="OFF"
          checked={sound}
          onChange={(e) => setSound(e.currentTarget.checked)}
          label="Sound On"
        />
        <Divider />
        <Text>Notifications</Text>
        <Switch
          size="md"
          thumbIcon={notifications ? <BellRing size={12} /> : <BellOff size={12} color="gray" />}
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
