import { Box, Group, Stack, Text, Title } from "@mantine/core";

function getGreeting(){
    const hours = new Date().getHours()
    if (hours < 12) return 'Good Morning!'
    if (hours < 18) return 'Good Afternoon'
    return 'Good Evening!'
}

export default function Calendar({ onNavigate }){
    return(
    <Box p='xl' style={{ height: '100%', overflow: 'auto' }}>
        <Stack gap={4} mb='xl'>
            <Title fw={600} order={2}>
                {getGreeting()}
            </Title>
            <Group gap={8}>
                <Text c='dimmed' size="sm">
                    {new Date().toLocaleDateString('en-us',{
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </Group>
            <Box bg='pink' h='10px'/>
        </Stack>
    </Box>)
}