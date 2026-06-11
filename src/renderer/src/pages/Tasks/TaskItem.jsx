import PropTypes from 'prop-types'

import { Card, Checkbox, Text, ActionIcon, Badge, Group } from '@mantine/core'
import { Bell, Clock, Pencil, Repeat, Trash } from 'lucide-react'

function priorityColor(priority) {
  const colors = {
    low: 'cyan',
    medium: 'teal',
    high: 'red',
    urgent: 'violet'
  }
  return colors[priority]
}

function formatReminder(minutes) {
  if (!minutes) return null
  const m = parseInt(minutes)
  if (m < 60) return `${m}m before`
  if (m < 1440) return `${m / 60}hr before`
  return `${m / 1440}d before`
}

function isOverdue(task) {
  if (!task.deadline || task.completed) return false
  return new Date(task.deadline) < new Date()
}
function overdueMessage(task) {
  const hoursOverdue = (new Date() - new Date(task.deadline)) / (1000 * 60 * 60)
  if (hoursOverdue < 1) return '⏰ Due very soon!'
  if (hoursOverdue < 24) return '😤 Overdue!'
  if (hoursOverdue < 48) return '🔥 Really overdue!'
  if (hoursOverdue < 72) return '💀 Very overdue!'
  return '🚨 Critically overdue!'
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const overdue = isOverdue(task)
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      style={{
        backgroundColor: overdue
          ? `color-mix(in srgb, var(--mantine-color-red-5) 15%, var(--mantine-color-body))`
          : `color-mix(in srgb, var(--mantine-color-${priorityColor(task.priority)}-5) 10%, var(--mantine-color-body))`,
        borderColor: overdue ? 'var(--mantine-color-red-6)' : undefined,
        borderWidth: overdue ? 2 : 1,
        animation: overdue ? 'pulse 2s ease-in-out infinite' : 'none'
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap={'sm'} wrap="nowrap">
          <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
          <div>
            <Group gap="xs">
              <Text
                td={task.completed ? 'line-through' : undefined}
                c={task.completed ? 'dimmed' : undefined}
              >
                {task.text}
              </Text>
              {/* Refine this like prod the user into finishing the job */}
              {/* angry overdue indicator */}
              {overdue && (
                <Text size="xs" c="red" fw={600}>
                  {overdueMessage(task)}
                </Text>
              )}
            </Group>
          </div>
        </Group>
        <Group gap={'xs'}>
          <ActionIcon variant="subtle" color="green" onClick={onEdit}>
            <Pencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => onDelete(task.id)}>
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <Group gap={'xs'} mt={'sm'}>
        <Badge variant="light" size="sm" color={priorityColor(task.priority)}>
          {task.priority}
        </Badge>
        {task.recurring && (
          <Badge variant="light" color="blue" size="xs" leftSection={<Repeat size={10} />}>
            {task.frequency}
          </Badge>
        )}
        {task.deadline && (
          <Badge variant="light" color="gray" size="xs" leftSection={<Clock size={10} />}>
            {new Date(task.deadline).toLocaleDateString()}
          </Badge>
        )}
        {task.reminder && (
          <Badge variant="light" color="yellow" size="sm" leftSection={<Bell size={10} />}>
            {formatReminder(task.reminder)}
          </Badge>
        )}
      </Group>
    </Card>
  )
  // problem is that it the colors might work in light mode bit not in dark mode doesnt mantine have built in  theme responsive colors
}
TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.any,
    text: PropTypes.string,
    priority: PropTypes.string,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    recurring: PropTypes.bool,
    frequency: PropTypes.string,
    reminder: PropTypes.string,
    customInterval: PropTypes.number,
    customUnit: PropTypes.string,
    completed: PropTypes.bool
  }),
  onToggle: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}
