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

import { useEffect, useState } from 'react'

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 3)

// const DUMMY_EVENTS = [
//   {
//     id: 1,
//     title: 'Team standup',
//     description: 'Daily sync',
//     start: new Date().toISOString(),
//     end: new Date(Date.now() + 3600000).toISOString(),
//     color: 'blue',
//     allDay: false,
//     recurring: true,
//     frequency: 'daily',
//     taskId: null,
//     labelId: null
//   },
//   {
//     id: 2,
//     title: 'Dentist appointment',
//     description: '',
//     start: tomorrow.toISOString(),
//     end: new Date(tomorrow.getTime() + 3600000).toISOString(),
//     color: 'red',
//     allDay: false,
//     recurring: false,
//     frequency: null,
//     taskId: null,
//     labelId: null
//   },
//   {
//     id: 3,
//     title: 'Project deadline',
//     description: 'Submit final report',
//     start: nextWeek.toISOString(),
//     end: new Date(nextWeek.getTime() + 3600000).toISOString(),
//     color: 'orange',
//     allDay: false,
//     recurring: false,
//     frequency: null,
//     taskId: null,
//     labelId: null
//   }
// ]

export default function useCalendar() {
  const [events, setEvents] = useState([])
  useEffect(() => {
    window.api.calendarEvents
      .getAll()
      .then(setEvents)
      .catch((err) => console.error('Failed to load Events: ', err))
  }, [])
  async function addEvent(event) {
    const newEvent = await window.api.calendarEvents.add({ ...event, id: Date.now() })
    setEvents((prev) => [...prev, newEvent])
  }
  async function editEvent(id, updates) {
    const event = events.find((e) => e.id === id)
    const updated = await window.api.calendarEvents.update({ ...event, ...updates })
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  async function deleteEvent(id) {
    await window.api.calendarEvents.remove(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return { events, addEvent, editEvent, deleteEvent }
}
