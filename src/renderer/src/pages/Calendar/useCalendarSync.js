// useCalendarSync.js
// reads tasks from localStorage
// converts tasks with deadlines to synthetic calendar events
// merges them with real calendar events
// to disable: remove import from index.jsx and remove syncedEvents from view props

import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function useCalendarSync(events) {
  const [tasks] = useLocalStorage('tasks', [])

  // convert tasks with deadlines to calendar events
  const taskEvents = tasks
    .filter(task => task.deadline && !task.completed)
    .map(task => ({
      // fill in the event shape here
      // id should be unique — prefix with 'task-' to avoid conflicts with real events
      // start and end should be the deadline
      // color should be based on priority — same colors as TaskItem
      // allDay: false
      // taskId: task.id  ← links back to the task
      // title: task.text
    }))

  // merge real events with task events
  const syncedEvents = [...events, ...taskEvents]

  return { syncedEvents, taskEvents }
}