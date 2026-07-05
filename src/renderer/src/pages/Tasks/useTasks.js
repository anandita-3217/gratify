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

import { useEffect, useState } from 'react'


export default function useTasks() {
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    window.api.tasks
      .getAll()
      .then(setTasks)
      .catch((err) => console.error('Failed to load tasks: ', err))
  }, [])
  async function addTask(task) {
    const newTask = await window.api.tasks.add({ ...task, id: Date.now(), completed: false })
    setTasks((prev) => [...prev, newTask])
  }
  async function deleteTask(id) {
    await window.api.tasks.remove(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }
  async function updateTask(id, updates) {
    const task = tasks.find((t) => t.id === id)
    const updated = await window.api.tasks.update({ ...task, ...updates })
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }
  async function toggleTask(id) {
    const task = tasks.find((t) => t.id === id)
    const updated = await window.api.tasks.update({ ...task, completed: !task.completed })
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }
  return { tasks, addTask, deleteTask, toggleTask, updateTask }
}
