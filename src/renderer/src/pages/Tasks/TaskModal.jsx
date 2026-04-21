import {Box ,Center, Checkbox, Stack, Title,TextInput, Modal, Group, Select, Button} from '@mantine/core'
import{DateInput} from '@mantine/dates';
import '@mantine/dates/styles.css'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({opened, onSave, onClose, task}){

    const [text, setText] = useState('');
    const [priority, setPriority] = useState();
    const [date, setDate] = useState();
    const [recurring, setRecurring] = useState(false);
    const [frequency, setFrequency] = useState();

    useEffect(() =>{
        if(!opened){
            setText('')
            setPriority('medium')
            setDate(null)
            setRecurring(false)
            setFrequency(null)
        }
    },[opened])

    function handleSave(){
        onSave({text,priority,deadline: date, recurring, frequency})
        onClose()
    }

    return (
        <Modal 
            size={'sm'} opened={opened} onClose={onClose} 
            title={task?'Edit Task':'Add Task'}
            centered
            styles={{
                
                title: { color: '#c2255c', fontWeight: 600 },
                content: { border: '1px solid #c2255c' },
            }}
>
        <Box>
            <Stack>
                <Group>
                    <Group>
                        <TextInput  withAsterisk label="Task Name" value={text} onChange={(e) => setText(e.target.value)} />
                    </Group>
                    <Group>
                        <DateInput value={date} onChange={setDate} label="Deadline" placeholder="Deadline" minDate={new Date()}/>
                    </Group>
                    
                    <Select label="Priority"
                      value={priority}
                      onChange={setPriority}
                      data={['low', 'medium', 'high', 'urgent']}
                    />
                    <Group>
                    <Checkbox color='pink' checked={recurring} onChange={(e) => setRecurring(e.currentTarget.checked)} label="Recurring"/>
                    <Select label="Frequency"
                      value={frequency}
                      onChange={setFrequency}
                      data={['daily', 'weekly', 'monthly', 'custom']}
                    />

                    </Group>
                    <Group styles={{alignItems: 'center'}}>
                        <Button color='pink'  onClick={handleSave}>Add</Button>
                        <Button color='pink' >Cancel</Button>

                    </Group>
                </Group>
            </Stack>
        </Box>
        </Modal>

    )
}