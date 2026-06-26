import { Box, Stack, Title, Text, Tabs, Divider, useMantineTheme } from '@mantine/core'
import { Palette, ListChecks, Calendar, Keyboard, HelpCircle, Database } from 'lucide-react'
import AppearanceSection from './AppearanceSection'
import TasksSection from './TasksSection'
import CalendarSection from './CalendarSection'
import ShortcutsSection from './ShortcutsSection'
import HelpSection from './HelpSection'
import DataSection from './DataSection'

export default function Settings() {
  const theme = useMantineTheme()
  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={4} mb="xl">
        <Title fw={600} order={2} style={{ color: `var(--mantine-color-${theme.primaryColor}-5)` }}>
          Settings
        </Title>
        <Text c="dimmed" size="sm">
          Customize your Gratify experience
        </Text>
        <Divider color={theme.primaryColor} />
      </Stack>

      <Tabs defaultValue="appearance">
        <Tabs.List>
          <Tabs.Tab value="appearance" leftSection={<Palette size={14} />}>
            Appearance
          </Tabs.Tab>
          <Tabs.Tab value="tasks" leftSection={<ListChecks size={14} />}>
            Tasks
          </Tabs.Tab>
          <Tabs.Tab value="calendar" leftSection={<Calendar size={14} />}>
            Calendar
          </Tabs.Tab>
          <Tabs.Tab value="shortcuts" leftSection={<Keyboard size={14} />}>
            Shortcuts
          </Tabs.Tab>
          <Tabs.Tab value="help" leftSection={<HelpCircle size={14} />}>
            Help
          </Tabs.Tab>
          <Tabs.Tab value="data" leftSection={<Database size={14} />}>
            Data
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="appearance" pt="md">
          <AppearanceSection />
        </Tabs.Panel>
        <Tabs.Panel value="tasks" pt="md">
          <TasksSection />
        </Tabs.Panel>
        <Tabs.Panel value="calendar" pt="md">
          <CalendarSection />
        </Tabs.Panel>
        <Tabs.Panel value="shortcuts" pt="md">
          <ShortcutsSection />
        </Tabs.Panel>
        <Tabs.Panel value="help" pt="md">
          <HelpSection />
        </Tabs.Panel>
        <Tabs.Panel value="data" pt="md">
          <DataSection />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
