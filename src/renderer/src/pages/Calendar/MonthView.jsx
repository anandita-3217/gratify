// props: events, selectedDate, onDateSelect, onEventClick, onSlotClick
import { Box, Button, Grid,  Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";

import { getMonthGrid, getEventsForDay, isToday, isSameDay } from './useCalendarGrid'

export default function MonthView({ events = [], selectedDate = new Date(), onDateSelect, onEventClick, onSlotClick }) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const grid = getMonthGrid(year, month)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Box>
      {/* day name headers */}
      <Grid columns={7}>
        {dayNames.map(d => (
          <Grid.Col key={d} span={1}>
            <Text size='xs' c='dimmed' ta='center'>{d}</Text>
          </Grid.Col>
        ))}
      </Grid>

      {/* day cells */}
      <Grid columns={7} style={{ border: '1px solid var(--mantine-color-default-border)' }}>
        {grid.map((date, i) => {
          const dayEvents = getEventsForDay(events, date)
          const isCurrentMonth = date.getMonth() === month
          const isSelected = isSameDay(date, selectedDate)
          const today = isToday(date)

          return (
            <Grid.Col key={i} span={1}
              style={{ 
                borderRight: '1px solid var(--mantine-color-default-border)',
                borderBottom: '1px solid var(--mantine-color-default-border)',
                minHeight: 100,
                cursor: 'pointer',
                opacity: isCurrentMonth ? 1 : 0.3
              }}
              onClick={() => onDateSelect(date)}
            >
              {/* day number */}
              {/* events pills */}
            </Grid.Col>
          )
        })}
      </Grid>
    </Box>
  )
}