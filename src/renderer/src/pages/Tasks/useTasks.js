/*
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {string | null} deadline
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {boolean} completed 
 * @property {boolean} recurring 
 * @property {'daily'|'weekly'|'monthly'|'custom' | null} frequency
 */ 


import { useLocalStorage } from '../../hooks/useLocalStorage'

export function useTasks() {
  // const [tasks, setTasks] = useLocalStorage('tasks', [])
const [tasks, setTasks] = useLocalStorage('tasks', [])
  function addTask(task) {
    setTasks([...tasks, {...task,id: Date.now(), completed: false}])

    // hint: spread existing tasks, add new one with a unique id
    // Date.now() is a simple way to generate a unique id
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  function toggleTask(id) {
    // hint: map over tasks, flip completed on the matching one
    setTasks(tasks.map(task =>
        task.id === id ? {...task,completed: !task.completed} : task
    ))
  }

  function updateTask(id, updates) {
    // hint: map over tasks, spread updates onto the matching one
    setTasks(tasks.map(task =>
        task.id === id ? {...task, ...updates} : task
    ))
  }

  return { tasks, addTask, deleteTask, toggleTask, updateTask }
}