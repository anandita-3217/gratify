// useNotes.js       ← CRUD logic
//     ↓
// NoteCard.jsx      ← single note card
//     ↓
// NoteModal.jsx     ← create/edit modal
//     ↓
// Notes/index.jsx   ← puts it all together

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
    const [notes, setNotes] = useLocalStorage('notes', [])

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