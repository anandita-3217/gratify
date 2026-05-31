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

export default function useCalendar() {
  const [events, setEvents] = useLocalStorage('calendarEvents', [])

  function addEvent(event) {
    // same pattern as addTask
    setEvents([...events, {...event,id: Date.now()}])
  }

  function editEvent(id, updates) {
    // same pattern as editTask
    setEvents(events.map(event => event.id === id ? {...event, ...updates} : event))
  }

  function deleteEvent(id) {
    // same pattern as deleteTask
    setEvents(events.filter( event => event.id !== id ))
  }

  return { events, addEvent, editEvent, deleteEvent }
}