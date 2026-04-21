import { Card, Checkbox, Text, ActionIcon, Badge,Group  } from '@mantine/core'
import { Clock, Pencil, Repeat, Trash } from 'lucide-react';

function priorityColor(priority){
    const colors = {
        low: '#0c8599',
        medium: '#099268',
        high: '#e03131',
        urgent: '#6741d9'
    }
    return colors[priority] ?? 'gray'
}
// TODO: add custom frequency

// export default function TaskItem({task, onToggle, onDelete, onEdit}){


//     return (
//         <Card withBorder padding="sm" radius="md">
//             <div className="flex items-center justify-between">
//                 <div className='flex items-center gap-3'>
//                     <Checkbox color='pink' checked={task.completed} onChange={() => onToggle(task.id)} />
//                     <Text td={task.completed? 'line-through' :undefined}>
//                         {task.text}
//                     </Text>
//                 </div>
                
//             </div>
//             <div className='flex items-center gap-3'>
//                 <Group gap={6} mt={4}>
//                     {task.recurring && (
//                         <Badge variant="light" color="blue" size="xs" leftSection={<Repeat size={10}/>}>
//                             {task.frequency}
//                         </Badge>
//                     )}
//                     {task.deadline && (
//                         <Badge variant="light" color="gray" size="xs" leftSection={<Clock size={10} />}>
//                           {new Date(task.deadline).toLocaleDateString()}
//                         </Badge>
//                     )}
//                 </Group>
//             </div>
//             <div className='flex items-center gap-2'>
//                 <Badge color={priorityColor(task.priority)}>
//                     {task.priority}
//                 </Badge>
//                 <ActionIcon variant='subtle' color='green' onClick={onEdit}>
//                     <Pencil size={16}/>
//                 </ActionIcon>
//                 <ActionIcon variant='subtle' color='red' onClick={() => onDelete(task.id)}>
//                     <Trash size={16}/>
//                 </ActionIcon>
//             </div>
            
//         </Card>
//         )

// }
export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <Card withBorder padding="md" radius="md">
      
      {/* Row 1: checkbox + text + actions */}
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <Checkbox 
            color="pink" 
            checked={task.completed} 
            onChange={() => onToggle(task.id)} 
          />
          <Text 
            td={task.completed ? 'line-through' : undefined}
            c={task.completed ? 'dimmed' : undefined}
          >
            {task.text}
          </Text>
        </Group>

        {/* Actions */}
        <Group gap="xs">
          <ActionIcon variant="subtle" color="pink" onClick={onEdit}>
            <Pencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => onDelete(task.id)}>
            <Trash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Row 2: priority + recurring + deadline */}
      <Group gap="xs" mt="sm">
        <Badge 
          color={priorityColor(task.priority)}
          variant="light"
          size="sm"
        >
          {task.priority}
        </Badge>

        {task.recurring && (
          <Badge variant="light" color="blue" size="sm" leftSection={<Repeat size={10} />}>
            {task.frequency}
          </Badge>
        )}

        {task.deadline && (
          <Badge variant="light" color="gray" size="sm" leftSection={<Clock size={10} />}>
            {new Date(task.deadline).toLocaleString()}
          </Badge>
        )}
      </Group>

    </Card>
  )
}