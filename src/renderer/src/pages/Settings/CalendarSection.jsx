import { Stack, Text, Select, Switch, Divider } from '@mantine/core'

export default function CalendarSection() {
  // weekStartsOn — useLocalStorage('weekStartsOn', 'sunday')
  // timeFormat — useLocalStorage('timeFormat', '12h')

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Week Starts On</Text>
        <Text size="xs" c="dimmed">First day of the week in calendar views</Text>
        {/* Select — Sunday / Monday */}
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Time Format</Text>
        <Text size="xs" c="dimmed">12-hour or 24-hour time display</Text>
        {/* SegmentedControl — 12h / 24h */}
      </Stack>
    </Stack>
  )
}