import { Stack, Text, Select, Divider, SegmentedControl } from '@mantine/core'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function CalendarSection() {
  const [weekStartsOn, setWeekStartsOn] = useLocalStorage('weekStartsOn', 'sunday')
  const [timeFormat, setTimeFormat] = useLocalStorage('timeFormat', '12h')
  // timeFormat —

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Week Starts On</Text>
        <Text size="xs" c="dimmed">
          First day of the week in calendar views
        </Text>
        <Select data={['Sunday', 'Monday']} value={weekStartsOn} onChange={setWeekStartsOn} />
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Time Format</Text>
        <Text size="xs" c="dimmed">
          12-hour or 24-hour time display
        </Text>
        <SegmentedControl
          data={['12-hour', '24-hour']}
          value={timeFormat}
          onChange={setTimeFormat}
        />
      </Stack>
    </Stack>
  )
}
