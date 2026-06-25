// props: events, selectedDate, onDateSelect, onEventClick, onSlotClick
import { ActionIcon, Box, Grid, Group, Text, useMantineTheme } from '@mantine/core'
import PropTypes from 'prop-types'
import { getMonthGrid, getEventsForDay, isToday } from './useCalendarGrid'
import { Plus } from 'lucide-react'
import EventCard from './EventCard'

export default function MonthView({
  events = [],
  selectedDate = new Date(),
  onDateSelect,
  onEventClick,
  onSlotClick,
  weekStartsOn = 'sunday'
}) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const grid = getMonthGrid(year, month, weekStartsOn)
  const dayNames =
    weekStartsOn === 'monday'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const theme = useMantineTheme()

  return (
    <Box>
      <Box ta="center" py="sm"></Box>
      {/* day name headers */}
      <Grid columns={7}>
        {dayNames.map((d) => (
          <Grid.Col key={d} span={1}>
            <Text size="xs" c="dimmed" ta="center">
              {d}
            </Text>
          </Grid.Col>
        ))}
      </Grid>

      {/* day cells */}
      <Grid columns={7}>
        {grid.map((date, i) => {
          const dayEvents = getEventsForDay(events, date)
          const isCurrentMonth = date.getMonth() === month
          // const isSelected = isSameDay(date, selectedDate)
          const today = isToday(date)

          return (
            <Grid.Col
              key={i}
              span={1}
              className="group"
              style={{
                border: '1px solid var(--mantine-color-default-border)',
                minHeight: 100,
                cursor: 'pointer',
                opacity: isCurrentMonth ? 1 : 0.3,
                borderColor: today ? theme.primaryColor : 'dimmed',
                position: 'relative'
              }}
              onClick={() => onDateSelect(date)}
            >
              {/* day number */}
              <Group justify="space-between" align="center" mb={4}>
                <Text
                  size="sm"
                  fw={today ? 700 : 400}
                  c={today ? theme.primaryColor : 'dimmed'}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {date.getDate()}
                </Text>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlotClick(date, 9)
                  }}
                >
                  <Plus size={12} />
                </ActionIcon>
              </Group>
              {/* events pills */}
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={onEventClick} compact />
              ))}
            </Grid.Col>
          )
        })}
      </Grid>
    </Box>
  )
}
MonthView.propTypes = {
  events: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func,
  onEventClick: PropTypes.func,
  onSlotClick: PropTypes.func,
  weekStartsOn: PropTypes.string
}
