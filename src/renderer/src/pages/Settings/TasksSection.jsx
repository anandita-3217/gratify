import { Stack, Text, Select, Switch, Divider } from '@mantine/core'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function TasksSection() {
  const [defaultPriority, setDefaultPriority] = useLocalStorage('defaultPriority', 'low')
  const [showCompleted, setShowCompleted] = useLocalStorage('showCompleted', true)

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Default Priority</Text>
        <Text size="xs" c="dimmed">
          Priority assigned to new tasks
        </Text>
        <Select
          data={['low', 'medium', 'high', 'urgent']}
          placeholder="Priority"
          value={defaultPriority}
          onClick={setDefaultPriority}
        />
        {/* Select — low / medium / high / urgent */}
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
