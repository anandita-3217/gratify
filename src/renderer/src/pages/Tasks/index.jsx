import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";

import { Box, Group, TextInput, Button, Stack, Text, Title, Progress  } from "@mantine/core";
import { Plus } from 'lucide-react';

import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useTasks } from "./useTasks";

function getGreeting(){
    const hour = new Date().getHours()
    if(hour < 12) return 'Good Morning!'
    if(hour < 18) return 'Good Afternoon!'
    return 'Good Evening!';
}

// TODO: add filters
export default function Tasks(){
    const {tasks, addTask, deleteTask, toggleTask,updateTask} = useTasks();
    const [input, setInput] = useState('');
    const [opened, { open, close }] = useDisclosure(false)
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
    const [selectedTask, setSelectedTask] = useState(null)

    function parseQuickTask(input){
        let text = input
        let priority = 'medium'
        let deadline = null

        const priorities  = ['low' ,'medium','high','urgent']
        priorities.forEach(p => {
            if(text.toLowerCase().includes(p)) {
                priority = p
                text = text.replace(new RegExp(p,'i'),'').trim()
            }
        })
        // TODO: if there is an actual date then as a date 
        const today = new Date()
        if (/tomorrow/i.test(text)) {
            deadline = new Date(today.setDate(today.getDate() + 1))
            text = text.replace(/tomorrow/i, '').trim()
        } else if (/today/i.test(text)) {
          deadline = new Date()
          text = text.replace(/today/i, '').trim()
        } else if (/next week/i.test(text)) {
          deadline = new Date(today.setDate(today.getDate() + 7))
          text = text.replace(/next week/i, '').trim()
        }

        return { text, priority, deadline }

    }

    function handleAdd(){
        if (!input.trim()) return
        const parsed = parseQuickTask(input)
        addTask({
            ...parsed,
            recurring: false,
            frequency: null
        })
        setInput('')
    }

    function handleEdit(task){
        setSelectedTask(task)
        openEdit()
    }

    const completed = tasks.filter(t => t.completed).length
    const total = tasks.length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    return (
        <Box p = "xl" style={{ height: '100%', overflow: 'auto'}}>
            
            <Stack gap={4} mb='xl'>
                <Title order={2} fw={600}>
                    {getGreeting()}
                </Title>
                <Group gap={8}>
                    <Text c="dimmed" size="sm">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                </Group>
                <Stack mt={'xl'}>
                    <Progress value={percentage} color="pink" />
                    <Button onClick={open} color="pink" ><Plus size={16}/> New Task </Button>
                    
                </Stack>
            </Stack>
            <Stack p="md">
                <div className="flex gap-2">
                    <TextInput placeholder="eg. Buy groceries tomorrow urgent "
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    className="flex-1"/>
                    <Button onClick={handleAdd} color="pink"><Plus size={16}/></Button>
                </div>
                <Stack gap="sm">
                    {/* TODO: if no tasks add div to say so */}
                    {tasks.map(task =>(
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onEdit={() => handleEdit(task)}
                        />
                    ))}
                </Stack>
            </Stack>
            <TaskModal opened={opened} onClose={close} onSave={(taskData) => {
                        addTask(taskData)
                        close()
                    }} task={null} />
            <TaskModal opened={editOpened} onClose={closeEdit} onSave={(taskData) => {
                        updateTask(selectedTask.id,taskData)
                        closeEdit()
                    }} task={selectedTask} />
        </Box>
    );
}