/*
 * @typedef {Object} Note
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {boolean} pinned
 * @property {number} createdAt
 * @property {number} updatedAt
 */

import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function useNotes(){
    const [notes, setNotes] = useLocalStorage('notes', [
        {
          id: 1,
          title: 'Shopping List',
          body: 'Milk, eggs, bread, butter, coffee, bananas, chicken, pasta',
          tags: ['personal', 'errands'],
          pinned: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 2,
          title: 'Project Ideas',
          body: 'Build a habit tracker, create a recipe app, learn Three.js, experiment with WebGL animations',
          tags: ['work', 'ideas'],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 3,
          title: 'Meeting Notes',
          body: 'Discussed Q2 roadmap, assigned tasks to team members, next meeting Friday at 10am',
          tags: ['work', 'meetings'],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 4,
          title: 'Book Recommendations',
          body: 'Atomic Habits, Deep Work, The Pragmatic Programmer, Clean Code, Thinking Fast and Slow',
          tags: ['reading', 'personal'],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
    ])

    function addNote(){
        setNotes([...notes,{...note,id: Date.now(), pinned: false, createdAt: Date.now(), updatedAt: Date.now()}])
    }
    function deleteNote(id){
        setNotes(notes.filter(note => note.id !== id))
    }
    function updateNote(id, updates){
        setNotes(notes.map(note => 
            note.id === id ? {...note, ...updates, updatedAt: Date.now()} : note
        ))
    }
    function pinNote(id) {
        // map over notes, flip pinned on the matching one
        // same pattern as toggleTask
        setNotes(notes.map(note =>
            note.id === id ? {...note, pinned : !note.pinned} : note
        ))
    }

    return { notes, addNote, deleteNote, updateNote, pinNote }
}