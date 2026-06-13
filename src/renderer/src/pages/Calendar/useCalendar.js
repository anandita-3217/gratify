// useCalendar.js
// owns: events state in localStorage
// exposes: events, addEvent, editEvent, deleteEvent

/*
 * @typedef {Object} CalendarEvent
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} start        // ISO datetime
 * @property {string} end          // ISO datetime
 * @property {string} color        // mantine color string
 * @property {boolean} allDay
 * @property {boolean} recurring
 * @property {string | null} frequency   // 'daily' | 'weekly' | 'monthly' | null
 * @property {number | null} taskId
 * @property {string | null} labelId
 */

import { useLocalStorage } from '../../hooks/useLocalStorage'

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 3)

const DUMMY_EVENTS = [
  {
    id: 1,
    title: 'Team standup',
    description: 'Daily sync',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    color: 'blue',
    allDay: false,
    recurring: true,
    frequency: 'daily',
    taskId: null,
    labelId: null
  },
  {
    id: 2,
    title: 'Dentist appointment',
    description: '',
    start: tomorrow.toISOString(),
    end: new Date(tomorrow.getTime() + 3600000).toISOString(),
    color: 'red',
    allDay: false,
    recurring: false,
    frequency: null,
    taskId: null,
    labelId: null
  },
  {
    id: 3,
    title: 'Project deadline',
    description: 'Submit final report',
    start: nextWeek.toISOString(),
    end: new Date(nextWeek.getTime() + 3600000).toISOString(),
    color: 'orange',
    allDay: false,
    recurring: false,
    frequency: null,
    taskId: null,
    labelId: null
  }
]

export default function useCalendar() {
  const [events, setEvents] = useLocalStorage('calendarEvents', DUMMY_EVENTS)

  function addEvent(event) {
    // same pattern as addTask
    setEvents([...events, { ...event, id: Date.now() }])
  }

  function editEvent(id, updates) {
    // same pattern as editTask
    setEvents(events.map((event) => (event.id === id ? { ...event, ...updates } : event)))
  }

  function deleteEvent(id) {
    // same pattern as deleteTask
    setEvents(events.filter((event) => event.id !== id))
  }

  return { events, addEvent, editEvent, deleteEvent }
}
