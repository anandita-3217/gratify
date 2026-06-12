import { useRef, useState } from 'react'
import {
  Box,
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
  Image,
  Button
} from '@mantine/core'
import {
  IconChecklist,
  IconCalendar,
  IconNotes,
  IconPlus,
  IconArrowRight,
  IconCircleCheck,
  IconAlertCircle
} from '@tabler/icons-react'
import useTasks from '../Tasks/useTasks'
import useNotes from '../Notes/useNotes'
import useCalendar from '../Calendar/useCalendar'
import useCalendarSync from '../Calendar/useCalendarSync'

import PropTypes from 'prop-types'

// ─── helpers ────────────────────────────────────────────────────────────────

function greeting() {
  const hours = new Date().getHours()
  if (hours < 12) return 'Good Morning!'
  if (hours < 18) return 'Good Afternoon'
  return 'Good Evening!'
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
  low: 'gray'
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
SectionHeader.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  linkLabel: PropTypes.string,
  onLink: PropTypes.func
}

// ─── Tasks widget ─────────────────────────────────────────────────────────────

function TasksWidget({ tasks, onToggle, onNavigate }) {
  const today = tasks
    .filter((t) => {
      if (t.completed) return false
      if (t.frequency === 'daily') return true
      if (!t.deadline) return true
      return isUpcoming(t.deadline)
    })
    .slice(0, 6)

  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Paper withBorder radius="md" p="md" h="80%">
      <SectionHeader icon={IconChecklist} title="Tasks" linkLabel="All tasks" onLink={onNavigate} />

      <Group gap={6} mb="xs">
        <Text size="xs" c="dimmed">
          {done}/{total} completed
        </Text>
        <Text size="xs" c="dimmed">
          ·
        </Text>
        <Text size="xs" fw={500} c={pct === 100 ? 'teal' : 'blue'}>
          {pct}%
        </Text>
      </Group>
      <Progress value={pct} size="xs" mb="md" radius="xl" color={pct === 100 ? 'teal' : 'blue'} />

      {today.length === 0 ? (
        <Stack align="center" gap={4} py="lg">
          <IconCircleCheck size={28} color="green" />
          {/* <IconCircleCheck size={28} color="var(--mantine-color-teal-5" /> */}
          <Text size="sm" c="dimmed">
            All caught up!
          </Text>
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
                <Text
                  size="sm"
                  truncate
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                >
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
TasksWidget.propTypes = {
  tasks: PropTypes.array,
  onToggle: PropTypes.func,
  onNavigate: PropTypes.func
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
    personal: 'orange'
  }

  return (
    <Paper withBorder radius="md" p="md" h="80%">
      <SectionHeader
        icon={IconCalendar}
        title="Upcoming"
        linkLabel="Open calendar"
        onLink={onNavigate}
      />

      {upcoming.length === 0 ? (
        <Stack align="center" gap={4} py="lg">
          <IconCalendar size={28} color="green" />
          <Text size="sm" c="dimmed">
            No events this week
          </Text>
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
                    flexShrink: 0
                  }}
                />
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>
                    {event.title}
                  </Text>
                  <Group gap={6}>
                    <Text size="xs" c="dimmed">
                      {formatDate(event.date || event.start)}
                    </Text>
                    {event.time && (
                      <>
                        <Text size="xs" c="dimmed">
                          ·
                        </Text>
                        <Text size="xs" c="dimmed">
                          {event.time}
                        </Text>
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
CalendarWidget.propTypes = {
  events: PropTypes.array,
  onNavigate: PropTypes.func
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
    purple: 'var(--mantine-color-violet-4)'
  }

  return (
    <Paper withBorder radius="md" p="md" h="80%">
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
        <Stack align="center" gap={4} py="lg">
          <IconChecklist size={28} color="green" />
          <Text size="sm" c="dimmed" ta="center" py="md">
            No notes yet
          </Text>
        </Stack>
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
                  background: 'var(--mantine-color-default-hover)'
                }}
              >
                <Text size="xs" lineClamp={2}>
                  {note.body || note.content}
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
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
QuickNotesWidget.propTypes = {
  notes: PropTypes.array,
  onAddNote: PropTypes.func,
  onNavigate: PropTypes.func
}
// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard({ onNavigate }) {
  const { tasks, toggleTask } = useTasks()
  const { notes, addNote } = useNotes()
  const { events = [] } = useCalendar()
  const { syncedEvents } = useCalendarSync(events)

  const overdue = tasks.filter(
    (t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()
  ).length

  // eslint-disable-next-line react-hooks/purity
  const random = useRef(Math.floor(Math.random() * 10) + 1)

  return (
    <Box p="xl" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <Stack gap={4} mb="xl">
        <Box
          style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}
        >
          <Image
            src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-${random}.png`}
            height={100}
            style={{ objectFit: 'cover', width: '100%' }}
            alt="banner"
          />
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 40%, var(--mantine-color-body) 100%)'
            }}
          />
          <Box style={{ position: 'absolute', bottom: 16, left: 16 }}>
            <Title order={2} fw={600} c="white">
              {greeting()}
            </Title>
            <Text size="sm" c="rgba(255,255,255,0.8)">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </Box>
        </Box>
        <Group gap={8}>
          {overdue > 0 && (
            <>
              <Text c="dimmed" size="sm">
                ·
              </Text>
              <Group gap={4}>
                <IconAlertCircle size={14} color="var(--mantine-color-red-5)" />
                <Text size="sm" c="red">
                  {overdue} overdue {overdue === 1 ? 'task' : 'tasks'}
                </Text>
              </Group>
            </>
          )}
        </Group>
        <Box bg="pink" h="1px" />
      </Stack>

      {/* Stat pills */}
      <Group gap="sm" mb="xl">
        {[
          {
            label: 'Tasks remaining',
            value: tasks.filter((t) => !t.completed).length,
            color: 'blue'
          },
          {
            label: 'Done today',
            value: tasks.filter((t) => t.completed && t.completedAt?.slice(0, 10) === todayKey())
              .length,
            color: 'teal'
          },
          {
            label: 'Events this week',
            value: events.filter((e) => isUpcoming(e.date || e.start)).length,
            color: 'violet'
          },
          {
            label: 'Notes',
            value: notes.filter((n) => !n.archived).length,
            color: 'orange'
          }
        ].map((stat) => (
          <Paper key={stat.label} withBorder radius="md" px="md" py="sm" style={{ minWidth: 120 }}>
            <Text size="xl" fw={700} c={stat.color}>
              {stat.value}
            </Text>
            <Text size="xs" c="dimmed">
              {stat.label}
            </Text>
          </Paper>
        ))}
      </Group>

      <Stack gap="md">
        <TasksWidget tasks={tasks} onToggle={toggleTask} onNavigate={() => onNavigate('tasks')} />
        <CalendarWidget events={syncedEvents} onNavigate={() => onNavigate('calendar')} />
        <QuickNotesWidget
          notes={notes}
          onAddNote={(text) =>
            addNote({
              title: 'Quick Note',
              body: text,
              tags: [],
              color: 'pink',
              pinned: false
            })
          }
          onNavigate={() => onNavigate('notes')}
        />
      </Stack>
    </Box>
  )
}
Dashboard.propTypes = {
  onNavigate: PropTypes.func
}
