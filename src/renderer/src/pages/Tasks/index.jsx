import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";

import { Box, Chip ,Group, MultiSelect  ,TextInput, Button, Stack, Text, Title, Progress,SegmentedControl, Select  } from "@mantine/core";
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
    const [sort, setSort] = useState('created') // 'created' | 'deadline' | 'priority'
    const [filter, setFilter] = useState({
        priority : [],  // all, low, med,high, urgent 
        status: 'all', // all, active, completed
        frequency: [] // daily, weekly, monthly, custom, null
    })

    const priorityOrder = {urgent: 0, high: 1, medium: 2, low: 3 }

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
        
        const customReminderMatch = text.match(/remind me in\s+(\d+)\s*(min(?:ute)?s?|hour?s?)/i)
        if(customReminderMatch){
            const amount = parseInt(customReminderMatch[1])
            const unit = customReminderMatch[2].toLowerCase()
            reminder = unit.startsWith('min') ? String(amount) : String(amount * 60)
            text = text.replace(customReminderMatch[0],'').trim()
        }
        const reminderMatch = text.match(
            /remind me\s+(\d+)\s*(min(?:ute)?s?|hour?s?|day?s?)\s*before/i
        )
        if (reminderMatch){
            const amount = parseInt(reminderMatch[1])
            const unit = reminderMatch[2].toLowerCase()
            if (unit.startsWith('min')){
                reminder = String(amount)
            }else if(unit.startsWith('hour')){
                reminder = String(amount*60)
            }
            }else if(unit.startsWith('day')){
                reminder = String(amount*1440)
            }
            text = text.replace(reminderMatch[0],'').trim()
            const ddmmyyyy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
            if (ddmmyyyy){
                const [full, day, month, year] = ddmmyyyy
                deadline = new Date(year,month-1,day)
                text = text.replace(full,'').trim()
            } 
            if (!deadline){
                const parsed = chrono.parse(text, new Date(), {forwardDate: true})
                if(parsed.length > 0){
                    deadline = parsed[0].start.date()
                    text = text.replace(parsed[0].text,'').trim()
                }
            }
            
        return {text, priority, deadline,reminder}
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
      if (filter.priority.length > 0 && !filter.priority.includes(task.priority)) return false
      if (filter.status === 'active' && task.completed) return false
      if (filter.status === 'completed' && !task.completed) return false
      if (filter.frequency.length > 0 && !filter.frequency.includes(task.frequency)) return false
      return true
    })

    const sortedTasks = [...filteredTasks].sort((a,b) => {
        if (sort === 'priority'){
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        if (sort === 'deadline'){
            if(!a.deadline) return 1
            if(!b.deadline) return -1
            return new Date(a.deadline) - new Date(b.deadline)
        }
        return b.id - a.id
    })

    useEffect(()=>{
        if(Notification.permission === 'default'){
            Notification.requestPermission()
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            tasks.forEach(task => {
                if(!task.deadline || !task.reminder || task.completed) return

                const deadline = new Date(task.deadline)
                const now = new Date()
                const minutesUntilDeadline = (deadline - now) / 1000 / 60
                const reminderMinutes = parseInt(task.reminder)
                if(minutesUntilDeadline <= reminderMinutes && minutesUntilDeadline > reminderMinutes - 1){
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
                    {/* TODO: style so that all the filters stay in the same line - maybe look at pill buttons instead for filters */}
                <Stack gap="xs" mb="md"> 
                    <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed" w={60}>Status</Text>
                        <Chip.Group value={filter.status} onChange={(val) => setFilter(f=>({...f, status: val}))}>
                            <Group gap={"xs"}>
                                <Chip value="all" color="pink" size="sm">All</Chip>
                                <Chip value="active" color="pink" size="sm">Active</Chip>
                                <Chip value="complete" color="pink" size="sm">Complete</Chip>
                            </Group>
                        </Chip.Group>
                    </Group>
                    <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed" w={60}>Priority</Text>
                        <Chip.Group multiple value={filter.priority} onChange={(val) => setFilter(f=>({...f, priority: val}))}>
                            <Group gap={"xs"}>
                                <Chip value="low" color="#0c8599" size="sm">Low</Chip>
                                <Chip value="medium" color="#099268" size="sm">Medium</Chip>
                                <Chip value="high" color="#e03131" size="sm">High</Chip>
                                <Chip value="urgent" color="#6741d9" size="sm">Urgent</Chip>
                            </Group>
                        </Chip.Group>
                    </Group>
                    <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed" w={60}>Repeat</Text>
                        <Chip.Group multiple value={filter.frequency} onChange={(val) => setFilter(f=>({...f, frequency: val}))}>
                            <Group gap={"xs"}>
                                <Chip value="daily" color="pink" size="sm">Daily</Chip>
                                <Chip value="weekly" color="pink" size="sm">Weekly</Chip>
                                <Chip value="monthly" color="pink" size="sm">Monthly</Chip>
                                <Chip value="custom" color="pink" size="sm">Custom</Chip>
                            </Group>
                        </Chip.Group>
                    </Group>
                    <Group gap="xs" align="center">
                        <Text size="xs" c="dimmed" w={60}>Sorted</Text>
                        <Chip.Group multiple value={sort} onChange={setSort}>
                            <Group gap={"xs"}>
                                <Chip value="created" color="pink" size="sm">Created</Chip>
                                <Chip value="deadline" color="pink" size="sm">Deadline</Chip>
                                <Chip value="priority" color="pink" size="sm">Priority</Chip>                               
                            </Group>
                        </Chip.Group>
                    </Group>
                </Stack>
                <Stack gap="sm">
                    {sortedTasks.length === 0 ? (
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
                        sortedTasks.map(task =>(
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