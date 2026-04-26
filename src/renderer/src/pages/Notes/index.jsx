
import { useState } from 'react'
import { Box, Button, Chip, Group, Stack, Text, TextInput, Title  } from '@mantine/core'
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
  // filter and sort
  const [filterColor, setFilterColor] = useState([])
  const [filterPinned, setFilterPinned] = useState(false)
  const [sort, setSort] = useState('createdAt-desc')
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
    if(!search && filterColor.length === 0  && !filterPinned) return true
    const s = search.toLowerCase()
    if(search && !note.title.toLowerCase().includes(s) && !note.body.toLowerCase(s)) return false
    if(filterColor.length > 0 && !filterColor.includes(note.color)) return false 
    if(filterPinned && !note.pinned) return false
    return true
  })

  // pinned notes always appear first
  const sortedNotes = [...filteredNotes].sort((a,b) => {
    switch(sort) {
      case 'createdAt-asc': return  a.createdAt - b.createdAt
      case 'createdAt-desc': return b.createdAt - a.createdAt
      case 'updatedAt-asc': return a.updatedAt - b.updatedAt
      case 'updatedAt-desc': return b.updatedAt - a.updatedAt
      case 'title-asc': return a.title.localeCompare(b.title)
      case 'title-desc': return b.title.localeCompare(a.title)
      default: return b.createdAt - a.createdAt
    }
  })

const noteColors = ['gray', 'red', 'pink', 'grape', 
      'violet', 'indigo', 'blue', 'cyan', 
      'teal', 'green', 'lime', 'yellow', 'orange']

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
      <Group align='center' gap="xs" mb='md'>
        <Text size='xs' c="dimmed">Color</Text>
        <Chip.Group value={filterColor} onChange={setFilterColor} multiple>
          <Group gap="xs">
            {noteColors.map(c => (
                        <ColorSwatch
                          key={c}
                          color={`var(--mantine-color-${c}-8)`}
                          size={24}
                          style={{ cursor: 'pointer', outline: color == c ? '2px solid white' : 'none' }}
                          onClick={() => setColor(c)}/>
                      ))}
          </Group>
        </Chip.Group>
      </Group> 
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