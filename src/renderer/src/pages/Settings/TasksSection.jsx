import { Stack, Text, Select, Switch, Divider } from '@mantine/core'

export default function TasksSection() {
  // defaultPriority — useLocalStorage('defaultPriority', 'low')
  // showCompleted — useLocalStorage('showCompleted', true)

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Default Priority</Text>
        <Text size="xs" c="dimmed">
          Priority assigned to new tasks
        </Text>
        <Select data={['low', 'medium', 'high', 'urgent']} />
        {/* Select — low / medium / high / urgent */}
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Show Completed Tasks</Text>
        <Text size="xs" c="dimmed">
          Show or hide completed tasks by default
        </Text>
        <Switch />
      </Stack>
    </Stack>
  )
}
