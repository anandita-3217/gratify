import { Stack, Text, Title, Button, Divider, useMantineTheme } from '@mantine/core'
import { Download, Upload, Trash } from 'lucide-react'

export default function DataSection() {
  const theme = useMantineTheme()
  // exportData — read all localStorage keys, JSON.stringify, download as file
  // importData — file input, JSON.parse, write to localStorage keys
  // clearData — confirm modal, then localStorage.clear()

  function exportData() {
    // hint:
    // const data = { tasks, notes, events, techniques }
    // const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    // const url = URL.createObjectURL(blob)
    // const a = document.createElement('a'); a.href = url; a.download = 'gratify-backup.json'; a.click()
  }

  function importData() {
    // hint:
    // const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    // input.onchange = (e) => { read file, parse JSON, write each key to localStorage }
    // input.click()
  }

  function clearData() {
    // show confirmation first — use Mantine modals
    // then localStorage.removeItem for each key
  }

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Title size="sm" c={theme.primaryColor}>
          {' '}
          Your data your business{' '}
        </Title>
        <Text size="xs" c="dimmed">
          {' '}
          Your data on the app is completely yours to do whatever you want to and with it. I cant
          see nor do I want to. I dont want it. Thanks
        </Text>
        <Text fw={600}>Export Data</Text>
        <Text size="xs" c="dimmed">
          Download all your tasks, notes, events and settings as a JSON file
        </Text>
        <Button
          leftSection={<Download size={14} />}
          variant="light"
          w="fit-content"
          onClick={exportData}
        >
          Export
        </Button>
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Import Data</Text>
        <Text size="xs" c="dimmed">
          Restore from a previously exported JSON file
        </Text>
        <Button
          leftSection={<Upload size={14} />}
          variant="light"
          color="blue"
          w="fit-content"
          onClick={importData}
        >
          Import
        </Button>
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Clear All Data</Text>
        <Text size="xs" c="dimmed">
          Permanently delete all tasks, notes, events and settings. This cannot be undone.
        </Text>
        <Button
          leftSection={<Trash size={14} />}
          variant="light"
          color="red"
          w="fit-content"
          onClick={clearData}
        >
          Clear All Data
        </Button>
      </Stack>
    </Stack>
  )
}
