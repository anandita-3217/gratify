/* eslint-disable prettier/prettier */
import {
  Box,
  Checkbox,
  Stack,
  Text,
  TextInput,
  Modal,
  Group,
  Select,
  Button,
  NumberInput,
  SegmentedControl,
  useMantineTheme
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSettings } from '../../context/SettingsContext'
function PriorityOption(props) {
  const { option } = props
  const colors = {
    low: '#0c8599',
    medium: '#099268',
    high: '#e03131',
    urgent: '#6741d9'
  }
  return (
    <Group gap="sm">
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: colors[option.value],
        flexShrink: 0
      }}/>
      <span>{option.label}</span>
    </Group>
  )
}

PriorityOption.propTypes = {
  option: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })
}


export default function TaskModal({ opened, onSave, onClose, onDelete, task }) {

  const { defaultPriority } = useSettings()

  const [text, setText] = useState(task?.text ?? '')
  const [priority, setPriority] = useState(task?.priority ?? defaultPriority)
  
  const [date, setDate] = useState(task?.deadline ? new Date(task.deadline) : null)
  const [recurring, setRecurring] = useState(task?.recurring ?? false)
  const [addToCalendar, setAddToCalendar] = useState(false)
  const [frequency, setFrequency] = useState(task?.frequency ?? null)
  const [reminder, setReminder] = useState(task?.reminder ?? null)
  const [reminderType, setReminderType] = useState('preset')
  const [customReminderAmount, setCustomReminderAmount] = useState(15)
  const [customReminderUnit, setCustomReminderUnit] = useState('minutes')
  const [customInterval, setCustomInterval] = useState(task?.customInterval ?? 1)
  const [customUnit, setCustomUnit] = useState(task?.customUnit ?? 'days')
  const [textError, setTextError] = useState('')
  const [priorityError, setPriorityError] = useState('')

  const theme = useMantineTheme()

  function handleSave() {
    if (!text.trim()) {
      setTextError('Task cannot be empty')
      return
    }
    if (!priority) {
      setPriorityError('Choose priority')
      return
    }

    let finalReminder = null
    if (date) {
      if (reminderType === 'preset' && reminder) {
        finalReminder = reminder
      } else if (reminderType === 'custom') {
        const multipliers = { minutes: 1, hours: 60, days: 1440 }
        finalReminder = String(customReminderAmount * multipliers[customReminderUnit])
      }
    }
    setTextError('')
    setPriorityError('')
    onSave({
      text,
      priority,
      deadline: date,
      addToCalendar,
      recurring,
      frequency,
      reminder: finalReminder,
      customInterval: frequency === 'custom' ? customInterval : null,
      customUnit: frequency === 'custom' ? customUnit : null
    })
    onClose()
  }
  return (
    <Modal
      size={'100%'}
      opened={opened}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add Task'}
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
        content: { border: `2px solid var(--mantine-color-${theme.primaryColor}-5)`, borderRadius: '15px' }
      }}
    >
      <Box>
        <Stack gap={'md'}>
          <TextInput
            withAsterisk
            label="Task Name"
            value={text}
            error={textError}
            onChange={(e) => setText(e.target.value)}
          />
          <Select
            withAsterisk
            label="Priority"
            value={priority}
            onChange={setPriority}
            data={['low', 'medium', 'high', 'urgent']}
            renderOption={PriorityOption}
            error={priorityError}
          />
          <Group grow>
            <DateTimePicker
              value={date}
              onChange={setDate}
              label="Deadline"
              placeholder="Deadline"
              minDate={new Date()}
            />
            {date && (
              <Stack gap={'xs'}>
                <Text size="sm" fw={500}>
                  Reminder
                </Text>
                <SegmentedControl
                  value={reminderType}
                  onChange={setReminderType}
                  data={[
                    { label: 'Preset', value: 'preset' },
                    { label: 'Custom', value: 'custom' }
                  ]}
                  size="xs"
                />
                {reminderType === 'preset' ? (
                  <Select
                    label="Remind me"
                    value={reminder}
                    onChange={setReminder}
                    placeholder="No reminder"
                    data={[
                      { label: '15 minutes before', value: '15' },
                      { label: '30 minutes before', value: '30' },
                      { label: '1 hour before', value: '60' },
                      { label: '3 hours before', value: '180' },
                      { label: '1 day before', value: '1440' }
                    ]}
                    clearable
                  />
                ) : (
                  <Group grow>
                    <NumberInput
                      label="Amount"
                      value={customReminderAmount}
                      onChange={setCustomReminderAmount}
                      min={1}
                    />
                    <Select
                      label="Unit"
                      value={customReminderUnit}
                      onChange={setCustomReminderUnit}
                      data={['minutes', 'hours', 'days']}
                    />
                  </Group>
                )}
              </Stack>
            )}
            {date && (
              <Checkbox label="Add to Calendar" checked={addToCalendar} onChange={(e) => setAddToCalendar(e.currentTarget.checked)}/>
            )

            }
          </Group>

          <Checkbox
            checked={recurring}
            onChange={(e) => setRecurring(e.currentTarget.checked)}
            label="Recurring"
          />
          {recurring && (
            <Select
              label="Frequency"
              value={frequency}
              onChange={setFrequency}
              data={['daily', 'weekly', 'monthly', 'custom']}
            />
          )}
          {frequency === 'custom' && (
            <Group grow>
              <NumberInput
                label="Every"
                value={customInterval}
                onChange={setCustomInterval}
                min={1}
              />
              <Select
                label="Unit"
                value={customUnit}
                onChange={setCustomUnit}
                data={['days', 'weeks', 'months']}
              />
            </Group>
          )}
          <Group justify="center">
          {task && onDelete && (
            <Button color="red" variant="subtle" onClick={() => { onDelete(task.id); onClose() }}>
              Delete
            </Button>
          )}
          <Button  onClick={handleSave}>{task ? 'Save' : 'Add'}</Button>
          <Button  variant="subtle" onClick={onClose}>Cancel</Button>
        </Group>
        </Stack>
      </Box>
    </Modal>
  )
}
TaskModal.propTypes = {
  opened: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  task: PropTypes.shape({
    id: PropTypes.any,
    text: PropTypes.string,
    priority: PropTypes.string,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    recurring: PropTypes.bool,
    frequency: PropTypes.string,
    reminder: PropTypes.string,
    customInterval: PropTypes.number,
    customUnit: PropTypes.string
  })
}
