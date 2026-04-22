import { Box ,Center, Checkbox, Stack, Title,Text,TextInput, Modal, Group, Select, Button, NumberInput, SegmentedControl} from '@mantine/core'
import{ DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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



export default function TaskModal({opened, onSave, onClose, task}){

    const [text, setText] = useState('');
    const [priority, setPriority] = useState();
    const [date, setDate] = useState();
    const [recurring, setRecurring] = useState(false);
    const [frequency, setFrequency] = useState();
    const [reminder, setReminder] = useState(null)
    const [reminderType, setReminderType] = useState('preset') // preset or custom
    const [customReminderAmount,setCustomReminderAmount ] = useState(15)
    const [customReminderUnit,setCustomReminderUnit ] = useState('minutes')



    const [textError, setTextError] = useState('');
    const [priorityError, setPriorityError] = useState('');
    
    const [customInterval, setCustomInterval] = useState(1);
    const [customUnit, setCustomUnit] = useState('days');
    

    useEffect(()=>{
        if(task){
            setText(task.text)
            setPriority(task.priority)
            setDate(task.deadline ? new Date(task.deadline): null)
            setRecurring(task.recurring)
            setFrequency(task.frequency)
            setReminder(task.reminder ?? null)
            setCustomInterval(task.customInterval ?? 1)
            setCustomUnit(task.customUnit ?? 'days')
        }
        else{
            setText('')
            setPriority('low')
            setDate(null)
            setRecurring(false)
            setFrequency(null)
            setReminder(null)
            setReminderType('preset')
            setCustomReminderAmount(15)
            setCustomReminderUnit('minutes')
            setCustomInterval(1)
            setCustomUnit('days')
        }
    },[task,opened])

    function handleSave(){
        if(!text.trim()) {
            setTextError('Task cannot be empty')    
            return
        }
        if(!priority){
            setPriorityError('Choose priority')
            return
        }

        let finalReminder = null
        if (date && reminder) {
            if (reminderType === 'preset'){
                finalReminder = reminder
            } else {
                const multipliers = {minutes: 1, hours: 60, days: 1440}
                finalReminder = String(customReminderAmount * multipliers[customReminderUnit])
            }
        }
        setTextError('')
        setPriorityError('')
        onSave({text,priority,deadline: date, recurring, frequency, 
            reminder: finalReminder,
            customInterval: frequency === 'custom' ? customInterval : null,
            customUnit: frequency === 'custom' ? customUnit : null
        })
        onClose()
    }
        return (
        <Modal 
            size={"100%"}
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
                    {date && (
                        <Stack gap={"xs"}>
                            <Text size="sm" fw={500}>Reminder</Text>
                            <SegmentedControl value={reminderType} onChange={setReminderType}
                                data={[
                                    { label: 'Preset', value: 'preset' },
                                    { label: 'Custom', value: 'custom' }
                                ]} color='pink' size='xs'/>
                                {reminderType === 'preset' ? (
                                    <Select
                                        label="Remind me"
                                        value={reminder}
                                        onChange={setReminder}
                                        placeholder='No reminder'
                                        data={[
                                            { label: '15 minutes before', value: '15' },
                                            { label: '30 minutes before', value: '30' },
                                            { label: '1 hour before', value: '60' },
                                            { label: '3 hours before', value: '180' },
                                            { label: '1 day before', value: '1440' }
                                        ]}
                                        clearable/>

                                ):(
                                    <Group grow>
                                        <NumberInput label="Amount" value={customReminderAmount} onChange={setCustomReminderAmount} min={1}/>
                                        <Select label="Unit" value={customReminderUnit} onChange={setCustomReminderUnit} 
                                            data={['minutes','hours','days']}/>
                                    </Group>
                                )

                                }
                        </Stack>
                    )}
                    <Select withAsterisk
                        label="Priority"
                        value={priority}
                        onChange={setPriority}
                        data={['low', 'medium', 'high', 'urgent']}
                        renderOption={PriorityOption}
                        error={priorityError}

                    />
                </Group>
                    
                <Checkbox color='pink' checked={recurring} onChange={(e) => setRecurring(e.currentTarget.checked)} label="Recurring"/>
                 {recurring && (
                    <Select label="Frequency"  value={frequency}  onChange={setFrequency}  data={['daily', 'weekly', 'monthly', 'custom']}/>
                )}   
                {frequency === 'custom' && (
                    <Group grow>
                        <NumberInput label="Every" value={customInterval} onChange={setCustomInterval} min={1}/>
                        <Select label="Unit" value={customUnit} onChange={setCustomUnit} data={['days','weeks','months']}/>
                    </Group>
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