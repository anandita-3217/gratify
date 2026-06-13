/*
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {string | null} deadline
 * @property {boolean} completed
 * @property {boolean} recurring
 * @propporty {string} reminder
 * @property {'daily'|'weekly'|'monthly'|'custom' | null} frequency
 */

import { useLocalStorage } from '../../hooks/useLocalStorage'

const DUMMY_TASKS = [
  {
    id: 1,
    text: 'Review project proposal',
    priority: 'high',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    recurring: false,
    frequency: null,
    reminder: '60'
  },
  {
    id: 2,
    text: 'Buy groceries',
    priority: 'low',
    deadline: null,
    completed: false,
    recurring: false,
    frequency: null,
    reminder: null
  },
  {
    id: 3,
    text: 'Morning workout',
    priority: 'medium',
    deadline: null,
    completed: true,
    recurring: true,
    frequency: 'daily',
    reminder: null
  },
  {
    id: 4,
    text: 'Call dentist',
    priority: 'urgent',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    completed: false,
    recurring: false,
    frequency: null,
    reminder: null
  },
  {
    id: 5,
    text: 'Read 30 pages',
    priority: 'low',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    completed: false,
    recurring: true,
    frequency: 'daily',
    reminder: null
  }
]

export default function useTasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', DUMMY_TASKS)
  function addTask(task) {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }])
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function toggleTask(id) {
    // hint: map over tasks, flip completed on the matching one
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  function updateTask(id, updates) {
    // hint: map over tasks, spread updates onto the matching one
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  return { tasks, addTask, deleteTask, toggleTask, updateTask }
}
