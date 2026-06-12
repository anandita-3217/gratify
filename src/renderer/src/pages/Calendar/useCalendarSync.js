// useCalendarSync.js
// reads tasks from localStorage
// converts tasks with deadlines to synthetic calendar events
// merges them with real calendar events
// to disable: remove import from index.jsx and remove syncedEvents from view props

// import { Title } from '@mantine/core'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function useCalendarSync(events) {
  const [tasks] = useLocalStorage('tasks', [])
  // convert tasks with deadlines to calendar events
  const taskEvents = tasks
    .filter((task) => task.deadline && !task.completed)
    .map((task) => {
      const end = new Date(task.deadline)
      end.setHours(end.getHours() + 1)
      return {
        id: `task-${task.id}`,
        title: task.text,
        start: task.deadline,
        end: end.toISOString(),
        color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'blue',
        allDay: false,
        taskId: task.id,
        isTaskEvent: true
      }
      // fill in the event shape here
      // id should be unique — prefix with 'task-' to avoid conflicts with real events
      // start and end should be the deadline

      // color should be based on priority — same colors as TaskItem
      // allDay: false
      // taskId: task.id  ← links back to the task
      // title: task.text
    })

  // merge real events with task events
  const syncedEvents = [...(events ?? []), ...taskEvents]

  return { syncedEvents, taskEvents }
}
