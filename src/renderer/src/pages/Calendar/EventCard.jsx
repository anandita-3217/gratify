/* eslint-disable prettier/prettier */
import { Box, Text } from '@mantine/core'
import PropTypes from 'prop-types'

export default function EventCard({ event, onClick, compact = false }) {
  const bg = `var(--mantine-color-${event.color}-6)`
  if (compact) {
    return (
      <Box
        onClick={(e) => {
          e.stopPropagation()
          onClick(event)
        }}
        style={{
          backgroundColor: bg,
          borderRadius: 4,
          cursor: 'pointer',
          padding: '2px 6px',
          overflow: 'hidden',
        }}
      >
        <Text size="xs" c="white" truncate fw={500}>
          {event.title}
        </Text>
      </Box>
    )
  }
  return (
    <Box
      onClick={() => onClick(event)}
      style={{
        backgroundColor: bg,
        borderRadius: 4,
        cursor: 'pointer',
        padding: '2px 6px',
        overflow: 'hidden',
        height: '100%',
        // borderLeft: `3px solid color-mix(in srgb, ${bg} 70%, black)`
      }}
    >
      <Text size="xs" c="white" fw={600} truncate>
        {event.title}
      </Text>
      <Text size="xs" c="white" opacity={0.8}>
        {new Date(event.start).toLocaleTimeString('default', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </Box>
  )
}
EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    color: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    isTaskEvent: PropTypes.bool
  }),
  onClick: PropTypes.func,
  compact: PropTypes.bool
}

