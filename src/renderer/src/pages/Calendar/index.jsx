import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

import { Box, Button, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { Settings2 } from "lucide-react";
import { useState } from "react";
// Calendar settings must have date formats for displaying - both time and date


export default function Calendar({ onNavigate }){
    const [view, setView] = useState('dayview')
    const [selectedDate, setSelectedDate] = useState(new Date())

    return(
    <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={4} mb='xl'>
            <Group gap={8} justify="space-between">
                <Title fw={600} order={2}>Calendar</Title>
                <Button variant="subtle" size="xs" aria-label="Calendar Settings"><Settings2 size={12}/></Button>
            </Group>
            <Text c="dimmed" size="sm">Organize your time!</Text>
            <Stack>
                <Box bg='pink' h='1px'/>
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
                {view === 'monthview' && <MonthView/>}
                {view === 'weekview' && <WeekView/>}
                {view === 'dayview' && <DayView/>}
            </Stack>    
            
        </Stack>
    </Box>)
}