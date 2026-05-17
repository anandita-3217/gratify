import { Group, Select, Button, Text } from '@mantine/core'
import { Plus } from 'lucide-react'

export default function TechniquePicker({ technique, setTechnique, TECHNIQUES, isRunning, onNewTechnique }) {
  const options = Object.entries(TECHNIQUES).map(([key, val]) => ({
    value: key,
    label: val.name,
  }))

  const current = TECHNIQUES[technique]
  

  return (
    <Group gap='xs' align='flex-start' justify='center'>
      <div style={{ flex: 1 }}>
        <Select
          value={technique}
          onChange={setTechnique}
          data={options}
          disabled={isRunning}
          allowDeselect={false}
          styles={{
            input: {
              borderColor: 'var(--mantine-color-pink-8)',
              fontSize: '0.85rem',
            },
          }}
        />
        {current && (
          <Text size='xs' c='dimmed' mt={4}>
            {current.work}m work
            {current.shortBreak ? ` · ${current.shortBreak}m break` : ''}
            {current.cyclesBeforeLongBreak ? ` · ${current.cyclesBeforeLongBreak} cycles` : ''}
          </Text>
        )}
      </div>
      <Button
        variant='subtle'
        color='pink'
        size='sm'
        
        onClick={onNewTechnique}
        disabled={isRunning}
        px='xs'
      >
        <Plus size={14} />
      </Button>
    </Group>
  )
}