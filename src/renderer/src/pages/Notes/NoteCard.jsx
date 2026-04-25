import { ActionIcon, Badge, Button, Card, Group, Text,  } from '@mantine/core'
import { Pencil, Trash, Pin } from 'lucide-react'

export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  return (
    <Card withBorder padding="md" radius="md">

      {/* top row: title + pin button */}
      <Group justify='space-between' wrap='nowrap'>
        <Group gap={'sm'} wrap='nowrap'>
          <Button leftSection={<Pin size={14}/>}></Button>
        </Group>
      </Group>

      {/* body preview — just the first 100 characters */}
      <Group gap={'xs'}>
        <Text lineClamp={1}>{note.text}</Text>
      </Group>
      {/* bottom row: tags + edit + delete */}
      <Group gap={'xs'}>
        <ActionIcon variant='subtle' color='green' onClick={onEdit}><Pencil size={16}/></ActionIcon>
        <ActionIcon variant='subtle' color='red' onClick={onDelete}><Trash size={16}/></ActionIcon>
      </Group>
    </Card>
  )
}