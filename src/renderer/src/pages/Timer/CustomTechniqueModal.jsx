// import { Box ,Center, Checkbox, Stack, Title,Text,TextInput, Modal, Group, Select, Button, NumberInput, SegmentedControl} from '@mantine/core'
// import { useEffect, useState } from 'react'
// // TODO: Saves but the technique doesnt appear in the segmented control
// export default function CustomTechniqueModal({opened, onSave, onClose, onEdit, technique, editingTechnique, editingKey }){
//     const [techniqueName, setTechniqueName] = useState('untitled')
//     const [techniqueError, setTechniqueError] = useState('')
//     const [work, setWork] = useState(20)
//     const [shortBreak, setShortBreak] = useState(5)
//     const [hasLongBreak, setHasLongBreak] =useState(true)
//     const [longBreak, setLongBreak] = useState(15)
//     const [cycles, setCycles] = useState(4)

//   function handleSave(){
//     if(!techniqueName.trim()){
//       setTechniqueError('Technique name cannot be empty')
//       return
//     }
//     setTechniqueError('')
//     if(editingKey) {
//       onEdit(editingKey, {
//         name: techniqueName,
//         work,
//         shortBreak,
//         longBreak: hasLongBreak ? longBreak : null,
//         cyclesBeforeLongBreak : hasLongBreak ? cycles : null
//       })
//     }
//     else{
//       onSave(techniqueName, work, shortBreak, hasLongBreak ? longBreak : null, hasLongBreak ? cycles : null)
//     }
//     onClose()
//   }

//   useEffect(() => {
//     if(editingTechnique) {
//       setTechniqueName(editingTechnique.name)
//       setWork(editingTechnique.work)
//       setShortBreak(editingTechnique.shortBreak)
//       setHasLongBreak(!!editingTechnique.longBreak)
//       setLongBreak(editingTechnique.longBreak ?? 15)
//       setCycles(editingTechnique.cyclesBeforeLongBreak ?? 4)
//     }
//     else{
//       setTechniqueName('untitled')
//       setWork(20)
//       setShortBreak(5)
//       setHasLongBreak(true)
//       setLongBreak(15)
//       setCycles(4)
//     }
//   },[opened])
//     return (
//         <Modal 
//             size="md"
//             opened={opened} onClose={onClose} 
//             title="New Technique"
//             centered
//             styles={{                
//                 title: { color: '#c2255c', fontSize:'25px' ,fontWeight: 600, textAlign: 'center', width: '100%' },
//                 header: { justifyContent: 'center' },
//                 content: { border: '2px solid #c2255c',
//                             borderRadius: '15px'
//                         },
//             }}>
//         <Box>
//             <Stack gap={'md'}>
//                 <TextInput withAsterisk label="Technique Name" value={techniqueName} error={techniqueError} onChange={(e) => setTechniqueName(e.target.value) } />  
//                 <NumberInput label="Work" min={1} max={180}  value={work} onChange={setWork} />
//                 <NumberInput label="Short Break" min={1} max={180} value={shortBreak} onChange={setShortBreak} />
//                 <Checkbox 
//   label="Has long break" 
//   checked={hasLongBreak} 
//   onChange={(e) => setHasLongBreak(e.currentTarget.checked)} 
// />
// {hasLongBreak && (
//   <>
//     <NumberInput label="Long Break" value={longBreak} onChange={setLongBreak} min={1} max={60} />
//     <NumberInput label="Cycles before long break" value={cycles} onChange={setCycles} min={1} max={10} />
//   </>
// )}
// {/* TODO: change the name to sessions add sessiion name as many sessions as the user wants */}
//                 <Group justify='center'>
//                         <Button color='pink'  onClick={handleSave}>Save</Button>
//                         <Button color='pink' onClick={onClose} >Cancel</Button>
//                 </Group>
//             </Stack>
//         </Box>
//         </Modal>
//     )
// }
// User defines:
//   - technique name
//   - number of phases (add/remove dynamically)
//   - each phase: name, duration in minutes
//   - cycles before repeating (optional)

import { Modal, Stack, TextInput, NumberInput, Button, Group, ActionIcon, Text, Divider } from '@mantine/core'
import { Plus, Trash } from 'lucide-react'
import { useState, useEffect } from 'react'

// default phase shape
const newPhase = () => ({ name: 'Work', duration: 25 })

export default function CustomTechniqueModal({ opened, onClose, onSave, editingTechnique, editingKey, onEdit }) {

  const [techniqueName, setTechniqueName] = useState('Untitled')
  const [techniqueError, setTechniqueError] = useState('')
  
  // phases is an array of { name, duration }
  const [phases, setPhases] = useState([
    { name: 'Work', duration: 25 },
    { name: 'Short Break', duration: 5 },
  ])

  useEffect(() => {
    if (editingTechnique) {
      // prefill from existing technique
      setTechniqueName(editingTechnique.name)
      setPhases(editingTechnique.phases)
      // hint: editingTechnique.phases is the array
    } else {
      // reset to defaults
      setTechniqueName('Untitled')
      setPhases([
        { name: 'Work', duration: 25 },
        { name: 'Short Break', duration: 5 },
      ])
    }
  }, [opened])

  function addPhase() {
    // add a new phase with default values to phases array
    setPhases(prev => [...prev, {name: 'New Phase', duration: 25}])
  }

  function removePhase(index) {
    if (phases.length <= 1) return
    setPhases(prev => prev.filter((_, i) => i !== index))
    // filter out phase at index
    // don't allow less than 1 phase
  }

  function updatePhase(index, field, value) {
    // map over phases, update matching index
    // hint: same pattern as updateTask
    setPhases(prev => prev.map((p, i) => i === index ? {...p,[field]: value} : p))
  }

  function handleSave() {
    // validate technique name
    if (!techniqueName.trim()) {
      setTechniqueError('Technique name cannot be empty')
      return
    }
    // validate at least one phase
    if (phases.length < 1) return
    setTechniqueError('There must be atleast one phase')
    // build technique object from phases
    if (editingKey){
      onEdit(editingKey, {name: techniqueName, phases})
    }
    else{
      onSave(techniqueName, phases, null)
    }
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingTechnique ? 'Edit Technique' : 'New Technique'}
      centered
      size="md"
      styles={{
        title: { color: '#c2255c', fontSize: '20px', fontWeight: 600, textAlign: 'center', width: '100%' },
        header: { justifyContent: 'center' },
        content: { border: '2px solid #c2255c', borderRadius: '15px' }
      }}
    >
      <Stack gap="md">

        {/* technique name */}
        <TextInput
          withAsterisk
          label="Technique Name"
          value={techniqueName}
          onChange={(e) => setTechniqueName(e.target.value)}
          error={techniqueError}
        />

        <Divider label="Phases" labelPosition="center" />

        {/* phase list */}
        {phases.map((phase, index) => (
          <Group key={index} gap="xs" align="flex-end">
            {/* phase name input */}
            <TextInput label={index === 0 ? 'Phase Name' : undefined}
            value={phase.name}
            onChange={(e) => updatePhase(index, 'name', e.target.value)}
            style={{ flex: 1 }}/>
            {/* phase duration input */}
            <NumberInput label={index === 0 ? 'Minutes': undefined}
            value={phase.duration}
            onChange={(val) => updatePhase(index, 'duration', val)}
            min={1}
            max={180}
            w={80}/>
            {/* delete button — disabled if only 1 phase left */}
            <ActionIcon
            variant='subtle'
            color='red'
            mb={4}
            disabled={phases.length <= 1}
            onClick={() => removePhase(index)}
            ><Trash size={14}/></ActionIcon>
          </Group>
        ))}

        {/* add phase button */}
        <Button
          variant="light"
          color="pink"
          leftSection={<Plus size={14} />}
          onClick={addPhase}
        >
          Add Phase
        </Button>

        {/* save + cancel */}
        <Group justify="center">
          <Button color="pink" onClick={handleSave}>
            {editingTechnique ? 'Save' : 'Add'}
          </Button>
          <Button color="pink" variant="subtle" onClick={onClose}>Cancel</Button>
        </Group>

      </Stack>
    </Modal>
  )
}