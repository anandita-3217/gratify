import {
  Box,
  Title,
  Text,
  Stack,
  Group,
  Paper,
  Switch,
  Select,
  NumberInput,
  Divider,
  Button,
  ColorSwatch,
  SimpleGrid,
  Badge,
  ActionIcon,
  ThemeIcon,
  Slider,
  SegmentedControl,
} from '@mantine/core'
import {
  IconClock,
  IconBell,
  IconPalette,
  IconDatabase,
  IconTrash,
  IconDownload,
  IconUpload,
  IconInfoCircle,
} from '@tabler/icons-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { notifications } from '@mantine/notifications'

// ─── defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  // Pomodoro
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLong: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  // Notifications
  soundEnabled: true,
  desktopNotifications: false,
  taskDeadlineAlerts: true,
  alertLeadTime: '60', // minutes
  // Appearance
  colorScheme: 'system',
  accentColor: 'blue',
  // Data
  debugMode: false,
}

const ACCENT_COLORS = [
  { value: 'blue',   label: 'Blue',   hex: '#228be6' },
  { value: 'teal',   label: 'Teal',   hex: '#12b886' },
  { value: 'violet', label: 'Violet', hex: '#7950f2' },
  { value: 'orange', label: 'Orange', hex: '#fd7e14' },
  { value: 'red',    label: 'Red',    hex: '#fa5252' },
  { value: 'pink',   label: 'Pink',   hex: '#e64980' },
]

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ icon: Icon, title, description, children }) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group gap={10} mb={description ? 4 : 'md'}>
        <ThemeIcon variant="light" radius="md" size="md">
          <Icon size={16} />
        </ThemeIcon>
        <Text fw={600} size="sm">{title}</Text>
      </Group>
      {description && (
        <Text size="xs" c="dimmed" mb="md">{description}</Text>
      )}
      {children}
    </Paper>
  )
}

// ─── Row helpers ──────────────────────────────────────────────────────────────

function SettingRow({ label, description, children }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="xl">
      <Box>
        <Text size="sm">{label}</Text>
        {description && <Text size="xs" c="dimmed">{description}</Text>}
      </Box>
      <Box style={{ flexShrink: 0 }}>{children}</Box>
    </Group>
  )
}

// ─── Main Settings page ───────────────────────────────────────────────────────

export default function Settings() {
  const [settings, setSettings] = useLocalStorage('gratify-settings', DEFAULT_SETTINGS)

  const update = (key, value) => setSettings({ ...settings, [key]: value })

  const handleExport = () => {
    const data = {
      tasks:    JSON.parse(localStorage.getItem('gratify-tasks')    || '[]'),
      notes:    JSON.parse(localStorage.getItem('gratify-notes')    || '[]'),
      events:   JSON.parse(localStorage.getItem('gratify-events')   || '[]'),
      settings: JSON.parse(localStorage.getItem('gratify-settings') || '{}'),
      exported: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gratify-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    notifications.show({
      title: 'Exported',
      message: 'Your data has been downloaded.',
      color: 'teal',
    })
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.tasks)    localStorage.setItem('gratify-tasks',    JSON.stringify(data.tasks))
          if (data.notes)    localStorage.setItem('gratify-notes',    JSON.stringify(data.notes))
          if (data.events)   localStorage.setItem('gratify-events',   JSON.stringify(data.events))
          if (data.settings) localStorage.setItem('gratify-settings', JSON.stringify(data.settings))
          notifications.show({ title: 'Imported', message: 'Data restored. Reload the app.', color: 'teal' })
        } catch {
          notifications.show({ title: 'Error', message: 'Invalid backup file.', color: 'red' })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClearAll = () => {
    if (!window.confirm('This will permanently delete ALL your tasks, notes, events and settings. Are you sure?')) return
    ;['gratify-tasks','gratify-notes','gratify-events','gratify-settings'].forEach(
      (k) => localStorage.removeItem(k)
    )
    setSettings(DEFAULT_SETTINGS)
    notifications.show({ title: 'Cleared', message: 'All data has been removed.', color: 'orange' })
  }

  return (
    <Box p="xl" style={{ maxWidth: 680, margin: '0 auto' }}>
      <Stack gap={4} mb="xl">
        <Title order={2} fw={600}>Settings</Title>
        <Text c="dimmed" size="sm">Customise your Gratify experience.</Text>
      </Stack>

      <Stack gap="md">

        {/* ── Pomodoro ── */}
        <Section icon={IconClock} title="Pomodoro Timer" description="Adjust session lengths and auto-start behaviour.">
          <Stack gap="sm">
            <SettingRow label="Work duration" description="Minutes per focus session">
              <NumberInput
                value={settings.workDuration}
                onChange={(v) => update('workDuration', v)}
                min={1} max={90} step={1}
                size="xs" w={80}
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Short break" description="Minutes">
              <NumberInput
                value={settings.shortBreak}
                onChange={(v) => update('shortBreak', v)}
                min={1} max={30} step={1}
                size="xs" w={80}
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Long break" description="Minutes">
              <NumberInput
                value={settings.longBreak}
                onChange={(v) => update('longBreak', v)}
                min={1} max={60} step={1}
                size="xs" w={80}
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Sessions before long break">
              <NumberInput
                value={settings.sessionsBeforeLong}
                onChange={(v) => update('sessionsBeforeLong', v)}
                min={1} max={10} step={1}
                size="xs" w={80}
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Auto-start breaks" description="Begin break immediately after a session ends">
              <Switch
                checked={settings.autoStartBreaks}
                onChange={(e) => update('autoStartBreaks', e.currentTarget.checked)}
                size="sm"
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Auto-start work sessions" description="Begin next focus session after a break">
              <Switch
                checked={settings.autoStartWork}
                onChange={(e) => update('autoStartWork', e.currentTarget.checked)}
                size="sm"
              />
            </SettingRow>
          </Stack>
        </Section>

        {/* ── Notifications ── */}
        <Section icon={IconBell} title="Notifications" description="Control how and when Gratify alerts you.">
          <Stack gap="sm">
            <SettingRow label="Sound notifications" description="Play a sound when a session ends">
              <Switch
                checked={settings.soundEnabled}
                onChange={(e) => update('soundEnabled', e.currentTarget.checked)}
                size="sm"
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Desktop notifications" description="Show system notifications (requires permission)">
              <Switch
                checked={settings.desktopNotifications}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    Notification.requestPermission().then((p) => {
                      update('desktopNotifications', p === 'granted')
                    })
                  } else {
                    update('desktopNotifications', false)
                  }
                }}
                size="sm"
              />
            </SettingRow>
            <Divider />
            <SettingRow label="Task deadline alerts">
              <Switch
                checked={settings.taskDeadlineAlerts}
                onChange={(e) => update('taskDeadlineAlerts', e.currentTarget.checked)}
                size="sm"
              />
            </SettingRow>
            {settings.taskDeadlineAlerts && (
              <>
                <Divider />
                <SettingRow label="Alert me before deadline">
                  <Select
                    value={settings.alertLeadTime}
                    onChange={(v) => update('alertLeadTime', v)}
                    data={[
                      { value: '15',   label: '15 minutes' },
                      { value: '60',   label: '1 hour' },
                      { value: '1440', label: '1 day' },
                      { value: '10080',label: '1 week' },
                    ]}
                    size="xs"
                    w={120}
                  />
                </SettingRow>
              </>
            )}
          </Stack>
        </Section>

        {/* ── Appearance ── */}
        <Section icon={IconPalette} title="Appearance">
          <Stack gap="sm">
            <SettingRow label="Theme">
              <SegmentedControl
                value={settings.colorScheme}
                onChange={(v) => update('colorScheme', v)}
                size="xs"
                data={[
                  { label: 'Light',  value: 'light'  },
                  { label: 'Dark',   value: 'dark'   },
                  { label: 'System', value: 'system' },
                ]}
              />
            </SettingRow>
            <Divider />
            <Box>
              <Text size="sm" mb="xs">Accent colour</Text>
              <Group gap={10}>
                {ACCENT_COLORS.map((c) => (
                  <Box
                    key={c.value}
                    onClick={() => update('accentColor', c.value)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <ColorSwatch
                      color={c.hex}
                      size={28}
                      style={{
                        outline: settings.accentColor === c.value
                          ? `2px solid ${c.hex}`
                          : '2px solid transparent',
                        outlineOffset: 2,
                      }}
                    />
                  </Box>
                ))}
              </Group>
            </Box>
          </Stack>
        </Section>

        {/* ── Data ── */}
        <Section
          icon={IconDatabase}
          title="Data & Privacy"
          description="All your data is stored locally on this device. Nothing is ever uploaded."
        >
          <Stack gap="sm">
            <Group gap="sm">
              <Button
                leftSection={<IconDownload size={14} />}
                variant="light"
                size="sm"
                onClick={handleExport}
              >
                Export backup
              </Button>
              <Button
                leftSection={<IconUpload size={14} />}
                variant="light"
                size="sm"
                onClick={handleImport}
              >
                Import backup
              </Button>
            </Group>
            <Divider />
            <SettingRow
              label="Clear all data"
              description="Permanently deletes all tasks, notes, events and settings"
            >
              <Button
                leftSection={<IconTrash size={14} />}
                variant="light"
                color="red"
                size="xs"
                onClick={handleClearAll}
              >
                Clear data
              </Button>
            </SettingRow>
          </Stack>
        </Section>

        {/* ── About ── */}
        <Paper withBorder radius="md" p="lg">
          <Group gap={10} mb="sm">
            <ThemeIcon variant="light" radius="md" size="md">
              <IconInfoCircle size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">About</Text>
          </Group>
          <Stack gap={4}>
            <Group gap={8}>
              <Text size="sm" c="dimmed">App</Text>
              <Text size="sm">Gratify</Text>
            </Group>
            <Group gap={8}>
              <Text size="sm" c="dimmed">Storage</Text>
              <Badge variant="light" color="teal" size="sm">100% local</Badge>
            </Group>
            <Group gap={8}>
              <Text size="sm" c="dimmed">Built with</Text>
              <Text size="sm">Electron · React · Mantine</Text>
            </Group>
          </Stack>
        </Paper>

      </Stack>
    </Box>
  )
}