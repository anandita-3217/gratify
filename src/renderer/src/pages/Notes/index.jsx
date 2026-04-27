
import { useState } from 'react'
import { ActionIcon, Box, Button, Chip, ColorSwatch,  Group, Select, Stack, Text, TextInput, Title  } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Plus, Search, X } from 'lucide-react'
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
  const [filterColors, setFilterColors] = useState([])
  const [filterTags, setFilterTags] = useState([])
  const [showAllTags, setShowAllTags] = useState(false)
  const [sort, setSort] = useState('createdAt-desc')

  const allTags = [...new Set(notes.flatMap(n => n.tags))]
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 5)
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
      // else → addNote
      // then close and clear selectedNote
      addNote(noteData)
      close()
    }
    setSelectedNote(null)
  
  }

  // filter notes by search — check title and body
  const filteredNotes = notes.filter(note => {
    if (search){
      const s = search.toLowerCase()
      if (!note.title.toLowerCase().includes(s) && !note.body.toLowerCase().includes(s)) return false
    }
    if(filterColors.length > 0 && !filterColors.includes(note.color)) return false 
    if(filterTags.length > 0 && !filterTags.some(t => note.tags.includes(t))) return false
    return true
  })

  // pinned notes always appear first
  const sortedNotes = [
    ...filteredNotes.filter(n => n.pinned),
    ...filteredNotes.filter(n => !n.pinned),
  ].sort((a,b) => {
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
          <Group gap="xs">
              {noteColors.map(c => (
                <ColorSwatch
                  key={c}
                  color={`var(--mantine-color-${c}-8)`}
                  size={20}
                  style={{ cursor: 'pointer', outline: filterColors.includes(c) ? '2px solid white' : 'none', outlineOffset: '2px' }}
                  onClick={() => setFilterColors(prev => prev.includes(c) ? prev.filter(x => x != c) : [...prev, c])}/>
              ))}
              {filterColors.length > 0 && (
                <ActionIcon variant='subtle' color='gray' size='xs' onClick={() => setFilterColors([])} >
                  <X size={12}/>
                </ActionIcon>
              )}
          </Group>
      </Group> 
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <Group gap='xs' align='center' mb="md">
          <Text size='xs' c="dimmed" w={40}>Tags</Text>
          <Chip.Group multiple value={filterTags} onChange={setFilterTags}>
            <Group gap="xs">
              {visibleTags.map(tag => (
                <Chip key={tag} value={tag} size='xs' color='pink'>{tag}</Chip>
              ))}
            </Group>
          </Chip.Group>
          {allTags.length > 5 && (
            <Button color='gray' variant='subtle' size='xs' onClick={() => setShowAllTags(s => !s)}>{showAllTags ? 'Show less' : `+${allTags.length - 5} more`}</Button>
          )}
        </Group>
      )}
      {/* Sort */}
      <Group gap='xs' align='center' mb="md">
        <Text size='xs' c="dimmed" w={40}>Sort</Text>
        <Select size='xs' value={sort} onChange={setSort} style={{ width: 180 }}
          data={[
            { value: 'createdAt-desc', label: '↓ Newest first' },
            { value: 'createdAt-asc', label: '↑ Oldest first' },
            { value: 'updatedAt-desc', label: '↓ Recently edited' },
            { value: 'updatedAt-asc', label: '↑ Least recently edited' },
            { value: 'title-asc', label: '↑ Title A→Z' },
            { value: 'title-desc', label: '↓ Title Z→A' },
          ]}/>
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
            onTagDelete={(tag) => updateNote(note.id,{ tags: note.tags.filter(t => t !=tag) })}
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