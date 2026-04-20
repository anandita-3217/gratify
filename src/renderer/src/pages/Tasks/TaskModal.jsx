import {Box ,Center, Checkbox, Stack, Title,TextInput, Modal, Group, Select, Button} from '@mantine/core'
import{DateInput} from '@mantine/dates';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({opened, onSave, onClose, task}){

    const [text, setText] = useState('');
    const [priority, setPriority] = useState();
    const [date, setDate] = useState();
    const [recurring, setRecurring] = useState(false);
    const [frequency, setFrequency] = useState();

    function handleSave(){
        onSave({text,priority,deadline: date, recurring, frequency})
        onClose()
    }

    return (
        <Modal opened={opened} onClose={onClose} title={task?'Edit Task':'Add Task'}>
        <Box>
            <Stack>
                    {/* <Title order={2} fw={600} >Add Task</Title>
                    <Button><X size={16}/></Button> */}
                <Group>
                    <Group>
                        <TextInput label="Task Name" />
                    </Group>
                    <Group>
                        <DateInput value={date} onChange={setDate} label="Deadline" placeholder="Date Input"/>
                    </Group>
                    
                    <Select label="Priority"
                      value={priority}
                      onChange={setPriority}
                      data={['low', 'medium', 'high', 'urgent']}
                    />
                    <Group>
                    <Checkbox checked={recurring} onChange={(e) => setRecurring(e.currentTarget.checked)} label="Recurring"/>
                    <Select label="Frequency"
                      value={frequency}
                      onChange={setFrequency}
                      data={['daily', 'weekly', 'monthly', 'custom']}
                    />

                    </Group>
                    <Group>
                        <Button onClick={handleSave}>Add</Button>
                        <Button>Cancel</Button>

                    </Group>
                </Group>
            </Stack>
        </Box>
        </Modal>
   );
}