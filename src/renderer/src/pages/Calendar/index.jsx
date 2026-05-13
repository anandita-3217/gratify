import { Box, Group, Stack, Text, Title } from "@mantine/core";


export default function Calendar({ onNavigate }){
    return(
    <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={4} mb='xl'>
                <Title fw={600} order={3}>Calendar</Title>
                <Text c="dimmed" size="sm">Organize your time!</Text>
            <Box bg='pink' h='1px'/>
        </Stack>
    </Box>)
}