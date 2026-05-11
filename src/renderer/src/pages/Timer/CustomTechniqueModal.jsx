import { Box ,Center, Checkbox, Stack, Title,Text,TextInput, Modal, Group, Select, Button, NumberInput, SegmentedControl} from '@mantine/core'
import { useEffect, useState } from 'react'

export default function CustomTechniqueModal({opened, onSave, onClose, technique}){
    const [techniqueName, setTechniqueName] = useState('untitled')
    const [techniqueError, setTechniqueError] = useState('')
    const [work, setWork] = useState(0)
    const [shortBreak, setShortBreak] = useState(0)
    const [longBreak, setLongBreak] = useState(0)
    const [cycles, setCycles] = useState(0)

    function handleSave(){
        if(!techniqueName.trim()){
            setTechniqueError('Technique Name cannot be empty')
            return
        }
        setTechniqueError('')
        onSave(techniqueName, work, shortBreak, longBreak, cycles)
        onClose()
    }

    return (
        <Modal 
            size={"100%"}
            opened={opened} onClose={onClose} 
            title="New Technique"
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
                <TextInput withAsterisk label="Technique Name" value={techniqueName} error={techniqueError} onChange={(e) => setTechniqueName(e.target.value) } />  
                <NumberInput label="Work" min={1} max={180}  value={work} onChange={setWork} />
                <NumberInput label="Short Break" min={1} max={180} value={shortBreak} onChange={setShortBreak} />
                <NumberInput label="Long Break" min={1} max={180} value={longBreak} onChange={setLongBreak} />
                <Group justify='center'>
                        <Button color='pink'  onClick={handleSave}>Save</Button>
                        <Button color='pink' onClick={onClose} >Cancel</Button>
                </Group>
            </Stack>
        </Box>
        </Modal>
    )
}