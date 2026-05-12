import { Box ,Center, Checkbox, Stack, Title,Text,TextInput, Modal, Group, Select, Button, NumberInput, SegmentedControl} from '@mantine/core'
import { useEffect, useState } from 'react'

export default function CustomTechniqueModal({opened, onSave, onClose, technique}){
    const [techniqueName, setTechniqueName] = useState('untitled')
    const [techniqueError, setTechniqueError] = useState('')
    const [work, setWork] = useState(20)
    const [shortBreak, setShortBreak] = useState(5)
    const [hasLongBreak, setHasLongBreak] =useState(true)
    const [longBreak, setLongBreak] = useState(15)
    const [cycles, setCycles] = useState(4)

    function handleSave(){
        if(!techniqueName.trim()){
            setTechniqueError('Technique Name cannot be empty')
            return
        }
        setTechniqueError('')
        onSave(
  techniqueName, 
  work, 
  shortBreak, 
  hasLongBreak ? longBreak : null,
  hasLongBreak ? cycles : null
)
        console.log('Works')
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
                <Checkbox 
  label="Has long break" 
  checked={hasLongBreak} 
  onChange={(e) => setHasLongBreak(e.currentTarget.checked)} 
/>
{hasLongBreak && (
  <>
    <NumberInput label="Long Break" value={longBreak} onChange={setLongBreak} min={1} max={60} />
    <NumberInput label="Cycles before long break" value={cycles} onChange={setCycles} min={1} max={10} />
  </>
)}
{/* TODO: change the name to sessions add sessiion name as many sessions as the user wants */}
                <Group justify='center'>
                        <Button color='pink'  onClick={handleSave}>Save</Button>
                        <Button color='pink' onClick={onClose} >Cancel</Button>
                </Group>
            </Stack>
        </Box>
        </Modal>
    )
}