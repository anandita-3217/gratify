import { ActionIcon, Badge, Button, Card, Checkbox, Group, Text  } from '@mantine/core'
import { Pencil, Pin, PinOff, Trash, X  } from 'lucide-react'


export default function NoteCard({ note, onEdit, onDelete, onPin, onTagDelete }) {
  return (
    <Card padding="md" radius="md" style={{ border: `2px solid var(--mantine-color-${note.color}-8)`}} >

      {/* top row: title + pin button */}
      <div className='group flex items-center justify-between mb-2'>
          <Text fw={note.pinned ? 600 : undefined} truncate>{note.title}</Text>
          <ActionIcon variant='subtle' color={note.pinned ? 'pink' : 'gray'} onClick={onPin}>
            {note.pinned ? <PinOff size={16}/> : <Pin size={16}/>} 
          </ActionIcon>

      </div>
      {/* body preview — just the first 100 characters */}    
      <Text size='xs' lineClamp={2} c="dimmed">{note.body}</Text>
      {/* bottom row: tags + edit + delete */}
      <Group justify='space-between'>
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
        <Group gap={'xs'}>
          <ActionIcon variant='subtle' color='green' onClick={onEdit}><Pencil size={16}/></ActionIcon>
          <ActionIcon variant='subtle' color='red' onClick={onDelete}><Trash size={16}/></ActionIcon>
        </Group>
      </Group>
    </Card>
  )
}