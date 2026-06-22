import { Stack, Text, Select, Switch, Divider } from '@mantine/core'
import { useSettings } from '../../context/SettingsContext'
// TODO: Settings not getting reeflected
export default function TasksSection() {
  const { defaultPriority, setDefaultPriority, showCompleted, setShowCompleted } = useSettings()

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Default Priority</Text>
        <Text size="xs" c="dimmed">
          Priority assigned to new tasks
        </Text>
        <Select
          data={['low', 'medium', 'high', 'urgent']}
          value={defaultPriority}
          onChange={setDefaultPriority}
          w={200}
        />
      </Stack>
      <Divider />
      <Stack gap="xs">
        <Text fw={600}>Show Completed Tasks</Text>
        <Text size="xs" c="dimmed">
          Show or hide completed tasks by default
        </Text>
        <Switch
          checked={showCompleted}
          onChange={(e) => setShowCompleted(e.currentTarget.checked)}
        />
      </Stack>
    </Stack>
  )
}
