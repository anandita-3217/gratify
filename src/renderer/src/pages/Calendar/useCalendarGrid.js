export function getMonthGrid(year, month, weekStartsOn = 'sunday') {
  // → array of 40 Date objects (5 weeks) for the month grid
  const firstDay = new Date(year, month, 1)
  const startOffset = weekStartsOn === 'monday' ? 1 : 0
  const diff = (firstDay.getDay() - startOffset + 7) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = diff + daysInMonth > 35 ? 42 : 35
  const grid = []
  for (let i = 0; i < totalCells; i++) {
    grid.push(new Date(year, month, 1 - startOffset + i))
  }
  return grid
}

export function getWeekDays(date, weekStartsOn = 'sunday') {
  // → array of 7 Date objects for the week containing date

  const startOffset = weekStartsOn === 'monday' ? 1 : 0
  const day = date.getDay()
  const diff = (day - startOffset + 7) % 7
  const week = []
  for (let i = 0; i < 7; i++) {
    week.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff + i))
  }
  return week
}

export function getHourSlots(timeFormat = '12h') {
  // → array of 24 { hour, label } objects for the time grid
  const slots = []
  for (let i = 0; i < 24; i++) {
    const label =
      timeFormat === '24h'
        ? `${String(i).padStart(2, '0')}:00`
        : i === 0
          ? '12 AM'
          : i < 12
            ? `${i} AM`
            : i === 12
              ? '12 PM'
              : `${i - 12} PM`
    slots.push({ hour: i, label })
  }

  return slots
}

export function isSameDay(a, b) {
  // → boolean
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isToday(date) {
  // → boolean
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function getEventsForDay(events, date) {
  // → filtered array of events that fall on that day
  return events.filter((event) => isSameDay(new Date(event.start), date))
}

// eslint-disable-next-line no-unused-vars
export function getEventPosition(event, dayStart) {
  // → { top, height } percentages for positioning in time grid
  const start = new Date(event.start)
  const end = new Date(event.end)
  const totalMinutes = 24 * 60
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const duration = (end - start) / 60000
  return {
    top: (startMinutes / totalMinutes) * 100,
    height: (duration / totalMinutes) * 100
  }
}
