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

export default function Tasks(){
    const {tasks, addTask, deleteTask, toggleTask} = useTasks();
    const [input, setInput] = useState('');
    const [opened,{open,close}] = useDisclosure(false)


    function handleAdd(){
        if (!input.trim()) return
        addTask({
            text: input,
            priority: 'medium',
            deadline: null,
            recurring: false,
            frequency: null
        })
        setInput('')
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
                <Stack>
                    <Progress value={percentage} color="pink" />
                    <Button onClick={open} color="pink" ><Plus size={16}/> New Task </Button>
                    
                </Stack>
            </Stack>
            <Stack p="md">
                <div className="flex gap-2">
                    <TextInput placeholder="add a quick task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    className="flex-1"/>
                    <Button onClick={handleAdd} color="pink"><Plus size={16}/></Button>
                </div>
                <Stack gap="sm">
                    {tasks.map(task =>(
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                        />
                    ))}
                </Stack>
            </Stack>
            <TaskModal opened={opened} onClose={close} onSave={(taskData) => {
                        addTask(taskData)
                        close()
                    }} task={null} />
        </Box>
    );
}