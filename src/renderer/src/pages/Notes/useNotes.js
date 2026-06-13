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

import { useLocalStorage } from '../../hooks/useLocalStorage'

const DUMMY_NOTES = [
  {
    id: 1,
    title: 'Meeting notes',
    body: '<p>Discussed Q3 roadmap and deadlines</p>',
    tags: ['work', 'meetings'],
    color: 'blue',
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 2,
    title: 'Book recommendations',
    body: '<p>Atomic Habits, Deep Work, The Pragmatic Programmer</p>',
    tags: ['reading'],
    color: 'teal',
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 3,
    title: 'Grocery list',
    body: '<p>Milk, eggs, bread, coffee</p>',
    tags: ['personal'],
    color: 'yellow',
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 4,
    title: 'App ideas',
    body: '<p>Habit tracker, budget planner, recipe manager</p>',
    tags: ['ideas', 'dev'],
    color: 'pink',
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

export default function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes', DUMMY_NOTES)

  function addNote(note) {
    setNotes([
      ...notes,
      {
        ...note,
        id: Date.now(),
        pinned: false,
        color: note.color ?? 'pink',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ])
  }
  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id))
  }
  function updateNote(id, updates) {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note))
    )
  }
  function pinNote(id) {
    // map over notes, flip pinned on the matching one
    // same pattern as toggleTask
    setNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)))
  }

  return { notes, addNote, deleteNote, updateNote, pinNote }
}
