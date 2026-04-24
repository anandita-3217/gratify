import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  Checkbox,
  TextInput,
  ActionIcon,
  Paper,
  Progress,
  Divider,
  ScrollArea,
  ThemeIcon,
  Button,
} from '@mantine/core'
import {
  IconChecklist,
  IconCalendar,
  IconNotes,
  IconPlus,
  IconArrowRight,
  IconCircleCheck,
  IconAlertCircle,
  IconClock,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

// ─── helpers ────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function isUpcoming(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return d >= now && d <= sevenDays
}

const PRIORITY_COLOR = {
  urgent: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'gray',
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, linkLabel, onLink }) {
  return (
    <Group justify="space-between" mb="sm">
      <Group gap={8}>
        <ThemeIcon variant="light" size="sm" radius="md">
          <Icon size={14} />
        </ThemeIcon>
        <Text fw={600} size="sm">
          {title}
        </Text>
      </Group>
      {linkLabel && (
        <Button
          variant="subtle"
          size="xs"
          rightSection={<IconArrowRight size={12} />}
          onClick={onLink}
          px={8}
        >
          {linkLabel}
        </Button>
      )}
    </Group>
  )
}

// ─── Tasks widget ─────────────────────────────────────────────────────────────

function TasksWidget({ tasks, onToggle, onNavigate }) {
  const today = tasks.filter((t) => {
    if (t.completed) return false
    if (t.frequency === 'daily') return true
    if (!t.deadline) return true
    return isUpcoming(t.deadline)
  }).slice(0, 6)

  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Paper withBorder radius="md" p="md" h="100%">
      <SectionHeader
        icon={IconChecklist}
        title="Tasks"
        linkLabel="All tasks"
        onLink={onNavigate}
      />

      <Group gap={6} mb="xs">
        <Text size="xs" c="dimmed">
          {done}/{total} completed
        </Text>
        <Text size="xs" c="dimmed">·</Text>
        <Text size="xs" fw={500} c={pct === 100 ? 'teal' : 'blue'}>
          {pct}%
        </Text>
      </Group>
      <Progress value={pct} size="xs" mb="md" radius="xl" color={pct === 100 ? 'teal' : 'blue'} />

      {today.length === 0 ? (
        <Stack align="center" gap={4} py="lg">
          <IconCircleCheck size={28} color="var(--mantine-color-teal-5)" />
          <Text size="sm" c="dimmed">All caught up!</Text>
        </Stack>
      ) : (
        <Stack gap={6}>
          {today.map((task) => (
            <Group key={task.id} gap={8} wrap="nowrap">
              <Checkbox
                size="xs"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                radius="xl"
              />
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" truncate style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </Text>
                {task.deadline && (
                  <Text size="xs" c={new Date(task.deadline) < new Date() ? 'red' : 'dimmed'}>
                    {formatDate(task.deadline)}
                  </Text>
                )}
              </Box>
              {task.priority && task.priority !== 'medium' && (
                <Badge size="xs" color={PRIORITY_COLOR[task.priority]} variant="light">
                  {task.priority}
                </Badge>
              )}
            </Group>
          ))}
        </Stack>
      )}
    </Paper>
  )
}

// ─── Calendar widget ──────────────────────────────────────────────────────────

function CalendarWidget({ events, onNavigate }) {
  const upcoming = events
    .filter((e) => isUpcoming(e.date || e.start))
    .sort((a, b) => new Date(a.date || a.start) - new Date(b.date || b.start))
    .slice(0, 5)

  const CATEGORY_COLOR = {
    work: 'blue',
    meetings: 'violet',
    deadlines: 'red',
    focus: 'teal',
    personal: 'orange',
  }

  return (
    <Paper withBorder radius="md" p="md" h="100%">
      <SectionHeader
        icon={IconCalendar}
        title="Upcoming"
        linkLabel="Open calendar"
        onLink={onNavigate}
      />

      {upcoming.length === 0 ? (
        <Stack align="center" gap={4} py="lg">
          <IconCalendar size={28} color="var(--mantine-color-gray-4)" />
          <Text size="sm" c="dimmed">No events this week</Text>
        </Stack>
      ) : (
        <Stack gap={0}>
          {upcoming.map((event, i) => (
            <Box key={event.id || i}>
              <Group gap={10} py={8} wrap="nowrap">
                <Box
                  style={{
                    width: 3,
                    height: 36,
                    borderRadius: 99,
                    background: `var(--mantine-color-${CATEGORY_COLOR[event.category] || 'blue'}-5)`,
                    flexShrink: 0,
                  }}
                />
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>{event.title}</Text>
                  <Group gap={6}>
                    <Text size="xs" c="dimmed">{formatDate(event.date || event.start)}</Text>
                    {event.time && (
                      <>
                        <Text size="xs" c="dimmed">·</Text>
                        <Text size="xs" c="dimmed">{event.time}</Text>
                      </>
                    )}
                  </Group>
                </Box>
                {event.category && (
                  <Badge size="xs" color={CATEGORY_COLOR[event.category] || 'blue'} variant="light">
                    {event.category}
                  </Badge>
                )}
              </Group>
              {i < upcoming.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  )
}

// ─── Quick Notes widget ───────────────────────────────────────────────────────

function QuickNotesWidget({ notes, onAddNote, onNavigate }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAddNote(trimmed)
    setInput('')
  }

  const recent = [...notes]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4)

  const NOTE_COLORS = {
    default: 'var(--mantine-color-default-border)',
    yellow: 'var(--mantine-color-yellow-4)',
    blue: 'var(--mantine-color-blue-4)',
    green: 'var(--mantine-color-teal-4)',
    pink: 'var(--mantine-color-pink-4)',
    purple: 'var(--mantine-color-violet-4)',
  }

  return (
    <Paper withBorder radius="md" p="md" h="100%">
      <SectionHeader
        icon={IconNotes}
        title="Quick Notes"
        linkLabel="All notes"
        onLink={onNavigate}
      />

      <Group gap={8} mb="md">
        <TextInput
          placeholder="Jot something down..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          size="xs"
          radius="md"
          style={{ flex: 1 }}
        />
        <ActionIcon
          onClick={handleAdd}
          size="sm"
          radius="md"
          variant="filled"
          disabled={!input.trim()}
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Group>

      {recent.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="md">No notes yet</Text>
      ) : (
        <ScrollArea h={160}>
          <Stack gap={6}>
            {recent.map((note) => (
              <Box
                key={note.id}
                p={8}
                style={{
                  borderRadius: 8,
                  borderLeft: `3px solid ${NOTE_COLORS[note.color] || NOTE_COLORS.default}`,
                  background: 'var(--mantine-color-gray-0)',
                }}
              >
                <Text size="xs" lineClamp={2}>{note.content || note.text}</Text>
                <Text size="xs" c="dimmed" mt={2}>
                  {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
      )}
    </Paper>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useLocalStorage('gratify-tasks', [])
  const [events] = useLocalStorage('gratify-events', [])
  const [notes, setNotes] = useLocalStorage('gratify-notes', [])

  const overdue = tasks.filter(
    (t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()
  ).length

  const handleToggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const handleAddNote = (text) => {
    const note = {
      id: Date.now().toString(),
      content: text,
      color: 'default',
      category: 'general',
      tags: [],
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([note, ...notes])
  }

  return (
    <Box p="xl" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Stack gap={4} mb="xl">
        <Title order={2} fw={600} >
          {greeting()}
          <img 
  src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/lottie.json" 
  width={24} 
  height={24} 
/>
        </Title>
        <Group gap={8}>
          <Text c="dimmed" size="sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {overdue > 0 && (
            <>
              <Text c="dimmed" size="sm">·</Text>
              <Group gap={4}>
                <IconAlertCircle size={14} color="var(--mantine-color-red-5)" />
                <Text size="sm" c="red">
                  {overdue} overdue {overdue === 1 ? 'task' : 'tasks'}
                </Text>
              </Group>
            </>
          )}
        </Group>
      </Stack>

      {/* Stat pills */}
      <Group gap="sm" mb="xl">
        {[
          {
            label: 'Tasks remaining',
            value: tasks.filter((t) => !t.completed).length,
            color: 'blue',
          },
          {
            label: 'Done today',
            value: tasks.filter((t) => t.completed && t.completedAt?.slice(0, 10) === todayKey()).length,
            color: 'teal',
          },
          {
            label: 'Events this week',
            value: events.filter((e) => isUpcoming(e.date || e.start)).length,
            color: 'violet',
          },
          {
            label: 'Notes',
            value: notes.filter((n) => !n.archived).length,
            color: 'orange',
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            withBorder
            radius="md"
            px="md"
            py="sm"
            style={{ minWidth: 120 }}
          >
            <Text size="xl" fw={700} c={stat.color}>
              {stat.value}
            </Text>
            <Text size="xs" c="dimmed">{stat.label}</Text>
          </Paper>
        ))}
      </Group>

      {/* Widgets grid */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <TasksWidget
            tasks={tasks}
            onToggle={handleToggleTask}
            onNavigate={() => navigate('/tasks')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CalendarWidget
            events={events}
            onNavigate={() => navigate('/calendar')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <QuickNotesWidget
            notes={notes}
            onAddNote={handleAddNote}
            onNavigate={() => navigate('/notes')}
          />
        </Grid.Col>
      </Grid>
    </Box>
  )
}