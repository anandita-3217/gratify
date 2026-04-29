import { Box, Drawer, Stack, Text, Title, Badge, Group, ActionIcon } from '@mantine/core'
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
        title: { display: 'none' },
        body: { padding: 0, height: '100%' }
      }}
    >
      <Stack gap="md">
        {/* pin button + edit button at the top */}
        <Box style={{
          borderTop: `4px solid var(--mantine-color-${note.color}-6)`,
          background: `var(--mantine-color-${note.color}-light)`,
          padding: '20px 24px 16px'
        }}>
          <Group justify='space-between' align='flex-start'>
            <Text fw={700} size='xl' style={{ flex: 1 }}>{note.title}</Text>
            <Group gap="xs">
              <ActionIcon variant='subtle' size='xs' color='pink' onClick={onPin}>
                {note.pinned ?<PinOff size={16}/> : <Pin size={16} />}
                </ActionIcon>
              <ActionIcon variant='subtle' size='xs' color='green' onClick={onEdit}>
                <Pencil size={16} />
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
          <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} >{note.body}</Text>
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
          </Box>
        )}
        
      </Stack>
    </Drawer>
  )
}