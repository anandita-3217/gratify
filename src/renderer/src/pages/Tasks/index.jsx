import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";

import { Box, Group, TextInput, Button, Stack, Text, Title, Progress,SegmentedControl, Select  } from "@mantine/core";
import { Plus } from 'lucide-react';

import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTasks } from "./useTasks";

import * as chrono from 'chrono-node';

function getGreeting(){
    const hour = new Date().getHours()
    if(hour < 12) return 'Good Morning!'
    if(hour < 18) return 'Good Afternoon!'
    return 'Good Evening!';
}

export default function Tasks(){
    const {tasks, addTask, deleteTask, toggleTask,updateTask} = useTasks();
    const [input, setInput] = useState('');
    const [opened, { open, close }] = useDisclosure(false)
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [filter, setFilter] = useState({
        priority : 'all',  // all, low, med,high, urgent 
        status: 'all', // all, active, completed
        frequency: 'all' // daily, weekly, monthly, custom, null
    })

    function parseQuickTask(input){
        let text = input
        let priority = 'medium'
        let deadline = null
        let reminder = null

        const priorities  = ['low' ,'medium','high','urgent']
        priorities.forEach(p => {
            if(text.toLowerCase().includes(p)) {
                priority = p
                text = text.replace(new RegExp(p,'i'),'').trim()
            }
        })
        
        if(/remind me/i.test(text)){
            if(/1 hour/i.test(text)) reminder = '60'
            else if(/1 day/i.test(text)) reminder = '1440'
            else reminder = '15'
            text = text.replace(/remind me.*/i,'').trim()
        }

        //TODO: i want both cases regular text or dates and remember to add date as dd/MM/YYYY
        
        // const today = new Date()
        // if (/tomorrow/i.test(text)) {
        //     deadline = new Date(today.setDate(today.getDate() + 1))
        //     text = text.replace(/tomorrow/i, '').trim()
        // } else if (/today/i.test(text)) {
        //   deadline = new Date()
        //   text = text.replace(/today/i, '').trim()
        // } else if (/next week/i.test(text)) {
        //   deadline = new Date(today.setDate(today.getDate() + 7))
        //   text = text.replace(/next week/i, '').trim()
        // }
        // TODO: if there is an actual date then as a date 
        const parsed = chrono.parse(text)
        if (parsed.length > 0) {
          deadline = parsed[0].start.date()
          // remove the date text from the task name
          text = text.replace(parsed[0].text, '').trim()
        }

        return { text, priority, deadline, reminder }

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



    const filteredTasks = tasks.filter(task => {
        if(filter.priority !== 'all' && task.priority !== filter.priority) return false 
        if(filter.status === 'active' && task.completed) return false
        if(filter.status === 'completed' && !task.completed) return false
        if(filter.frequency !== 'all' && task.frequency !== filter.frequency) return false
        return true
    })

    useEffect(()=>{
        if(Notification.permission === 'default'){
            Notification.requestPermission()
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            tasks.forEach(task => {
                if(!task.deadline || task.reminder || task.completed) return

                const deadline = new Date(task.deadline)
                const noe = new Date()
                const minutesUntilDeadline = (deadline - now) / 1000 / 60
                const reminderMinutes = parseInt(task.reminder)
                if(minutesUntilDeadline <= reminderMinutes && minutesUntilDeadline > reminderMinutes){
                    new Notification(`Task reminder: ${task.text}`, {
                        body: `Due ${deadline.toLocaleString()}`
                    })
                }
            })
        }, 60000);
        return () => clearInterval(interval)
    },[tasks])

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
                    <TextInput placeholder="eg. Meeting with John next Friday at 3pm urgent "
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    className="flex-1"/>
                    <Button onClick={handleAdd} color="pink"><Plus size={16}/></Button>
                </div>
                <Group gap="sm" mb='md'>
                    {/* TODO: check for multiple select for freq and priority */}
                    {/* TODO: style so that all the filters stay in the same line - maybe look at pill buttons instead for filters */}
                    <Text>Filters: </Text>
                    <SegmentedControl 
                        value={filter.status}
                        onChange={(val) => setFilter(f => ({...f, status: val}))}
                        data={[
                            { label: 'All', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'Completed', value: 'completed' }
                        ]}
                        color="pink"/>
                    <SegmentedControl
                        value={filter.priority}
                        onChange={(val) => setFilter(f => ({...f, priority: val}))}
                        data={[
                            { label: 'All', value: 'all' },
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High', value: 'high' },
                            { label: 'Urgent', value: 'urgent' }
                        ]}
                        color="pink"/>
                    <SegmentedControl
                        value={filter.frequency}
                        onChange={(val) => setFilter(f => ({...f, frequency: val}))}
                        data={[
                            { label: 'All', value: 'all' },
                            { label: 'Daily', value: 'daily' },
                            { label: 'Weekly', value: 'weekly' },
                            { label: 'Monthly', value: 'monthly' },
                            { label: 'Custom', value: 'custom' }
                        ]}
                        color="pink"/>
                </Group>
                <Stack gap="sm">
                    {filteredTasks.length === 0 ? (
                        <Box p='xl' 
                            style={{
                                textAlign: 'center',
                                border: '2px dashed var(--mantine-color-default-border)',
                                borderRadius: '12px'
                            }}>
                            <Text c='dimmed' size="sm">
                                {tasks.length === 0 ?
                                    "No tasks yet - add some!" : "No tasks match your filters"
                                }
                            </Text>
                        </Box>
                    ):(
                        filteredTasks.map(task =>(
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                                onEdit={() => handleEdit(task)}
                            />
                        ))

                    )}
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