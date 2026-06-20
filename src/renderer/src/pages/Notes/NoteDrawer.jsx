import {
  Box,
  Drawer,
  Stack,
  Text,
  Badge,
  Group,
  ActionIcon,
  TextInput,
  Button
} from '@mantine/core'
import { Pin, PinOff, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import NoteEditor from './NoteEditor'
import PropTypes from 'prop-types'

export default function NoteDrawer({ note, opened, onClose, onEdit, onPin, onTagDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note?.title ?? '')
  const [editingTitle, setEditingTitle] = useState(false)
  const [editBody, setEditBody] = useState(note?.body ?? '')
  const [editingBody, setEditingBody] = useState(false)
  const [editTags, setEditTags] = useState(note?.tags ?? [])

  useEffect(() => {
    if (note) {
      setEditingTitle(false)
      setEditingBody(false)
    }
  }, [note])
  // if no note is selected return null — nothing to show
  if (!note) return null

  function handleSave() {
    onEdit({ title: editTitle, body: editBody, tags: editTags })
    setEditingTitle(false)
    setEditingBody(false)
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
        <Box
          style={{
            borderTop: `4px solid var(--mantine-color-${note.color}-6)`,
            background: `var(--mantine-color-${note.color}-light)`,
            padding: '20px 24px 16px'
          }}
        >
          <Group justify="space-between" align="flex-start">
            {/* TITLE*/}
            {editingTitle ? (
              <TextInput
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => {
                  setEditingTitle(false)
                  onEdit({ title: editTitle, body: editBody, tags: editTags })
                }}
              />
            ) : (
              <div
                onClick={() => setEditingTitle(true)}
                className="cursor-text rounded-lg p-2 hover:outline hover:outline-1 hover:outline-gray-500 transition-all"
              >
                <Text fw={700} size="xl">
                  {note.title}
                </Text>
              </div>
            )}
            <Group gap="xs">
              <ActionIcon variant="subtle" size="xs" color="pink" onClick={onPin}>
                {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
              </ActionIcon>
            </Group>
          </Group>
          <Group size="md" mt="xs">
            <Text c="dimmed" size="xs">
              Created At: {new Date(note.createdAt).toLocaleString()}{' '}
            </Text>
            <Text c="dimmed" size="xs">
              Updated At: {new Date(note.updatedAt).toLocaleString()}{' '}
            </Text>
          </Group>
        </Box>
        {/* full note body */}

        <Box
          style={{
            flex: 1,
            padding: '24px',
            background: `var(--mantine-color-${note.color}-light-hover)`,
            overflowY: 'auto',
            cursor: editingBody ? 'text' : 'pointer'
          }}
          onClick={() => !isEditing && setEditingBody(true)}
        >
          <NoteEditor
            content={editingBody ? editBody : note.body}
            onChange={setEditBody}
            editable={editingBody}
          />
        </Box>

        {/* tags */}
        {note.tags.length > 0 && (
          <Box
            style={{
              padding: '16px 24px',
              borderTop: `1px solid var(--mantine-color-${note.color}-3)`,
              background: `var(--mantine-color-${note.color}-light)`
            }}
          >
            <Group gap="xs">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="light"
                  color={note.color}
                  size="sm"
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      color={note.color}
                      onClick={() => onTagDelete(tag)}
                    >
                      <X size={10} />
                    </ActionIcon>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Group>
            {(editingTitle || editingBody) && (
              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setEditingTitle(false)
                    setEditingBody(false)
                  }}
                  color="gray"
                >
                  Cancel
                </Button>
                <Button variant="subtle" size="sm" onClick={handleSave} color={note.color}>
                  Save
                </Button>
              </Group>
            )}
          </Box>
        )}
      </Stack>
    </Drawer>
  )
}
NoteDrawer.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string,
    pinned: PropTypes.bool,
    createdAt: PropTypes.number,
    updatedAt: PropTypes.number
  }),
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  onPin: PropTypes.func,
  onTagDelete: PropTypes.func
}
