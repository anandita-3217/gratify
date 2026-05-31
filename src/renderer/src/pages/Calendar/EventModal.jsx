import { Box ,Center, Checkbox, Stack, Title,Text,TextInput, Modal, Group, Select, Button, NumberInput, SegmentedControl, Textarea, ColorSwatch} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useEffect, useState } from 'react'
// title — TextInput
// description — Textarea
// start — DateTimePicker
// end — DateTimePicker
// allDay — Checkbox (hides time when checked)
// color — ColorSwatch picker, same as NoteModal
// recurring — Checkbox
// frequency — Select (daily/weekly/monthly)
const colors = ['orange', 'red', 'pink', 'grape', 
      'violet', 'indigo', 'blue', 'cyan', 
      'teal', 'green', 'lime', 'yellow']

export default function EventModal({opened, event, onSave, onClose, defaultStart, defaultEnd } ){
    const [title, setTitle] = useState('Untitled')
    const [description, setDescription] = useState('')
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [allDay, setAllDay] = useState(false)
    const [recurring, setRecurring] = useState(false)
    const [frequency, setFrequency] = useState()
    const [color, setColor] = useState('pink')

    const [titleError, setTitleError] = useState('')
    const [startError, setStartError] = useState('')
    const [endError, setEndError] = useState('')

    useEffect(() => {
        if(event){
            setTitle(event.title)
            setDescription(event.description)
            setStart(event.start)
            setEnd(event.end)
            setAllDay(event.allDay)
            setFrequency(event.frequency)
            setColor(event.color)
        }
        else{
            setTitle('Untitled')
            setDescription('')
            setStart(defaultStart ?? null)
            setEnd(defaultEnd ?? null)
            setAllDay(false)
            setFrequency(null)
            setColor('pink')
            
        }
    },[event, opened])


    function handleSave(){
        if(!title.trim()){
            setTitleError('Title cannot be empty')
            return
        }
        if(!start){
            setStartError('Start Time cannot be empty')
            return
        }
        if(!end){
            setEndError('End Time cannot be empty')
            return
        }
        setTitleError('')
        onSave({ title, description, start, end, allDay, frequency, color })
        onClose()
    }


    return(
        <Modal size='100%' opened={opened} onClose={onClose} 
        title={event ? 'Edit event' : 'New event'}
        centered
        styles={{
            title: { color: '#cc225c', fontSize: '25px', fontWeight: 600, textAlign: 'center', width: '100%' },
            header: { justifyContent: 'center' },
            content: { border: '2px solid #cc225c', borderRadius: '15px' }
        }}>
        
            <Stack gap='md'>
                <TextInput withAsterisk label="Title" aria-label='title'
                 value={title} onChange={(e) => setTitle(e.target.value)}  error={titleError}/>

                <Textarea label="Description" aria-label='description'
                value={description} onChange={(e) => setDescription(e.target.value)}/>
                <Checkbox aria-label='all-day' label="All Day" checked={allDay} onChange={(e) => setAllDay(e.currentTarget.checked)}/>
                <Group grow align='flex-end'>
                    <DateTimePicker label="Start" aria-label='start' withAsterisk  value={start} onChange={setStart} error={startError} />
                    <DateTimePicker label="End" aria-label='end' withAsterisk  value={end} onChange={setEnd} error={endError} disabled={allDay}/>
                </Group>
                <Checkbox aria-label='recurring' label='Recurring' checked={recurring} onChange={(e) => setRecurring(e.currentTarget.checked)} />
                {recurring && (
                    <Select
                    aria-label='frequency'
                    label="Frequency"
                    value={frequency}
                    onChange={setFrequency}
                    data={[
                        {label: 'Daily', value: 'daily'}, 
                        {label: 'Weekly', value: 'weekly'}, 
                        {label: 'Monthly', value: 'monthly'}, 
                    ]}/>
                )}
                <Group gap='xs'>
                    {colors.map(c=>(
                        <ColorSwatch
                        key={c}
                        color={`var(--mantine-color-${c}-5)`}
                        size={24}
                        style={{ cursor: 'pointer', outline: color == c ? '2px solid white' : 'none'}}
                        onClick={() => setColor(c)}
                        />
                    ))}
                </Group>
                <Group justify='center'>
                    <Button onClick={handleSave} >{event ? 'Save' : 'Add'}</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </Group>
            </Stack>
            
        </Modal>
    )
} 