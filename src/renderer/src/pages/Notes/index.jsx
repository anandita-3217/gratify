// useNotes.js       ← CRUD logic
//     ↓
// NoteCard.jsx      ← single note card
//     ↓
// NoteModal.jsx     ← create/edit modal
//     ↓
// Notes/index.jsx   ← puts it all together

import useNotes from "./useNotes";
import { Box, Group, Stack, Text, Title } from  '@mantine/core'

function getGreeting(){
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning!'
    if (hour < 18) return 'Good Afternoon!'
    return 'Good Evening!'
}

export default function Notes(){
    const { notes, addNote, deleteNote, updateNote, pinNote } = useNotes();
    function handleAdd(){

    }
    function handleSave(){

    }
    // TODO: make md compatible and code recognizable and format it even if i need to use a packagae or a 3rd party app

    return (
        <Box p={"xl"} style={{ height: '100%', overflow: 'auto' }}>
            <Stack gap={4} mb={'xl'}>
                <Title order={2} fw={600}>
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
            </Stack>
            
        </Box>
    )
}