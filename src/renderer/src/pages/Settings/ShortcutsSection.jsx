import { Stack, Text, Table, Badge } from '@mantine/core'

const SHORTCUTS = [
  { group: 'App', key: 'Ctrl + B', action: 'Toggle sidebar' },
  { group: 'App', key: 'Ctrl + T', action: 'Toggle theme' },
  { group: 'Calendar', key: 'D', action: 'Day view' },
  { group: 'Calendar', key: 'W', action: 'Week view' },
  { group: 'Calendar', key: 'M', action: 'Month view' },
  { group: 'Calendar', key: 'T', action: 'Go to today' }
]

export default function ShortcutsSection() {
  return (
    // TODO: add new shortcuts
    // TODO: add filter by feature

    <Stack gap="lg">
      <Text size="xs" c="dimmed">
        All keyboard shortcuts available in Gratify
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Section</Table.Th>
            <Table.Th>Shortcut</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {SHORTCUTS.map((s, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Badge variant="light" size="xs">
                  {s.group}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge variant="outline" color="gray" size="sm">
                  {s.key}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{s.action}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}
