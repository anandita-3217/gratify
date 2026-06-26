import { Stack, Text, Select, Divider, SegmentedControl } from '@mantine/core'
import useSettings from '../../hooks/useSettings'

export default function CalendarSection() {
  const { weekStartsOn, setWeekStartsOn, timeFormat, setTimeFormat } = useSettings()

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Week Starts On</Text>
        <Text size="xs" c="dimmed">
          First day of the week in calendar views
        </Text>
        <Select
          data={[
            { label: 'Sunday', value: 'sunday' },
            { label: 'Monday', value: 'monday' }
          ]}
          value={weekStartsOn}
          onChange={setWeekStartsOn}
        />
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Time Format</Text>
        <Text size="xs" c="dimmed">
          12-hour or 24-hour time display
        </Text>
        <SegmentedControl
          data={[
            { label: '12-hour', value: '12h' },
            { label: '24-hour', value: '24h' }
          ]}
          value={timeFormat}
          onChange={setTimeFormat}
        />
      </Stack>
    </Stack>
  )
}
