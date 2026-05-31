
// drag handlers passed in from index.jsx via useDragToCreate
import { Box, Button, Grid,  Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";

import { getWeekDays, getHourSlots, getEventsForDay, getEventPosition, isToday } from './useCalendarGrid'
import { useEffect, useState } from "react";

export default function WeekView({ events = [], selectedDate = new Date(), onEventClick, onSlotClick, onDayClick, dragHandlers }) {
  const [now, setNow] = useState(new Date())

  const weekDays = getWeekDays(selectedDate)
  const hourSlots = getHourSlots()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()),60000)
    return () => clearInterval(interval)
  },[])

  const nowPosition = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100
  
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* header row — day names + dates */}
      <Box style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        
        <Box /> {/* empty corner */}
        {weekDays.map((day, i) => {
            const today = isToday(day)
          return (<Box key={i} ta='center'
            border= { today ? '#cc225c' : 'dimmed'} 
            style={{
              cursor: 'pointer'
            }}
            onClick={() => onDayClick(day)}>
            {/* day name */}
            <Text>
              {day.toLocaleString('default', { weekday: 'short' })}
            </Text>
            <Text 
            fw={ today ? 700 : 400}
            c={today ? '#cc225c' : 'dimmed'}
            >
              {day.toLocaleString('default', { day: '2-digit' })}
            </Text>

            {/* date number — highlight if today */}
          </Box>)
})}
      </Box>

      {/* scrollable time grid */}
      <Box style={{ overflowY: 'auto', flex: 1, position: 'relative' }}>
        <Box style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)' }}>

          {/* hour labels column */}
          <Box>
            {hourSlots.map(slot => (
              <Box key={slot.hour} style={{ height: 60 }}>
                <Text size='xs' c='dimmed'>{slot.label}</Text>
              </Box>
            ))}
          </Box>

          {/* day columns */}
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(events, day)
            return (
              <Box key={i} style={{ position: 'relative', borderLeft: '1px solid var(--mantine-color-default-border)' }}>
                {/* hour slot cells */}
                {hourSlots.map(slot => (
                  <Box key={slot.hour} style={{ height: 60, borderBottom: '1px solid var(--mantine-color-default-border)', cursor: 'pointer' }}
                    onClick={() => onSlotClick(day, slot.hour)}
                    {...dragHandlers}
                  />
                ))}
                {isToday(day) && (
                 <Box
                 style={{
                   position: 'absolute',
                   top: `${nowPosition}%`,
                   left: 0,
                   right: 0,
                   height: 2,
                   backgroundColor: 'var(--mantine-color-red-8)',
                   zIndex: 2,
                   pointerEvents: 'none'
                 }}
                 />
                )}
                {/* events — absolutely positioned */}
                {dayEvents.map(event => {
                  const { top, height } = getEventPosition(event, day)
                  return (
                    <Box key={event.id} style={{
                      position: 'absolute',
                      top: `${top}%`,
                      height: `${height}%`,
                      width: '90%',
                      left: '5%',
                      backgroundColor: `var(--mantine-color-${event.color}-5)`,
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
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}