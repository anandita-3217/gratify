import { Card, Checkbox, Text, ActionIcon, Badge,Group  } from '@mantine/core'
import { Bell, Clock, Pencil, Repeat, Trash } from 'lucide-react';

function priorityColor(priority){
    const colors = {
        low: '#0c8599',
        medium: '#099268',
        high: '#e03131',
        urgent: '#6741d9'
    }
    return colors[priority]
}

function formatReminder(minutes){
  if(!minutes) return null
  const m = parseInt(minutes)
  if(m<60) return `${m}m before`
  if(m<1440) return `${m/60}hr before`
  return `${m/1440}d before`
}

function isOverdue(task){
  if (!task.deadline || task.completed) return false  
  return new Date(task.deadline) < new Date()
}

const reminderLabels = {
  '15' : '15m before',
  '60' : '1 hour before',
  '1440' : '1 day before',
}

export default function TaskItem({task, onToggle, onDelete, onEdit}){

  const overdue = isOverdue(task)
    return (
        <Card withBorder padding="sm" radius="md" style={overdue ? { borderColor: '#e03131' } : undefined}>
          <Group justify='space-between' wrap='nowrap'>
            <Group gap={'sm'} wrap='nowrap'>
              <Checkbox 
                color='pink' 
                checked={task.completed} 
                onChange={() => onToggle(task.id)} 
              />
              {/* <Text td={task.completed? 'line-through' : undefined} c={task.completed ? 'dimmed' : undefined}>
                  {task.text}
              </Text> */}
              <div>
        <Group gap="xs">
          <Text td={task.completed ? 'line-through' : undefined} c={task.completed ? 'dimmed' : undefined}>
            {task.text}
          </Text>
          {/* angry overdue indicator */}
          {overdue && (
            <Text size="sm">😤</Text>
          )}
        </Group>
        {overdue && (
          <Text size="xs" c="red">Overdue</Text>
        )}
      </div>
            </Group>
            <Group gap={'xs'}>
              <ActionIcon variant='subtle' color='green' onClick={onEdit}>
                <Pencil size={16}/>
              </ActionIcon>
              <ActionIcon variant='subtle' color='red' onClick={() => onDelete(task.id)}>
                  <Trash size={16}/>
              </ActionIcon>
            </Group>
          </Group>
          <Group gap={'xs'} mt={'sm'}>
            <Badge variant='light' size='sm' color={priorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.recurring && (
                <Badge variant="light" color="blue" size="xs" leftSection={<Repeat size={10}/>}>
                    {task.frequency}
                </Badge>
            )}
            {task.deadline && (
                <Badge variant="light" color="gray" size="xs" leftSection={<Clock size={10} />}>
                  {new Date(task.deadline).toLocaleDateString()}
                </Badge>
            )}  
            {task.reminder && (
              <Badge variant='light' color='yellow' size='sm' leftSection={<Bell size={10}/>}>
                {formatReminder(task.reminder)}
              </Badge>
            )}              
          </Group>
        </Card>
        )

}
