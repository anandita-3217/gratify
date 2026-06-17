// User defines:
//   - technique name
//   - number of phases (add/remove dynamically)
//   - each phase: name, duration in minutes
//   - cycles before repeating (optional)

import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Button,
  Group,
  ActionIcon,
  Divider,
  Checkbox
} from '@mantine/core'
import { Plus, Trash } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

// default phase shape

export default function CustomTechniqueModal({
  opened,
  onClose,
  onSave,
  editingTechnique,
  editingKey,
  onEdit
}) {
  const [techniqueName, setTechniqueName] = useState('Untitled')
  const [hasCycles, setHasCycles] = useState(false)
  const [cycles, setCycles] = useState(null)
  const [techniqueError, setTechniqueError] = useState('')

  // phases is an array of { name, duration }
  const [phases, setPhases] = useState([
    { name: 'Work', minutes: 25, seconds: 0 },
    { name: 'Short Break', minutes: 5, seconds: 0 }
  ])

  useEffect(() => {
    if (editingTechnique) {
      // prefill from existing technique
      setTechniqueName(editingTechnique.name)
      setPhases(
        editingTechnique.phases.map((p) => ({
          name: p.name,
          minutes: Math.floor(p.duration / 60),
          seconds: p.duration % 60
        }))
      )
      setHasCycles(!!editingTechnique?.cyclesBeforeLongBreak)
      setCycles(editingTechnique?.cyclesBeforeLongBreak ?? 4)
    } else {
      // reset to defaults
      setTechniqueName('Untitled')
      setPhases([
        { name: 'Work', minutes: 25, seconds: 0 },
        { name: 'Short Break', minutes: 5, seconds: 0 }
      ])
      setHasCycles(false)
      setCycles(4)
    }
  }, [opened])

  function addPhase() {
    // add a new phase with default values to phases array
    setPhases((prev) => [...prev, { name: 'New Phase', duration: 25 }])
  }

  function removePhase(index) {
    if (phases.length <= 1) return
    setPhases((prev) => prev.filter((_, i) => i !== index))
    // filter out phase at index
    // don't allow less than 1 phase
  }

  function updatePhase(index, field, value) {
    // map over phases, update matching index
    // hint: same pattern as updateTask
    setPhases((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  function handleSave() {
    const cyclesBeforeLongBreak = hasCycles ? cycles : null
    // validate technique name
    if (!techniqueName.trim()) {
      setTechniqueError('Technique name cannot be empty')
      return
    }
    // validate at least one phase
    if (phases.length < 1) return
    setTechniqueError('')
    // build technique object from phases
    const processedPhases = phases.map((p) => ({
      name: p.name,
      duration: p.minutes * 60 + (p.seconds || 0)
    }))
    if (editingKey) {
      onEdit(editingKey, { name: techniqueName, phases: processedPhases, cyclesBeforeLongBreak })
    } else {
      onSave(techniqueName, processedPhases, cyclesBeforeLongBreak)
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
        title: {
          color: '#c2255c',
          fontSize: '20px',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%'
        },
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
            <TextInput
              label={index === 0 ? 'Phase Name' : undefined}
              value={phase.name}
              onChange={(e) => updatePhase(index, 'name', e.target.value)}
              style={{ flex: 1 }}
            />
            {/* phase duration input */}
            <NumberInput
              label={index === 0 ? 'Min' : undefined}
              value={phase.minutes}
              onChange={(val) => updatePhase(index, 'minutes', val)}
              min={0}
              max={180}
              w={80}
            />
            <NumberInput
              label={index === 0 ? 'Sec' : undefined}
              value={phase.seconds}
              onChange={(val) => updatePhase(index, 'seconds', val)}
              min={0}
              max={59}
              w={80}
            />
            {/* delete button — disabled if only 1 phase left */}
            <ActionIcon
              variant="subtle"
              color="red"
              mb={4}
              disabled={phases.length <= 1}
              onClick={() => removePhase(index)}
            >
              <Trash size={14} />
            </ActionIcon>
          </Group>
        ))}
        {/* add phase button */}
        <Button variant="light" leftSection={<Plus size={14} />} onClick={addPhase}>
          Add Phase
        </Button>
        <Divider label="Cycles" labelPosition="center" />

        <Checkbox
          label="Repeat with Cycles"
          checked={hasCycles}
          onChange={(e) => setHasCycles(e.currentTarget.checked)}
        />

        {hasCycles && (
          <NumberInput
            label="Cycles"
            description="How many phases before the sequence restarts"
            value={cycles}
            onChange={setCycles}
            min={1}
            max={20}
          />
        )}

        {/* save + cancel */}
        <Group justify="center">
          <Button onClick={handleSave}>{editingTechnique ? 'Save' : 'Add'}</Button>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

CustomTechniqueModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onEdit: PropTypes.func,
  editingKey: PropTypes.string,
  editingTechnique: PropTypes.string

}
