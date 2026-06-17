import { ActionIcon, Group, Select, Stack, Text } from '@mantine/core'
import { Pencil, Plus, Trash } from 'lucide-react'
import PropTypes from 'prop-types'

export default function TechniquePicker({
  technique,
  setTechnique,
  TECHNIQUES,
  BUILT_IN_TECHNIQUES,
  isRunning,
  onNewTechnique,
  onDelete,
  onEdit
}) {
  const options = Object.entries(TECHNIQUES).map(([key, val]) => ({
    value: key,
    label: val.name
  }))

  const current = TECHNIQUES[technique]
  const isUserCreated = !BUILT_IN_TECHNIQUES[technique]

  return (
    <Group gap="xs" align="flex-start" justify="center">
      <Stack gap={4}>
        <Group gap="xs">
          <Select
            w={300}
            value={technique}
            onChange={setTechnique}
            data={options}
            disabled={isRunning}
            allowDeselect={false}
            styles={{
              input: {
                borderColor: 'var(--mantine-color-pink-8)',
                fontSize: '0.85rem'
              }
            }}
          />
          {isUserCreated && (
            <>
              <ActionIcon
                variant="subtle"
                size="sm"
                disabled={isRunning}
                onClick={() => onEdit(technique)}
              >
                <Pencil size={14} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="sm"
                disabled={isRunning}
                onClick={() => onDelete(technique)}
              >
                <Trash size={14} />
              </ActionIcon>
            </>
          )}
          <ActionIcon variant="subtle" size="md" disabled={isRunning} onClick={onNewTechnique}>
            <Plus size={16} />
          </ActionIcon>
        </Group>
        {current && (
          <Text size="xs" c="dimmed">
            {current.phases?.map((p) => `${p.name}: ${Math.floor(p.duration / 60)}m`).join('. ')}
          </Text>
        )}
      </Stack>
    </Group>
  )
}
TechniquePicker.propTypes = {
  // technique: PropTypes.shape
  technique: PropTypes.string,
  setTechnique: PropTypes.func,
  TECHNIQUES: PropTypes.array,
  BUILT_IN_TECHNIQUES: PropTypes.array,
  isRunning: PropTypes.bool,
  onNewTechnique: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
}
// TODO: more animation?
