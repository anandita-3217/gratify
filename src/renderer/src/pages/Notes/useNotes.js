/*
 * @typedef {Object} Note
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {string} color
 * @property {boolean} pinned
 * @property {number} createdAt
 * @property {number} updatedAt
 */

import { useEffect, useState } from 'react'

// import { useLocalStorage } from '../../hooks/useLocalStorage'

// const DUMMY_NOTES = [
//   {
//     id: 1,
//     title: 'Meeting notes',
//     body: '<p>Discussed Q3 roadmap and deadlines</p>',
//     tags: ['work', 'meetings'],
//     color: 'blue',
//     pinned: true,
//     createdAt: Date.now(),
//     updatedAt: Date.now()
//   },
//   {
//     id: 2,
//     title: 'Book recommendations',
//     body: '<p>Atomic Habits, Deep Work, The Pragmatic Programmer</p>',
//     tags: ['reading'],
//     color: 'teal',
//     pinned: false,
//     createdAt: Date.now(),
//     updatedAt: Date.now()
//   },
//   {
//     id: 3,
//     title: 'Grocery list',
//     body: '<p>Milk, eggs, bread, coffee</p>',
//     tags: ['personal'],
//     color: 'yellow',
//     pinned: false,
//     createdAt: Date.now(),
//     updatedAt: Date.now()
//   },
//   {
//     id: 4,
//     title: 'App ideas',
//     body: '<p>Habit tracker, budget planner, recipe manager</p>',
//     tags: ['ideas', 'dev'],
//     color: 'pink',
//     pinned: true,
//     createdAt: Date.now(),
//     updatedAt: Date.now()
//   }
// ]

export default function useNotes() {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    window.api.notes
      .getAll()
      .then(setNotes)
      .catch((err) => console.error('Failed to load notes: ', err))
  }, [])
  async function addNote(note) {
    const now = Date.now()
    const newNote = await window.api.notes.add({ ...note, id: now, createdAt: now, updatedAt: now })
    setNotes((prev) => [...prev, newNote])
  }
  async function deleteNote(id) {
    await window.api.notes.remove(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }
  async function updateNote(id, updates) {
    const note = notes.find((n) => n.id === id)
    const updated = await window.api.notes.update({ ...note, ...updates, updatedAt: Date.now() })
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }
  async function pinNote(id) {
    const note = notes.find((n) => n.id === id)
    const updated = await window.api.notes.update({ ...note, pinned: !note.pinned })
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }

  return { notes, addNote, deleteNote, updateNote, pinNote }
}
