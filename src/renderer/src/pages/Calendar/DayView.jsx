// same as WeekView but single column
// props: events, selectedDate, onEventClick, onSlotClick, dragHandlers
import { Box, Button, Grid,  Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";

import { getHourSlots, getEventsForDay, getEventPosition, isToday } from './useCalendarGrid'

export default function DayView({ events = [], selectedDate = new Date(), onEventClick, onSlotClick, dragHandlers }) {
  const hourSlots = getHourSlots()
  const dayEvents = getEventsForDay(events, selectedDate)
  const today = isToday(selectedDate)
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* scrollable time grid */}
      <Box style={{ overflowY: 'auto', flex: 1 }}>
        <Box style={{ display: 'grid', gridTemplateColumns: '60px 1fr', position: 'relative' }}>

          {/* hour labels */}
          <Box>
            {hourSlots.map(slot => (
              <Box key={slot.hour} style={{ height: 60 }}>
                <Text size='xs' c='dimmed'>{slot.label}</Text>
              </Box>
            ))}
          </Box>

          {/* single day column */}
          <Box style={{ position: 'relative', borderLeft: '1px solid var(--mantine-color-default-border)', cursor: 'pointer' }}>
            {hourSlots.map(slot => (
              <Box key={slot.hour} style={{ height: 60, borderBottom: '1px solid var(--mantine-color-default-border)' }}
                onClick={() => onSlotClick(selectedDate, slot.hour)}
                {...dragHandlers}
              />
            ))}
            {/* events — absolutely positioned */}
            {dayEvents.map(event => {
              const { top, height } = getEventPosition(event, selectedDate)
              return (
                <Box key={event.id} style={{
                  position: 'absolute',
                  top: `${top}%`,
                  height: `${height}%`,
                  width: '90%',
                  left: '5%',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
                  onClick={() => onEventClick(event)}
                >
                  <Text size='xs' fw={600}>{event.title}</Text>
                </Box>
              )
            })}
          </Box>

        </Box>
      </Box>
    </Box>
  )
}