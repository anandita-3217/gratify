
import { useState } from 'react'
import { Box, Button, Group, Stack, Text, TextInput, Title  } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Plus, Search } from 'lucide-react'
import useNotes from './useNotes'
import NoteCard from './NoteCard'
import NoteModal from './NoteModal'


function getGreeting(){
    const hour = new Date().getHours()
    if (hour < 12) return ('Good Morning!')
    if (hour < 18) return ('Good Afternoon!')
    return 'Good Evening!'
}
// TODO: make markdown compatible and code recognizable and format it even if i need to use a packagae or a 3rd party app - later
export default function Notes() {
  const { notes, addNote, deleteNote, updateNote, pinNote } = useNotes()

  // search state
  const [search, setSearch] = useState('')

  // modal state — same pattern as Tasks
  const [opened, { open, close }] = useDisclosure(false)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [selectedNote, setSelectedNote] = useState(null)

  function handleEdit(note) {
    // set selectedNote and open modal
    setSelectedNote(note)
    openEdit()
  }

  function handleSave(noteData) {
    // if selectedNote exists → updateNote
    if(selectedNote){
      updateNote(selectedNote.id,noteData)
      closeEdit()
    }
    else{
      addNote(noteData)
      close()
    }
    setSelectedNote(null)
  
    // else → addNote
    // then close and clear selectedNote
    close()
    setSelectedNote(null)
  }

  // filter notes by search — check title and body
  const filteredNotes = notes.filter(note => {
    // return true if search is empty
    if(!search) return true
    const s = search.toLowerCase()
    // or if title includes search
    if(note.title.toLowerCase().includes(s)) return true
    // or if body includes search
    if(note.body.toLowerCase().includes(s)) return true 
    return false
  })

  // pinned notes always appear first
  const sortedNotes = [
    ...filteredNotes.filter(n => n.pinned),
    ...filteredNotes.filter(n => !n.pinned)
  ]


  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>

      {/* Header */}
      <Stack gap={4} mb="xl">
        <Title order={2} fw={600}>{getGreeting()}</Title>
        <Group gap={8}>
            <Text c="dimmed" size='sm'>
              { new Date().toLocaleDateString('en-us',{
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              }) }
            </Text>
        </Group>
        {/* search input + new note button */}
        <Stack mt={'xl'}>
          <Button onClick={open} color='pink' ><Plus size={16}/> New Note</Button>
          <TextInput value={search} onChange={(e) => setSearch(e.target.value)} leftSection={<Search size={16} />}/>
        </Stack>
      </Stack>
      {/* Empty state */}
      {sortedNotes.length === 0 && (
        // show a message when no notes or no search results 
        <Box p='xl' style={{ textAlign: 'center', border: '2px dashed var(--mantine-color-default-border)', borderRadius: '12px' }}>
          <Text c='dimmed' size='sm'>
            {notes.length === 0 ? "No notes - add some!" : "No notes matching these filters"}
          </Text>
        </Box>
      )} 
      
      {/* Notes grid */}
      <Stack gap="md">
        {sortedNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => handleEdit(note)}
            onDelete={() => deleteNote(note.id)}
            onPin={() => pinNote(note.id)}
          />
        ))}
      </Stack>

      {/* Modal — same pattern as Tasks, one modal for both create and edit */}
      <NoteModal
        opened={opened}
        onClose={() => { close(); setSelectedNote(null) }}
        onSave={handleSave}
        note={selectedNote}
      />
      <NoteModal
        opened={editOpened}
        onClose={() => { closeEdit(); setSelectedNote(null) }}
        onSave={handleSave}
        note={selectedNote}
      />

    </Box>
  )
}