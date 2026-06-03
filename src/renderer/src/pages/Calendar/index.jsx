import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

import { ActionIcon, Box, Button, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getWeekDays, getEventsForDay, isSameDay } from "./useCalendarGrid";

import useCalendar from './useCalendar'
// Calendar settings must have date formats for displaying - both time and date


import EventModal from "./EventModal";
import { useDisclosure } from "@mantine/hooks";

export default function Calendar({ onNavigate }){

    const {events, addEvent, editEvent, deleteEvent} = useCalendar()

    const [selectedEvent, setSelectedEvent] = useState(null)

    const [view, setView] = useState('dayview')
    const [newEventDefaults, setNewEventDefaults] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [opened, {open, close}] = useDisclosure(false)
    const [editOpened, {open: editOpen, close: editClose}] = useDisclosure(false)


    
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



    return(
    <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={4} mb='xl'>
            <Group gap={8} justify="space-between">
                <Title fw={600} order={2}>Calendar</Title>
                <Group>
                    {/* <Button variant="subtle" size="xs" aria-label="Calendar Settings"><Settings2 size={12}/></Button> */}
                    <Button variant="subtle" onClick={open} size="xs" aria-label="Add Event"><Plus size={12}/></Button>

                </Group>
            </Group>
            <Text c="dimmed" size="sm">Organize your time!</Text>
            <Stack>
                <Box bg='pink' h='1px'/>
                <Group justify="space-between" align="center">
                <SegmentedControl
                variant="subtle"
                color="pink"
                withItemsBorders={false}
                radius='md'
                value={view}
                onChange={setView}
                data={[
                        { label: 'Day ', value: 'dayview' },
                        { label: 'Week ', value: 'weekview' },
                        { label: 'Month ', value: 'monthview' },
                     ]}
                />
                    <Group justify="center">
                        <ActionIcon variant="subtle" onClick={goBack} ><ChevronLeft size={16}/></ActionIcon>
                        {view === 'dayview' && (
                            <Group gap={4} align="center">
                                <Text size="sm" fw={500}>
                                    {selectedDate.toLocaleString('default', {weekday : 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                                </Text>
                                {getEventsForDay(events, selectedDate).length > 0 && (
                                    <Box style={{
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--mantine-color-cyan-6)',
                                        marginBottom: 2
                                    }}/> 
                                )}
                            </Group> 
                        )}
                        {view === 'weekview' && (
                            <Group gap={4} align="center">
                                <Text size="sm" fw={500}>
                                    {`Week ${getWeekDays(selectedDate)[0].toLocaleString('default', { month: 'short', day: 'numeric' })} - ${getWeekDays(selectedDate)[6].toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                </Text>
                                {/* {getEventsForDay(events, selectedDate).length > 0 && (
                                    <Box style={{
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--mantine-color-cyan-6)',
                                        marginBottom: 2
                                    }}/> 
                                )} */}
                            </Group> 
                        )}
                        {view === 'monthview' && (
                            <Group gap={4} align="center">
                                <Text size="sm" fw={500}>
                                    {selectedDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                                </Text>
                                {/* {getEventsForDay(events, selectedDate).length > 0 && (
                                    <Box style={{
                                        width: 6, height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--mantine-color-cyan-6)',
                                        marginBottom: 2
                                    }}/> 
                                )} */}
                            </Group> 
                        )}
                        <ActionIcon variant="subtle" onClick={goForward} ><ChevronRight size={16}/></ActionIcon>
                        <Button variant="subtle" size="xs" onClick={goToday} leftSection="Today"/>
                    </Group>
                </Group>
                
                
                {view === 'monthview' && (<MonthView
                    events={events} selectedDate={selectedDate} onDateSelect={(date) => {
                        setSelectedDate(date) 
                        setView('dayview')
                    }}
                    onEventClick={(event) => {setSelectedEvent(event)
                        editOpen()
                    }}
                    onSlotClick={(day, hour) => handleSlotClick(day,hour)}
                />)}
                {view === 'weekview' && (<WeekView
                    events={events} selectedDate={selectedDate} 
                    onEventClick={(event) => {setSelectedEvent(event)
                        editOpen()
                    }}
                    onSlotClick={(day, hour) => handleSlotClick(day,hour)}
                    onDayClick={(day) => {
                        setSelectedDate(day)
                        setView('dayview')
                    }}
                    dragHandlers={{}}
                />)}
                {view === 'dayview' && (<DayView
                events={events} selectedDate={selectedDate}
                onEventClick={(event) => {setSelectedEvent(event)
                    editOpen()
                }}
                onSlotClick={(day, hour) => handleSlotClick(day,hour)}
                dragHandlers={{}}
                />)}
            </Stack>    
        </Stack>
        <EventModal opened={opened} 
        onClose={() => { close(); setNewEventDefaults(null) }}
        onSave={(eventData) => { 
            addEvent(eventData)
            close()
        }}
        defaultStart={newEventDefaults?.start}
        defaultEnd={newEventDefaults?.end}
        />
        <EventModal opened={editOpened} onClose={editClose}
        onDelete={deleteEvent} 
        onSave={(eventData) => { 
            editEvent(selectedEvent.id, eventData )
            editClose()
        }} event={selectedEvent}
        />
    </Box>)
}