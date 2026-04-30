import { Box, Drawer, Stack, Text, Title, Badge, Group, ActionIcon, TextInput, Button, Textarea } from '@mantine/core'
import { Pencil, Pin, PinOff,X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NoteDrawer({ note, opened, onClose, onEdit, onPin, onTagDelete }) {

  const [isEditing,setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editTags, setEditTags] = useState([])




  useEffect(() => {
    if(note){
      setEditTitle(note.title)
      setEditBody(note.body)
      setEditTags(note.tags)
      setIsEditing(false)
    }
  },[note])
  // if no note is selected return null — nothing to show
  if (!note) return null
  function handleSave(){
    onEdit({ title: editTitle, body: editBody, tags: editTags })
    setIsEditing(false)
  }
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={note.title}

      styles={{
        title: { display: 'none' },
        body: { padding: 0, height: '100%' }
      }}
    >
      <Stack gap="md">
        <Box style={{
          borderTop: `4px solid var(--mantine-color-${note.color}-6)`,
          background: `var(--mantine-color-${note.color}-light)`,
          padding: '20px 24px 16px'
        }}>
          <Group justify='space-between' align='flex-start'>
          {/* TITLE*/}
            {isEditing ? (
                <TextInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            ) : (
              <div onClick={() => setIsEditing(true)} className='cursor-text rounded-lg p-2 hover:outline hover:outline-1 hover:outline-gray-500 transition-all' >
                <Text fw={700} size='xl'>{note.title}</Text>
                
              </div>  
            )}
            <Group gap="xs">
              <ActionIcon variant='subtle' size='xs' color='pink' onClick={onPin}>
                {note.pinned ?<PinOff size={16}/> : <Pin size={16} />}
                </ActionIcon>
            </Group>
          </Group> 
          <Group size='md' mt='xs'>
            <Text c="dimmed" size='xs'>Created At: { new Date(note.createdAt).toLocaleString()} </Text>
            <Text c="dimmed" size='xs'>Updated At: { new Date(note.updatedAt).toLocaleString()} </Text>
          </Group>
        </Box>
        {/* full note body */}
        <Box style={{
          flex: 1,
          padding: '24px',
          background: `var(--mantine-color-${note.color}-light-hover)`,
          overflowY: 'auto' 
        }} >
          {/* BODY */}
          {isEditing ? (
            <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} autosize minRows={6} />
          ) : (
            <div onClick={() => setIsEditing(true)} className='cursor-text rounded-lg p-2 hover:outline hover:outline-1 hover:outline-gray-500 transition-all' >
              <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} >{note.body}</Text>

            </div>
          )}
        </Box>
        {/* tags */}
        {note.tags.length > 0 && (
          <Box
            style={{
              padding: '16px 24px',
              borderTop: `1px solid var(--mantine-color-${note.color}-3)`,
              background: `var(--mantine-color-${note.color}-light)`
            }}>
            <Group gap='xs'>
              {note.tags.map(tag =>(
                <Badge
                 key={tag} variant='light' color={note.color}
                 size='sm' rightSection={
                  <ActionIcon size='xs' variant='transparent' color={note.color} onClick={() => onTagDelete(tag)}>
                    <X size={10} />
                  </ActionIcon>
                 }
                 >{tag}</Badge>
              ))}
            </Group>
            {isEditing && (
              <Group justify='flex-end' >
                <Button variant='subtle' size='sm' onClick={() => setIsEditing(false)} color='gray'>Cancel</Button>
                <Button variant='subtle' size='sm' onClick={handleSave} color={note.color} >Save</Button>
              </Group>
            )}
          </Box>
        )}
        
      </Stack>
    </Drawer>
  )
}