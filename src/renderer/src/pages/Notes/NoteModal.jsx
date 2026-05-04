import { Box, Button, ColorSwatch, Group, Modal, Stack, Text, TextInput, Textarea, TagsInput,  } from '@mantine/core'
import { useState, useEffect } from 'react'
import NoteEditor from './NoteEditor'
export default function NoteModal({ opened, onClose, onSave, note }) {

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState([])
  const [color, setColor] = useState('pink')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')

  const noteColors = ['gray', 'red', 'pink', 'grape', 
      'violet', 'indigo', 'blue', 'cyan', 
      'teal', 'green', 'lime', 'yellow', 'orange']

  useEffect(() => {
    // if note exists → prefill title, body, tags
    if(note){
      setTitle(note.title)
      setBody(note.body)
      setTags(note.tags)
      setColor(note.color)
    }
    // else → reset to empty
    else{
      setTitle('')
      setBody('')
      setTags([])
      setColor('pink')
    }
  }, [note, opened])

  function handleSave() {
    // validate title is not empty
    if(!title.trim()){
      setTitleError('Title cannot be empty!')
      return
    }
    if (!body || body === '<p></p>') {
      setBodyError('Body cannot be empty!')
      return
    }
    setTitleError('')
    setBodyError('')
    // call onSave with { title, body, tags }
    onSave({ title, body, tags, color })
    // call onClose
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={note ? 'Edit Note' : 'New Note'}
      centered
      size="lg"
      styles={{                
              title: { color: '#c2255c', fontSize:'25px' ,fontWeight: 600, textAlign: 'center', width: '100%' },
              header: { justifyContent: 'center' },
              content: { border: '2px solid #c2255c',borderRadius: '15px'},
            }}
    >
      <Stack gap="md">
        {/* title input */}
        <TextInput withAsterisk label="Title"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          error={titleError}  />
        {/* body textarea */}
        {/* <Textarea withAsterisk autosize label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={bodyError}/> */}
         <Stack gap={4}>
  <Group gap={4}>
    <Text size="sm" fw={500}>Body</Text>
    <Text size="sm" c="red">*</Text>
  </Group>
  <Box
    style={{
      border: `1px solid ${bodyError ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-default-border)'}`,
      borderRadius: 8,
      padding: '8px',
      minHeight: 120
    }}
  >
    <NoteEditor
      content={body}
      onChange={(val) => { setBody(val); if (val && val !== '<p></p>') setBodyError('') }}
      editable={true}
    />
  </Box>
  {bodyError && (
    <Text size="xs" c="red">{bodyError}</Text>
  )}
</Stack>
        {/* tags input */}      
        <TagsInput  label="Tags" 
          placeholder='Press Enter to submit a tag'
          value={tags} 
          onChange={(val) => setTags(val)}/>
        {/* Color input */}
        <Text size="sm" fw={500}>Color</Text>
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
        {/* save + cancel buttons */}
        <Group justify='center'>
          <Button color='pink' onClick={handleSave} >{note ? 'Save' : 'Add'}</Button>
          <Button color='pink' onClick={onClose} >Cancel</Button>
        </Group>
      </Stack>
    </Modal>
  )
}