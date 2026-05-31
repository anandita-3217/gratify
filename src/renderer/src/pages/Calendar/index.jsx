import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

import { ActionIcon, Box, Button, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { getWeekDays } from "./useCalendarGrid";

import useCalendar from './useCalendar'
// Calendar settings must have date formats for displaying - both time and date


import EventModal from "./EventModal";
import { useDisclosure } from "@mantine/hooks";

export default function Calendar({ onNavigate }){

    const {events, addEvent, editEvent, deleteEvent} = useCalendar()

    const [selectedEvent, setSelectedEvent] = useState(null)

    const [view, setView] = useState('dayview')
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

    return(
    <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={4} mb='xl'>
            <Group gap={8} justify="space-between">
                <Title fw={600} order={2}>Calendar</Title>
                <Group>
                    <Button variant="subtle" size="xs" aria-label="Calendar Settings"><Settings2 size={12}/></Button>
                    <Button variant="subtle" onClick={open} size="xs" aria-label="Add Event"><Plus size={12}/></Button>

                </Group>
            </Group>
            <Text c="dimmed" size="sm">Organize your time!</Text>
            <Stack>
                <Box bg='pink' h='1px'/>
                <Group justify="space-between" align="center">
                    <Group gap='xs'>
                        <ActionIcon variant="subtle" onClick={goBack} ><ChevronLeft size={16}/></ActionIcon>
                        <ActionIcon variant="subtle" onClick={goForward} ><ChevronRight size={16}/></ActionIcon>
                        <Button variant="subtle" size="xs" onClick={goToday} leftSection="Today"/>
                    </Group>
                </Group>
                
                <Text fw={600}>
                    {view === 'monthview' && selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    {view === 'weekview' && `Week of ${getWeekDays(selectedDate)[0].toLocaleString('default', { month: 'short', day: 'numeric' })}`}
                    {view === 'dayview' && selectedDate.toLocaleString('default' ,{ weekday: 'long', month: 'long', day: 'numeric' })} 
                </Text>
                
                <SegmentedControl
                variant="subtle"
                color="pink"
                withItemsBorders={false}
                radius='md'
                value={view}
                onChange={setView}
                data={[
                        { label: 'Day View', value: 'dayview' },
                        { label: 'Week View', value: 'weekview' },
                        { label: 'Month View', value: 'monthview' },
                     ]}
                />
                {view === 'monthview' && (<MonthView
                    events={[]} selectedDate={selectedDate} onDateSelect={(date) => {
                        setSelectedDate(date) 
                        setView('dayview')
                    }}
                    onEventClick={() => {}}
                    onSlotClick={() => {}}
                />)}
                {view === 'weekview' && (<WeekView
                    events={[]} selectedDate={selectedDate} 
                    onEventClick={() => {}}
                    onSlotClick={(day, hour) => {
                        setSelectedDate(day)
                    }}
                    onDayClick={(day) => {
                        setSelectedDate(day)
                        setView('dayview')
                    }}
                    dragHandlers={{}}
                />)}
                {view === 'dayview' && (<DayView
                events={[]} selectedDate={selectedDate}
                onEventClick={() => {}}
                onSlotClick={(day, hour) => {}}
                dragHandlers={{}}
                />)}
            </Stack>    
        </Stack>
        <EventModal opened={opened} onClose={close} 
        onSave={(eventData) => { 
            addEvent(eventData)
            close()
        }}
        />
        <EventModal opened={editOpened} onClose={editClose} 
        onSave={(eventData) => { 
            editEvent(selectedEvent.id, eventData )
            editClose()
        }} event={selectedEvent}
        />
    </Box>)
}