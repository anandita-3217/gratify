import {
  Checkbox,
  Stack,
  TextInput,
  Modal,
  Group,
  Select,
  Button,
  Textarea,
  ColorSwatch,
  useMantineTheme
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useState } from 'react'
import PropTypes from 'prop-types'
const colors = [
  'orange',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow'
]

export default function EventModal({
  opened,
  onSave,
  onClose,
  onDelete,
  onCreateTask,
  event,
  defaultStart,
  defaultEnd
}) {
  const theme = useMantineTheme()

  const [title, setTitle] = useState(event?.title ?? 'Untitled')
  const [description, setDescription] = useState(event?.description ?? '')
  const [start, setStart] = useState(event?.start ? new Date(event.start) : (defaultStart ?? null))
  const [end, setEnd] = useState(event?.end ? new Date(event.end) : (defaultEnd ?? null))
  const [allDay, setAllDay] = useState(event?.allDay ?? false)
  const [recurring, setRecurring] = useState(event?.recurring ?? false)
  const [frequency, setFrequency] = useState(event?.frequency ?? null)
  const [color, setColor] = useState(event?.color ?? 'pink')

  const [titleError, setTitleError] = useState('')
  const [startError, setStartError] = useState('')
  const [endError, setEndError] = useState('')

  function handleSave() {
    if (!title.trim()) {
      setTitleError('Title cannot be empty')
      return
    }
    if (!start) {
      setStartError('Start Time cannot be empty')
      return
    }
    if (!end) {
      setEndError('End Time cannot be empty')
      return
    }
    setTitleError('')
    onSave({ title, description, start, end, allDay, frequency, color })
    onClose()
  }

  return (
    <Modal
      size="100%"
      opened={opened}
      onClose={onClose}
      title={event ? 'Edit event' : 'New event'}
      centered
      styles={{
        title: {
          color: `var(--mantine-color-${theme.primaryColor}-5)`,
          fontSize: '25px',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%'
        },
        header: { justifyContent: 'center' },
        content: {
          border: `2px solid var(--mantine-color-${theme.primaryColor}-5)`,
          borderRadius: '15px'
        }
      }}
    >
      <Stack gap="md">
        <TextInput
          withAsterisk
          label="Title"
          aria-label="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
        />

        <Textarea
          label="Description"
          aria-label="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Checkbox
          aria-label="all-day"
          label="All Day"
          checked={allDay}
          onChange={(e) => setAllDay(e.currentTarget.checked)}
        />
        <Group grow align="flex-end">
          <DateTimePicker
            minDate={new Date()}
            label="Start"
            aria-label="start"
            withAsterisk
            value={start}
            onChange={setStart}
            error={startError}
          />
          <DateTimePicker
            minDate={new Date()}
            label="End"
            aria-label="end"
            withAsterisk
            value={end}
            onChange={setEnd}
            error={endError}
            disabled={allDay}
          />
        </Group>
        <Checkbox
          aria-label="recurring"
          label="Recurring"
          checked={recurring}
          onChange={(e) => setRecurring(e.currentTarget.checked)}
        />
        {recurring && (
          <Select
            aria-label="frequency"
            label="Frequency"
            value={frequency}
            onChange={setFrequency}
            data={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' }
            ]}
          />
        )}
        <Group gap="xs">
          {colors.map((c) => (
            <ColorSwatch
              key={c}
              color={`var(--mantine-color-${c}-5)`}
              size={24}
              style={{ cursor: 'pointer', outline: color == c ? '2px solid white' : 'none' }}
              onClick={() => setColor(c)}
            />
          ))}
        </Group>
        <Group justify="center">
          {event && onDelete && (
            <Button
              variant="subtle"
              onClick={() => {
                onDelete(event.id)
                onClose()
              }}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleSave}>{event ? 'Save' : 'Add'}</Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              onCreateTask({ title, start })
            }}
          >
            Create Task
          </Button>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
        </Group>
        {/* Event modal isnot making the event a task */}
      </Stack>
    </Modal>
  )
}
EventModal.propTypes = {
  opened: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onCreateTask: PropTypes.func,
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    allDay: PropTypes.bool,
    recurring: PropTypes.bool,
    frequency: PropTypes.string,
    color: PropTypes.string,
    isTaskEvent: PropTypes.bool,
    taskId: PropTypes.number
  }),
  defaultStart: PropTypes.instanceOf(Date),
  defaultEnd: PropTypes.instanceOf(Date)
}
