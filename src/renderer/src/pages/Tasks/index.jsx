import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";
// TODO: add a search bar too 
import { Box, Badge, Chip ,Group, MultiSelect  ,TextInput, Button, Stack, Text, Title, Progress, Select  } from "@mantine/core";
import {  Plus,SlidersHorizontal   } from 'lucide-react';

import { useDisclosure } from "@mantine/hooks";
import { useEffect,useRef,  useState } from "react";
import { useTasks } from "./useTasks";
import useNotifications from '../../hooks/useNotifications'

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
    const [sort, setSort] = useState('created-desc') // 'created' | 'deadline' | 'priority'
    const [filter, setFilter] = useState({
        priority : [],  // all, low, med,high, urgent 
        status: 'all', // all, active, completed
        frequency: [] // daily, weekly, monthly, custom, null
    })
    const [filtersOpen, setFiltersOpen] = useState(false)

    const priorityOrder = {urgent: 0, high: 1, medium: 2, low: 3 }

    function parseQuickTask(input) {
        let text = input
        let priority = 'low'
        let deadline = null
        let reminder = null

        // Priorities
        const priorities = [ 'low', 'medium', 'high', 'urgent' ]
        priorities.forEach(p => {
            if (text.toLocaleString().includes(p)) {
                priority = p
                text = text.replace(new RegExp(p,'i'), '').trim()
            }
        })
        // Date format
        const ddmmyyyy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
        if (ddmmyyyy) {
            const [full, day, month, year] = ddmmyyyy
            deadline = new Date(year, month - 1, day)
            text = text.replace(full, '').trim()
        }
        // Deadline
        if(!deadline) {
            const parsed = chrono.parse(text, new Date(), { forwardDate: true })
            if(parsed.length > 0) {
                deadline = parsed[0].start.date()
                text = text.replace(parsed[0].text, '').trim()
            }
        }
        // Reminder
        // custom:
        const customReminderMatch = text.match(/remind me in \s+(\d+)\s*(min(?:ute)?s?|hour?s?)/i)
        if (customReminderMatch) {
            const amount = parseInt(customReminderMatch[1])
            const unit = customReminderMatch[2].toLowerCase()
            reminder = unit.startsWith('min') ? String(amount) : String(amount * 60)
            text = text.replace(customReminderMatch[0], '').trim()
        }
        // preset:
        const reminderMatch = text.match(/remind me\s+(\d+)\s*(min(?:ute)?s?|hour?s|day?s)\s*before/i)
        if(reminderMatch){
            const amount = parseInt(reminderMatch[1])
            const unit = reminderMatch[2].toLowerCase()
            if (unit.startsWith('min')){
                reminder = String(amount)
            }
            else if (unit.startsWith('hour')){
                reminder = String(amount * 60)
            }
            else if (unit.startsWith('day')) {
                reminder = String(amount * 1440)
            }
            text = text.replace(reminderMatch[0], '').trim()
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
      if (filter.priority.length > 0 && !filter.priority.includes(task.priority)) return false
      if (filter.status === 'active' && task.completed) return false
      if (filter.status === 'completed' && !task.completed) return false
      if (filter.frequency.length > 0 && !filter.frequency.includes(task.frequency)) return false
      return true
    })

    const sortedTasks = [...filteredTasks].sort((a,b) => {
        switch(sort){
            case 'priority-desc':
                return priorityOrder[a.priority] - priorityOrder[b.priority]
            case 'priority-asc':
                return priorityOrder[b.priority] - priorityOrder[a.priority]
            case 'deadline-asc':
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return new Date(a.deadline) - new Date(b.deadline)
            case 'deadline-desc':
                if (!a.deadline) return 1
                if (!b.deadline) return -1
                return new Date(b.deadline) - new Date(a.deadline)
                case 'created-asc':
                    return a.id - b.id
                    
            case 'created-desc':
            default:
                return b.id - a.id
        }
    })

    const { notify } = useNotifications()

    const taskRef = useRef(tasks)

    const firedReminders = useRef(new Set())

    useEffect(() => {
        taskRef.current = tasks
    },[tasks])

    useEffect(() => {
        const interval = setInterval(() =>{
            taskRef.current.forEach(task =>{
                if(!task.deadline || !task.reminder || task.completed) return

                const deadline = new Date(task.deadline)
                const now = new Date()
                const minutesUntilReminder = (deadline - now) / 1000 / 60
                const reminderMinutes = parseInt(task.reminder)

                const reminderKey = `${task.id} -${task.reminder}`

                if(minutesUntilReminder <= reminderMinutes && minutesUntilReminder > reminderMinutes - 1 && !firedReminders.current.has(reminderKey)){
                    firedReminders.current.add(reminderKey)
                    notify({
                        title: `Reminder: ${task.text}`,
                        message: `Due: ${deadline.toLocaleString()}`,
                        color: 'pink'
                    })
                }
            })
        }, 60000)
        return () => clearInterval(interval)
    },[])




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
                    <Button onClick={open} color="pink" leftSection={<Plus size={16}/>} >New Task</Button>
                    
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
                
                 <Group justify="space-between" mb={"xs"}>
                        <Group gap={"xs"}>
                            <Button 
                                variant="light" 
                                color="pink" 
                                size="xs" 
                                leftSection={<SlidersHorizontal size={14}/>} 
                                onClick={() => setFiltersOpen(f => !f)} >Filters & Sort</Button>
                            {(filter.priority.length > 0 || filter.frequency.length > 0 || filter.status !== 'all' ) && (
                                <Badge color="pink" size={"sm"} variant="light">
                                    {filter.priority.length + filter.frequency.length * (filter.status !== 'all' ? 1 : 0)} active 
                                </Badge>
                            )}
                        </Group>
                    {(filter.priority.length > 0 || filter.frequency.length > 0 || filter.status !== 'all') && (
                        <Button variant="subtle" color="gray" size="xs" onClick={() => setFilter({ priority: [], status: 'all', frequency:[]} )} >Clear</Button>
                    )}
                </Group>
                {filtersOpen &&(
                    <Stack gap={"xs"} mb={"md"} p={"sm"} style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 8 }}>
                        <Group gap={"xs"} align="center">
                            <Text size="xs" c={"dimmed"} w={60}>Status</Text>
                            <Chip.Group value={filter.status} onChange={(val) => setFilter(f => ({...f, status: val}))}>
                                <Group gap={"xs"}>
                                    <Chip  fz="xs"  value="all" color="pink" size="sm">All</Chip>
                                    <Chip  fz="xs"  value="active" color="pink" size="sm">Active</Chip>
                                    <Chip  fz="xs"  value="completed" color="pink" size="sm">Completed</Chip>
                                </Group>
                            </Chip.Group>
                        </Group>

                        <Group gap={"xs"} align="center">
                            <Text size="xs" c={"dimmed"} w={60}>Priority</Text>
                            <Chip.Group multiple value={filter.priority} onChange={(val) => setFilter(f => ({...f, priority: val}))}>
                                <Group gap={"xs"}>
                                    <Chip fz="xs" value="low" color="#0c8599" size="sm">Low</Chip>
                                    <Chip fz="xs" value="medium" color="#099268" size="sm">Medium</Chip>
                                    <Chip fz="xs" value="high" color="#e03131" size="sm">High</Chip>
                                    <Chip fz="xs" value="urgent" color="#6741d9" size="sm">Urgent</Chip>
                                </Group>
                            </Chip.Group>
                        </Group>
                        
                        <Group gap={"xs"} align="center">
                            <Text size="xs" c={"dimmed"} w={60}>Repeat</Text>
                            <Chip.Group multiple value={filter.frequency} onChange={(val) => setFilter(f => ({...f, frequency: val}))}>
                                <Group gap={"xs"}>
                                    <Chip fz="xs" value="daily" color="pink" size="sm">Daily</Chip>
                                    <Chip fz="xs" value="weekly" color="pink" size="sm">Weekly</Chip>
                                    <Chip fz="xs" value="monthly" color="pink" size="sm">Monthly</Chip>
                                    <Chip fz="xs" value="custom" color="pink" size="sm">Custom</Chip>
                                </Group>
                            </Chip.Group>
                        </Group>
                       
                        <Group gap={"xs"} align="center">
                            <Text size="xs" c={"dimmed"} w={60}>Sort</Text>
                            <Select size="xs" value={sort} onChange={setSort} style={{ width: 180 }}
                                data={[
                                    { value: 'created-desc', label: '↓ Newest first' },
                                    { value: 'created-asc', label: '↑  Oldest first' },
                                    { value: 'deadline-asc', label: '↑  Deadline (earlest)' },
                                    { value: 'deadline-desc', label: '↓ Deadline (latest)' },
                                    { value: 'priority-asc', label: '↑  Priority (low→urgent)' },
                                    { value: 'priority-desc', label: '↓ Priority (urgent→low)' },
                                ]}
                            />
                        </Group>
                    </Stack>
                )} 
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