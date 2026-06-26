import TaskItem from './TaskItem'
import TaskModal from './TaskModal'
import {
  Box,
  Badge,
  Chip,
  Group,
  TextInput,
  Button,
  Stack,
  Text,
  Title,
  Progress,
  Select,
  Divider,
  useMantineTheme
} from '@mantine/core'
import { Plus, PlusIcon, SlidersHorizontal, Search } from 'lucide-react'

import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import useTasks from './useTasks'
import useCalendar from '../Calendar/useCalendar'
import useNotifications from '../../hooks/useNotifications'
import { useSettings } from '../../context/SettingsContext'

import * as chrono from 'chrono-node'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'

export default function Tasks() {
  const { tasks, addTask, deleteTask, toggleTask, updateTask } = useTasks()
  const { showCompleted, defaultPriority } = useSettings()
  const { addEvent } = useCalendar()
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')

  const [opened, { open, close }] = useDisclosure(false)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [sort, setSort] = useState('created-desc') // 'created' | 'deadline' | 'priority'
  const [filter, setFilter] = useState({
    priority: [], // all, low, med,high, urgent
    status: 'all', // all, active, completed
    frequency: [] // daily, weekly, monthly, custom, null
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }

  function parseQuickTask(input) {
    let text = input
    let priority = 'low'
    let deadline = null
    let reminder = null
    let addToCalendar = false

    // Priorities
    const priorities = ['low', 'medium', 'high', 'urgent']
    priorities.forEach((p) => {
      if (text.toLowerCase().includes(p)) {
        priority = p
        text = text.replace(new RegExp(p, 'i'), '').trim()
      }
    })

    // @ time format — "Meeting @9pm John Doe" → task: "Meeting John Doe", deadline: 9pm
    const atTimeMatch = text.match(/^(.+?)\s*@\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*(.*)$/i)
    if (atTimeMatch) {
      const taskText = (atTimeMatch[1] + ' ' + (atTimeMatch[3] ?? '')).trim()
      const timeStr = atTimeMatch[2].trim()
      const parsed = chrono.parse(timeStr, new Date(), { forwardDate: true })
      if (parsed.length > 0) {
        deadline = parsed[0].start.date()
        text = taskText
      }
    }

    // dd/mm/yyyy date format
    const ddmmyyyy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (ddmmyyyy) {
      const [full, day, month, year] = ddmmyyyy
      deadline = new Date(year, month - 1, day)
      text = text.replace(full, '').trim()
    }

    // chrono natural language date — only if deadline not already set
    if (!deadline) {
      const parsed = chrono.parse(text, new Date(), { forwardDate: true })
      if (parsed.length > 0) {
        deadline = parsed[0].start.date()
        text = text.replace(parsed[0].text, '').trim()
      }
    }

    // custom reminder — "remind me in 30 mins"
    const customReminderMatch = text.match(/remind me in\s+(\d+)\s*(min(?:ute)?s?|hour?s?)/i)
    if (customReminderMatch) {
      const amount = parseInt(customReminderMatch[1])
      const unit = customReminderMatch[2].toLowerCase()
      reminder = unit.startsWith('min') ? String(amount) : String(amount * 60)
      text = text.replace(customReminderMatch[0], '').trim()
    }

    // preset reminder — "remind me 1 hour before"
    const reminderMatch = text.match(/remind me\s+(\d+)\s*(min(?:ute)?s?|hour?s?|day?s?)\s*before/i)
    if (reminderMatch) {
      const amount = parseInt(reminderMatch[1])
      const unit = reminderMatch[2].toLowerCase()
      if (unit.startsWith('min')) reminder = String(amount)
      else if (unit.startsWith('hour')) reminder = String(amount * 60)
      else if (unit.startsWith('day')) reminder = String(amount * 1440)
      text = text.replace(reminderMatch[0], '').trim()
    }

    if (text.toLowerCase().includes('+cal')) {
      addToCalendar = true
      text = text.replace(/\+cal/i, '').trim()
    }
    // clean up any leftover @ time residue
    text = text.replace(/@\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)/i, '').trim()
    // clean up double spaces
    text = text.replace(/\s+/g, ' ').trim()

    return { text, priority, deadline, reminder, addToCalendar }
  }

  function handleAdd() {
    if (!input.trim()) return
    const parsed = parseQuickTask(input)
    addTask({
      ...parsed,
      recurring: false,
      frequency: null
    })
    setInput('')
  }

  function handleEdit(task) {
    setSelectedTask(task)
    openEdit()
  }

  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const filteredTasks = tasks.filter((task) => {
    if (search) {
      const s = search.toLowerCase()
      if (!task.text.toLowerCase().includes(s)) return false
    }
    if (filter.priority.length > 0 && !filter.priority.includes(task.priority)) return false
    if (filter.status === 'active' && task.completed) return false
    if (filter.status === 'completed' && !task.completed) return false
    if (filter.frequency.length > 0 && !filter.frequency.includes(task.frequency)) return false
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sort) {
      case 'priority-desc':
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case 'priority-asc':
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'deadline-asc':
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      case 'deadline-desc':
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(b.deadline) - new Date(a.deadline)
      case 'created-asc':
        return a.id - b.id

      case 'created-desc':
      default:
        return b.id - a.id
    }
  })
  // filter completed tasks based on showCompleted setting
  const visibleTasks = showCompleted ? sortedTasks : sortedTasks.filter((t) => !t.completed)
  const { notify } = useNotifications()

  const taskRef = useRef(tasks)

  const firedReminders = useRef(new Set())

  const theme = useMantineTheme()

  useEffect(() => {
    taskRef.current = tasks
  }, [tasks])

  useEffect(() => {
    const interval = setInterval(() => {
      taskRef.current.forEach((task) => {
        if (!task.deadline || !task.reminder || task.completed) return

        const deadline = new Date(task.deadline)
        const now = new Date()
        const minutesUntilReminder = (deadline - now) / 1000 / 60
        const reminderMinutes = parseInt(task.reminder)

        const reminderKey = `${task.id} -${task.reminder}`

        if (
          minutesUntilReminder <= reminderMinutes &&
          minutesUntilReminder > reminderMinutes - 1 &&
          !firedReminders.current.has(reminderKey)
        ) {
          firedReminders.current.add(reminderKey)
          notify({
            title: `Reminder: ${task.text}`,
            message: `Due: ${deadline.toLocaleString()}`,
            color: 'pink'
          })
        }
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [notify])

  useKeyboardShortcuts([{ key: 'Enter', ctrl: true, action: parseQuickTask }], [input])

  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={4} mb="xl">
        <Group gap={8} justify="space-between">
          <Title
            order={2}
            fw={600}
            style={{ color: `var(--mantine-color-${theme.primaryColor}-5)` }}
          >
            Tasks
          </Title>
          <Button variant="subtle" size="sm" onClick={open} aria-label="New Task">
            <PlusIcon size={18} />
          </Button>
        </Group>
        <Text c="dimmed" size="sm">
          Organize your tasks!
        </Text>
        <Divider color={theme.primaryColor} />
        <Stack mt={'xl'}>
          <Progress value={percentage} />
        </Stack>
      </Stack>
      <Stack p="md">
        <div className="flex gap-2">
          <TextInput
            placeholder="eg. Meeting with John next Friday at 3pm urgent "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1"
          />
          <Button onClick={handleAdd}>
            <Plus size={16} />
          </Button>
        </div>

        <Group justify="space-between" mb={'xs'}>
          <Group gap={'xs'}>
            <Button
              variant="light"
              size="xs"
              leftSection={<SlidersHorizontal size={14} />}
              onClick={() => setFiltersOpen((f) => !f)}
            >
              Filter & Search
            </Button>
            {(filter.priority.length > 0 ||
              filter.frequency.length > 0 ||
              filter.status !== 'all') && (
              <Badge size={'sm'} variant="light">
                {filter.priority.length +
                  filter.frequency.length * (filter.status !== 'all' ? 1 : 0)}{' '}
                active
              </Badge>
            )}
          </Group>
          {(filter.priority.length > 0 ||
            filter.frequency.length > 0 ||
            filter.status !== 'all') && (
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setFilter({ priority: [], status: 'all', frequency: [] })}
            >
              Clear
            </Button>
          )}
        </Group>
        {filtersOpen && (
          <Stack
            gap={'xs'}
            mb={'md'}
            p={'sm'}
            style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 8 }}
          >
            <TextInput
              placeholder="Search Tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<Search size={16} />}
            />
            <Group gap={'xs'} align="center">
              <Text size="xs" c={'dimmed'} w={60}>
                Status
              </Text>
              <Chip.Group
                value={filter.status}
                onChange={(val) => setFilter((f) => ({ ...f, status: val }))}
              >
                <Group gap={'xs'}>
                  <Chip fz="xs" value="all" size="sm">
                    All
                  </Chip>
                  <Chip fz="xs" value="active" size="sm">
                    Active
                  </Chip>
                  <Chip fz="xs" value="completed" size="sm">
                    Completed
                  </Chip>
                </Group>
              </Chip.Group>
            </Group>

            <Group gap={'xs'} align="center">
              <Text size="xs" c={'dimmed'} w={60}>
                Priority
              </Text>
              <Chip.Group
                multiple
                value={filter.priority}
                onChange={(val) => setFilter((f) => ({ ...f, priority: val }))}
              >
                <Group gap={'xs'}>
                  <Chip fz="xs" value="low" color="#0c8599" size="sm">
                    Low
                  </Chip>
                  <Chip fz="xs" value="medium" color="#099268" size="sm">
                    Medium
                  </Chip>
                  <Chip fz="xs" value="high" color="#e03131" size="sm">
                    High
                  </Chip>
                  <Chip fz="xs" value="urgent" color="#6741d9" size="sm">
                    Urgent
                  </Chip>
                </Group>
              </Chip.Group>
            </Group>

            <Group gap={'xs'} align="center">
              <Text size="xs" c={'dimmed'} w={60}>
                Repeat
              </Text>
              <Chip.Group
                multiple
                value={filter.frequency}
                onChange={(val) => setFilter((f) => ({ ...f, frequency: val }))}
              >
                <Group gap={'xs'}>
                  <Chip fz="xs" value="daily" size="sm">
                    Daily
                  </Chip>
                  <Chip fz="xs" value="weekly" size="sm">
                    Weekly
                  </Chip>
                  <Chip fz="xs" value="monthly" size="sm">
                    Monthly
                  </Chip>
                  <Chip fz="xs" value="custom" size="sm">
                    Custom
                  </Chip>
                </Group>
              </Chip.Group>
            </Group>

            <Group gap={'xs'} align="center">
              <Text size="xs" c={'dimmed'} w={60}>
                Sort
              </Text>
              <Select
                size="xs"
                value={sort}
                onChange={setSort}
                style={{ width: 180 }}
                data={[
                  { value: 'created-desc', label: '↓ Newest first' },
                  { value: 'created-asc', label: '↑  Oldest first' },
                  { value: 'deadline-asc', label: '↑  Deadline (earlest)' },
                  { value: 'deadline-desc', label: '↓ Deadline (latest)' },
                  { value: 'priority-asc', label: '↑  Priority (low→urgent)' },
                  { value: 'priority-desc', label: '↓ Priority (urgent→low)' }
                ]}
              />
            </Group>
          </Stack>
        )}
        <Stack gap="sm">
          {visibleTasks.length === 0 ? (
            <Box
              p="xl"
              style={{
                textAlign: 'center',
                border: '2px dashed var(--mantine-color-default-border)',
                borderRadius: '12px'
              }}
            >
              <Text c="dimmed" size="sm">
                {tasks.length === 0 ? 'No tasks yet - add some!' : 'No tasks match your filters'}
              </Text>
            </Box>
          ) : (
            visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={() => handleEdit(task)}
              />
            ))
          )}
        </Stack>
      </Stack>
      <TaskModal
        key={`new-${defaultPriority}`}
        opened={opened}
        onClose={close}
        onSave={(taskData) => {
          const task = addTask(taskData)
          if (taskData.addToCalendar && taskData.deadline) {
            const start = new Date(taskData.deadline)
            const end = new Date(taskData.deadline)
            end.setHours(end.getHours() + 1)
            addEvent({
              title: taskData.text,
              start: start.toISOString(),
              end: end.toISOString(),
              color: 'pink',
              allDay: false,
              taskId: task.id,
              isTaskEvent: false // user created, so editable
            })
          }
          close()
        }}
        task={null}
      />
      <TaskModal
        key={selectedTask?.id ?? 'edit'}
        opened={editOpened}
        onClose={closeEdit}
        onSave={(taskData) => {
          updateTask(selectedTask.id, taskData)
          closeEdit()
        }}
        task={selectedTask}
      />
    </Box>
  )
}
