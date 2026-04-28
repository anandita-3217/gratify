import { Drawer, Stack, Text, Title, Badge, Group, ActionIcon } from '@mantine/core'
import { Pencil, Pin, PinOff,X } from 'lucide-react'

export default function NoteDrawer({ note, opened, onClose, onEdit, onPin, onTagDelete }) {

  // if no note is selected return null — nothing to show
  if (!note) return null

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="lg"
      title={note.title}
      styles={{
        title: { fontWeight: 600, fontSize: 20 }
      }}
    >
      <Stack gap="md" bg={'red'}>
        {/* pin button + edit button at the top */}
        <Group gap="xs">
          <ActionIcon variant='subtle' size='xs' color='pink' onClick={onPin}>
            {note.pinned ?<PinOff size={16}/> : <Pin size={16} />}
            </ActionIcon>
          <ActionIcon variant='subtle' size='xs' color='green' onClick={onEdit}>
            <Pencil size={16} />
            </ActionIcon>
        </Group>
        {/* full note body */}
        <Group gap='xs'>
          <Text>{note.title}</Text>
          <Text size='xs' c="dimmed" >{note.body}</Text>
        </Group>
        {/* tags */}
        <Group gap='xs'>
          {note.tags.map(tag => (
            <Badge key={tag} variant='light' color={`var(--mantine-color-${note.color}-6)`} size='sm'
            rightSection={
              <ActionIcon size='xs' variant='transparent' color={`var(--mantine-color-${note.color}-6)`} onClick={() => onTagDelete(tag)} ><X size={10}/></ActionIcon>
            }>
              {tag}
            </Badge>

          ))}
        </Group>
        {/* created at + updated at */}
        <Group size='xs'>
          <Text size='xs'>Created At: { new Date(note.createdAt).toLocaleString()} </Text>
          <Text size='xs'>Updated At: { new Date(note.updatedAt).toLocaleString()} </Text>
        </Group>
      </Stack>
    </Drawer>
  )
}