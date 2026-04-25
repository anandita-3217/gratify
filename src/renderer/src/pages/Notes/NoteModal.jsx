// useNotes.js       ← CRUD logic
//     ↓
// NoteCard.jsx      ← single note card
//     ↓
// NoteModal.jsx     ← create/edit modal
//     ↓
// Notes/index.jsx   ← puts it all together
import { Modal, Stack, TextInput, Textarea, TagsInput, Button, Group } from '@mantine/core'
import { useState, useEffect } from 'react'

export default function NoteModal({ opened, onClose, onSave, note }) {

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState([])
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    // if note exists → prefill title, body, tags
    // else → reset to empty
  }, [note, opened])

  function handleSave() {
    // validate title is not empty
    // call onSave with { title, body, tags }
    // call onClose
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={note ? 'Edit Note' : 'New Note'}
      centered
      size="lg"
    >
      <Stack gap="md">
        {/* title input */}
        {/* body textarea */}
        {/* tags input */}
        {/* save + cancel buttons */}
      </Stack>
    </Modal>
  )
}