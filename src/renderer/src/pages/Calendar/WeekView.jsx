import { ActionIcon, Box, Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { 
  getEventsForDay,
  getHourSlots,
  getWeekDays,
  getEventPosition,
  isToday
} from './useCalendarGrid'
import { Plus } from 'lucide-react'

import PropTypes from 'prop-types'

export default function WeekView({
  events = [],
  selectedDate = new Date(),
  onEventClick,
  // onDayClick,
  onSlotClick,
  dragHandlers
}) {
  // TODO: sth like freeze panes for week and mont views so day labels stay in vision
  const [now, setNow] = useState(new Date())
  const currentHourRef = useRef(null)

  const weekDays = getWeekDays(selectedDate)
  const hourSlots = getHourSlots()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentHourRef.current) {
        currentHourRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const nowPosition = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
  const isCurrentWeek = weekDays.some((d) => isToday(d))

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)' }}>
        <Box />
        {weekDays.map((day, i) => {
          const today = isToday(day)
          const hasEvents = getEventsForDay(events, day).length > 0
          return (
            <Box
              key={i}
              ta="center"
              border="1px solid #fff "
              style={{ cursor: 'pointer' }}
              onClick={() => onEventClick(day)}
            >
              <Text c={today ? '#cc225c' : 'dimmed'} fw={today ? 700 : 400}>
                {day.toLocaleString('default', { weekday: 'short' })}
              </Text>
              <Text c={today ? '#cc225c' : 'dimmed'} fw={today ? 700 : 400}>
                {day.toLocaleString('default', { day: '2-digit' })}
              </Text>
              {hasEvents && (
                <Box
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-cyan-6)',
                    margin: '2px auto 0'
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>
      <Box style={{ overflowY: 'auto', flex: 1, height: '600px' }}>
        <Box style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)' }}>
          <Box>
            {hourSlots.map((slot) => (
              <Box key={slot.hour} style={{ height: 60, paddingRight: 8 }}>
                <Text
                  size="xs"
                  ta="right"
                  c={slot.hour === now.getHours() && isCurrentWeek ? '#cc225c' : 'dimmed'}
                  fw={slot.hour === now.getHours() && isCurrentWeek ? 700 : 400}
                >
                  {slot.label}
                </Text>
              </Box>
            ))}
          </Box>
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(events, day)
            const today = isToday(day)
            return (
              <Box
                key={i}
                style={{
                  position: 'relative',
                  borderLeft: '1px solid var(--mantine-color-default-border)'
                }}
              >
                {hourSlots.map((slot) => (
                  <Box
                    key={slot.hour}
                    ref={slot.hour === now.getHours() && today ? currentHourRef : null}
                    onMouseDown={(e) => dragHandlers?.onMouseDown?.(e, day, slot.hour)}
                    onMouseMove={(e) => dragHandlers?.onMouseMove?.(e, day, slot.hour)}
                    onMouseUp={(e) => dragHandlers?.onMouseUp?.(e)}
                    className="group"
                    style={{
                      height: 60,
                      borderBottom: '1px solid var(--mantine-color-default-border)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSlotClick(day, slot.hour)}
                  >
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      className="opacity-0 group-hover:opacity-100"
                      style={{ position: 'absolute', top: 4, right: 4 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSlotClick(day, slot.hour)
                      }}
                    >
                      <Plus size={12} />
                    </ActionIcon>
                  </Box>
                ))}
                {today && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: `${nowPosition}%`,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: 'var(--mantine-color-red-6)',
                      zIndex: 2,
                      pointerEvents: 'none'
                    }}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        left: -4,
                        top: -4,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-color-red-6)'
                      }}
                    />
                  </Box>
                )}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event, day)
                  return (
                    <Box
                      key={event.id}
                      style={{
                        position: 'absolute',
                        top: `${top}%`,
                        height: `${Math.max(height, 2)}%`,
                        width: '90%',
                        left: '5%',
                        backgroundColor: `var(--mantine-color-${event.color}-5)`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        padding: '2px 4px',
                        overflow: 'hidden',
                        zIndex: 1
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <Text size="xs" c="white">
                        {event.title}
                      </Text>
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
WeekView.propTypes = {
  events: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
  onEventClick: PropTypes.func,
  onSlotClick: PropTypes.func,
  onDayClick: PropTypes.func,
  dragHandlers: PropTypes.shape({
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseUp: PropTypes.func,
  }),
}
