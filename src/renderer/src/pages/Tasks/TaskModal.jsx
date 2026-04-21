import { Box ,Center, Checkbox, Stack, Title,TextInput, Modal, Group, Select, Button} from '@mantine/core'
import{ DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';


// TODO: priority colors as small circles next the values 
export default function TaskModal({opened, onSave, onClose, task}){

    const [text, setText] = useState('');
    const [textError, setTextError] = useState('');
    const [priority, setPriority] = useState();
    const [date, setDate] = useState();
    const [recurring, setRecurring] = useState(false);
    const [frequency, setFrequency] = useState();
    
    function PriorityOption({ option }){
    const colors = {
        low: '#0c8599',
        medium: '#099268',
        high: '#e03131',
        urgent: '#6741d9'
    }
    return (
    <Group gap="sm">
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: colors[option.value],
        flexShrink: 0
      }} />
      <span>{option.label}</span>
    </Group>
  )

}

    useEffect(()=>{
        if(task){
            setText(task.text)
            setPriority(task.priority)
            setDate(task.deadline ? new Date(task.deadline): null)
            setRecurring(task.recurring)
            setFrequency(task.frequency)
        }
        else{
            setText('')
            setPriority('low')
            setDate(null)
            setRecurring(false)
            setFrequency(null)

        }
    },[task,opened])

    function handleSave(){
        if(!text.trim()) {
            setTextError('Task cannot be empty')    
            return
        }
        setTextError('')
        onSave({text,priority,deadline: date, recurring, frequency})
        onClose()
    }
// TODO: input fields when active should be pink not blue
    return (
        <Modal 
            opened={opened} onClose={onClose} 
            title={task?'Edit Task':'Add Task'}
            centered
            styles={{                
                title: { color: '#c2255c', fontSize:'25px' ,fontWeight: 600, textAlign: 'center', width: '100%' },
                header: { justifyContent: 'center' },
                content: { border: '2px solid #c2255c',
                            borderRadius: '15px'
                        },
            }}>
        <Box>
            <Stack gap={'md'}>
                <TextInput withAsterisk label="Task Name" value={text} error={textError} onChange={(e) => setText(e.target.value) } />  
                <Group grow>
                    <DateTimePicker value={date} onChange={setDate} label="Deadline" placeholder="Deadline" minDate={new Date()}/>
                    <Select label="Priority"
                      value={priority}
                      onChange={setPriority}
                      data={['low', 'medium', 'high', 'urgent']}
                      renderOption={PriorityOption}

                    />
                </Group>
                    
                <Checkbox color='pink' checked={recurring} onChange={(e) => setRecurring(e.currentTarget.checked)} label="Recurring"/>
                 {recurring && (
                    <Select label="Frequency"  value={frequency}  onChange={setFrequency}  data={['daily', 'weekly', 'monthly', 'custom']}/>
                 )}   
                    <Group justify='center'>
                        <Button color='pink'  onClick={handleSave}>{task? 'Save' : 'Add'}</Button>
                        <Button color='pink' onClick={onClose} >Cancel</Button>
                    </Group>
            </Stack>
        </Box>
        </Modal>

    )
}