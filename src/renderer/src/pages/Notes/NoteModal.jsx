/* eslint-disable prettier/prettier */
import {
  Box,
  Button,
  ColorSwatch,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  TagsInput,
  useMantineTheme
} from '@mantine/core'
import { useState } from 'react'
import NoteEditor from './NoteEditor'
import PropTypes from 'prop-types'

const noteColors = [
  'orange',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow'
]

export default function NoteModal({ opened, onClose, onSave, note }) {
  const [title, setTitle] = useState(note?. title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [tags, setTags] = useState(note?.tags ?? [])
  const [color, setColor] = useState(note?.color ?? 'pink')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')

  const theme = useMantineTheme()


  function handleSave() {
    // validate title is not empty
    if (!title.trim()) {
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
        title: {
          color: `var(--mantine-color-${theme.primaryColor}-5)`,
          fontSize: '25px',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%'
        },
        header: { justifyContent: 'center' },
        content: {
          border: `2px solid var(--mantine-color-${theme.primaryColor}-5)`,
          borderRadius: '15px'
        }
      }}
    >
      <Stack gap="md">
        {/* title input */}
        <TextInput
          withAsterisk
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
        />
        {/* body textarea */}
        {/* <Textarea withAsterisk autosize label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={bodyError}/> */}
        <Stack gap={4}>
          <Group gap={4}>
            <Text size="sm" fw={500}>
              Body
            </Text>
            <Text size="sm" c="red">
              *
            </Text>
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
              onChange={(val) => {
                setBody(val)
                if (val && val !== '<p></p>') setBodyError('')
              }}
              editable={true}
            />
          </Box>
          {bodyError && (
            <Text size="xs" c="red">
              {bodyError}
            </Text>
          )}
        </Stack>
        {/* tags input */}
        <TagsInput
          label="Tags"
          placeholder="Press Enter to submit a tag"
          value={tags}
          onChange={(val) => setTags(val)}
        />
        {/* Color input */}
        <Text size="sm" fw={500}>
          Color
        </Text>
        <Group gap="xs">
          {noteColors.map((c) => (
            <ColorSwatch
              key={c}
              color={`var(--mantine-color-${c}-5)`}
              size={24}
              style={{ cursor: 'pointer', outline: color == c ? '2px solid white' : 'none' }}
              onClick={() => setColor(c)}
            />
          ))}
        </Group>
        {/* save + cancel buttons */}
        <Group justify="center">
          <Button onClick={handleSave}>
            {note ? 'Save' : 'Add'}
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
NoteModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  note: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string
  })
}