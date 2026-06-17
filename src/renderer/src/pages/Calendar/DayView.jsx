import { ActionIcon, Box, Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { getHourSlots, getEventsForDay, getEventPosition, isToday } from './useCalendarGrid'
import { Plus } from 'lucide-react'
import PropTypes from 'prop-types'
import EventCard from './EventCard'
export default function DayView({
  events = [],
  selectedDate = new Date(),
  onEventClick,
  onSlotClick,
  dragHandlers
}) {
  const hourSlots = getHourSlots()
  const dayEvents = getEventsForDay(events, selectedDate)

  const [now, setNow] = useState(new Date())

  const currentHourRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const nowPosition = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100 //24*60 = 1440

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentHourRef.current) {
        currentHourRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box style={{ overflowY: 'auto', flex: 1, height: '600px' }}>
        <Box style={{ display: 'grid', gridTemplateColumns: '60px 1fr', position: 'relative' }}>
          <Box>
            {hourSlots.map((slot) => (
              <Box key={slot.hour} style={{ height: 60, paddingRight: 8 }}>
                <Text
                  size="xs"
                  c={slot.hour === now.getHours() ? 'pink' : 'dimmed'} //// TODO: change this to be governed by the accent color in settings
                  fw={slot.hour === now.getHours() ? 700 : 400}
                  ta="right"
                >
                  {slot.label}
                </Text>
              </Box>
            ))}
          </Box>
          <Box
            style={{
              position: 'relative',
              borderLeft: '1px solid var(--mantine-color-default-border)'
            }}
          >
            {hourSlots.map((slot) => (
              <Box
                key={slot.hour}
                ref={slot.hour === now.getHours() ? currentHourRef : null}
                className="group"
                style={{
                  height: 60,
                  borderBottom: '1px solid var(--mantine-color-default-border)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => onSlotClick(selectedDate, slot.hour)}
                onMouseDown={(e) => dragHandlers?.onMouseDown?.(e, selectedDate, slot.hour)}
                onMouseMove={(e) => dragHandlers?.onMouseMove?.(e, selectedDate, slot.hour)}
                onMouseUp={(e) => dragHandlers?.onMouseUp?.(e)}
              >
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  className="opacity-0 group-hover:opacity-100"
                  style={{ position: 'absolute', top: 4, right: 4 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlotClick(selectedDate, slot.hour)
                  }}
                >
                  <Plus size={12} />
                </ActionIcon>
              </Box>
            ))}
            {isToday(selectedDate) && (
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
              const { top, height } = getEventPosition(event, selectedDate)
              return (
                <Box
                  key={event.id}
                  style={{
                    position: 'absolute',
                    top: `${top}%`,
                    height: `${Math.max(height, 2)}%`,
                    width: '90%',
                    left: '5%',
                    zIndex: 1
                    // backgroundColor: `var(--mantine-color-${event.color}-5)`,
                    // borderRadius: 4,
                    // cursor: 'pointer',
                    // padding: '2px 4px',
                    // overflow: 'hidden',
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <EventCard event={event} onClick={onEventClick} />
                  {/* <Text size="xs" fw={600} c="white">
                    {event.title}
                  </Text> */}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
DayView.propTypes = {
  events: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
  onEventClick: PropTypes.func,
  onSlotClick: PropTypes.func,
  dragHandlers: PropTypes.shape({
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseUp: PropTypes.func
  })
}
