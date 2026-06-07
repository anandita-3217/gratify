import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

import { ActionIcon, Box, Button, Group, SegmentedControl, Stack, Text, Title, Tooltip } from "@mantine/core";
import { ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";


import TaskModal from '../Tasks/TaskModal'

import useCalendarSync from './useCalendarSync'
import useDragToCreate from "./useDragToCreate";
import { getWeekDays, getEventsForDay, isSameDay } from "./useCalendarGrid";

import useCalendar from './useCalendar'
// Calendar settings must have date formats for displaying - both time and date


import EventModal from "./EventModal";
import { useDisclosure } from "@mantine/hooks";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function Calendar({ onNavigate }){

    const {events, addEvent, editEvent, deleteEvent} = useCalendar()
    const { syncedEvents } = useCalendarSync(events)
    const {dragHandlers} = useDragToCreate(({ start, end }) => {
      if (start < new Date()) return
      setNewEventDefaults({ start, end })
      open()
    })

    const [selectedEvent, setSelectedEvent] = useState(null)

    const [view, setView] = useState('dayview')
    const [newEventDefaults, setNewEventDefaults] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [opened, {open, close}] = useDisclosure(false)
    const [editOpened, {open: editOpen, close: editClose}] = useDisclosure(false)
    
    const [taskOpened, {open: taskOpen, close: taskClose}] = useDisclosure(false)
    const [selectedTask, setSelectedTask] = useState(null)

    const tasks = useLocalStorage('tasks')
    
    function goBack(){
        const d = new Date(selectedDate)
        if (view === 'dayview') d.setDate(d.getDate() - 1)
        if (view === 'weekview') d.setDate(d.getDate() - 7)
        if (view === 'monthview') d.setMonth(d.getMonth() - 1)
        setSelectedDate(d)
    }
    
    function goForward(){
        const d = new Date(selectedDate)
        if (view === 'dayview') d.setDate(d.getDate() + 1)
        if (view === 'weekview') d.setDate(d.getDate() + 7)
        if (view === 'monthview') d.setMonth(d.getMonth() + 1)
        setSelectedDate(d)
    }

    function goToday(){
        setSelectedDate(new Date())
    }

    function handleSlotClick(day, hour){
        const start = new Date(day)
        start.setHours(hour, 0, 0, 0)
        if (start < new Date()) return
        
        const end = new Date(day)
        end.setHours(hour+1,0,0,0)
        setNewEventDefaults({ start, end })
        open()
    }

    useEffect(() => {
        function handleKeyDown(e){
            if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ) return
            if(opened || editOpened) return

            if(e.key === 'd') setView('dayview')
            if(e.key === 'w') setView('weekview')
            if(e.key === 'm') setView('monthview')
            if(e.key === 't') goToday()

        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown) 

    },[opened, editOpened]) 


return (
  <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
    <Stack gap={8}>
      
      {/* title row */}
      <Group justify="space-between" align="center">
        <Stack gap={0}>
          <Title fw={600} order={2}>Calendar</Title>
          <Text c="dimmed" size="sm">Organize your time!</Text>
        </Stack>
        <Button 
          variant="subtle" 
          color="pink" 
          size="xs" 
          radius="xl"
          onClick={open}
        >
            <Plus size={12}/>
        </Button>
      </Group>

      <Box h={1} style={{ background: 'linear-gradient(to right, transparent, var(--mantine-color-pink-6), transparent)' }}/>

      {/* nav row — segmented control + prev/next/today + date display */}
      <Group justify="space-between" align="center">
        
        <SegmentedControl
          withItemsBorders={false}
          radius='md'
          value={view}
          onChange={setView}
          data={[
            { label: <Tooltip label="D" position="bottom" withArrow><span>Day</span></Tooltip>, value: 'dayview' },
            { label: <Tooltip label="W" position="bottom" withArrow><span>Week</span></Tooltip>, value: 'weekview' },
            { label: <Tooltip label="M" position="bottom" withArrow><span>Month</span></Tooltip>, value: 'monthview' },
          ]}
        />

        {/* date display — center */}
        <Group gap={6} align="center">
          <ActionIcon variant="subtle" color="pink" onClick={goBack}><ChevronLeft size={16}/></ActionIcon>
          
          <Group gap={4} align="center">
            {view === 'dayview' && (
              <>
                <Text size="sm" fw={600}>
                  {selectedDate.toLocaleString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
                {getEventsForDay(events, selectedDate).length > 0 && (
                  <Box style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-pink-6)',
                    marginBottom: 2
                  }}/>
                )}
              </>
            )}
            {view === 'weekview' && (
              <Text size="sm" fw={600}>
                {`${getWeekDays(selectedDate)[0].toLocaleString('default', { month: 'short', day: 'numeric' })} — ${getWeekDays(selectedDate)[6].toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </Text>
            )}
            {view === 'monthview' && (
              <Text size="sm" fw={600}>
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
            )}
          </Group>

          <ActionIcon variant="subtle" color="pink" onClick={goForward}><ChevronRight size={16}/></ActionIcon>
          <Button variant="subtle" color="pink" size="xs" onClick={goToday}>Today</Button>
        </Group>

      </Group>

      {/* views */}
      {view === 'monthview' && (
        <MonthView
          events={syncedEvents}
          selectedDate={selectedDate}
          onDateSelect={(date) => { setSelectedDate(date); setView('dayview') }}
          // onEventClick={(event) => { setSelectedEvent(event); editOpen() }}
          onEventClick={(event) => {
  if (event.isTaskEvent) {
    // find the task and open TaskModal
    setSelectedTask(tasks.find(t => t.id === event.taskId))
    taskModalOpen()
  } else {
    setSelectedEvent(event)
    editOpen()
  }
}}
          // onSlotClick={(day, hour) => handleSlotClick(day, hour)}
        />
      )}
      {view === 'weekview' && (
        <WeekView
          events={syncedEvents}
          selectedDate={selectedDate}
          onEventClick={(event) => { setSelectedEvent(event); editOpen() }}
          onSlotClick={(day, hour) => handleSlotClick(day, hour)}
          onDayClick={(day) => { setSelectedDate(day); setView('dayview') }}
          dragHandlers={dragHandlers}
        />
      )}
      {view === 'dayview' && (
        <DayView
          events={syncedEvents}
          selectedDate={selectedDate}
          onEventClick={(event) => { setSelectedEvent(event); editOpen() }}
          onSlotClick={(day, hour) => handleSlotClick(day, hour)}
          dragHandlers={dragHandlers}
        />
      )}

    </Stack>

    <EventModal
      opened={opened}
      onClose={() => { close(); setNewEventDefaults(null) }}
      onSave={(eventData) => { addEvent(eventData); close() }}
      defaultStart={newEventDefaults?.start}
      defaultEnd={newEventDefaults?.end}
    />
    <EventModal
      opened={editOpened}
      onClose={editClose}
      onDelete={deleteEvent}
      onSave={(eventData) => { editEvent(selectedEvent.id, eventData); editClose() }}
      event={selectedEvent}
    />
  </Box>
)

}