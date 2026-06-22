import { Stack, Text, Table, Badge, SegmentedControl } from '@mantine/core'
import { useState } from 'react'

const SHORTCUTS = [
  { group: 'App', key: 'Ctrl + B', action: 'Toggle sidebar' },
  { group: 'App', key: 'Ctrl + T', action: 'Toggle theme' },
  { group: 'Tasks', key: 'Ctrl + Enter', action: 'Add quick task' },
  { group: 'Notes', key: 'Ctrl + N', action: 'New note' },
  { group: 'Timer', key: 'Space', action: 'Start / pause timer' },
  { group: 'Timer', key: 'R', action: 'Reset timer' },
  { group: 'Timer', key: 'S', action: 'Stop timer' },
  { group: 'Calendar', key: 'D', action: 'Day view' },
  { group: 'Calendar', key: 'W', action: 'Week view' },
  { group: 'Calendar', key: 'M', action: 'Month view' },
  { group: 'Calendar', key: 'T', action: 'Go to today' }
]

export default function ShortcutsSection() {
  const [filter, setFilter] = useState('All')
  const groups = ['All', ...new Set(SHORTCUTS.map((s) => s.group))]
  const filtered = filter === 'All' ? SHORTCUTS : SHORTCUTS.filter((s) => s.group === filter)
  return (
    <Stack gap="lg">
      <Text size="xs" c="dimmed">
        All keyboard shortcuts available in Gratify
      </Text>
      <SegmentedControl
        size="xs"
        value={filter}
        onChange={setFilter}
        data={groups}
        defaultValue="All"
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Section</Table.Th>
            <Table.Th>Shortcut</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtered.map((s, i) => (
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
