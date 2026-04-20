import { Card, Checkbox, Text, ActionIcon, Badge } from '@mantine/core'
import {Trash} from 'lucide-react';

function priorityColor(priority){
    const colors = {
        low: 'blue',
        medium: 'yellow',
        high: 'orange',
        urgent: 'red'
    }
    return colors[priority] ?? 'gray'
}


export default function TaskItem({task, onToggle, onDelete}){


    return (
        <Card withBorder padding="sm" radius="md">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
                    <Text td={task.completed? 'line-through' :undefined}>
                        {task.text}
                    </Text>
                </div>
                
            </div>
            <div className='flex items-center gap-2'>
                <Badge color={priorityColor(task.priority)}>
                    {task.priority}
                </Badge>
                <ActionIcon variant='subtle' color='red' onClick={() => onDelete(task.id)}>
                    <Trash size={16}/>
                </ActionIcon>
            </div>
            
        </Card>
        )

}