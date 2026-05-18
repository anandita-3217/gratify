// import { Group, Select, Button, Text, Stack } from '@mantine/core'
// import { Plus } from 'lucide-react'

// export default function TechniquePicker({ technique, setTechnique, TECHNIQUES, isRunning, onNewTechnique }) {
//   const options = Object.entries(TECHNIQUES).map(([key, val]) => ({
//     value: key,
//     label: val.name,
//   }))

//   const current = TECHNIQUES[technique]
  

//   return (
//     <Group gap='xs' align='flex-start' justify='center'>
//       {/* <div style={{ flex: 1 }}> */}
//       <Stack gap={4}>
//         <Group size='xs'>
//         <Select
//           w={300}
//           value={technique}
//           onChange={setTechnique}
//           data={options}
//           disabled={isRunning}
//           allowDeselect={false}
//           styles={{
//             input: {
//               borderColor: 'var(--mantine-color-pink-8)',
//               fontSize: '0.85rem',
//             },
//           }}
//         />
//       <Button
//         variant='subtle'
//         color='pink'
//         size='sm'
        
//         onClick={onNewTechnique}
//         disabled={isRunning}
//         px='xs'
//       >
//         <Plus size={14} />
//       </Button>
//       </Group>
//         {current && (
//           <Text size='xs' c='dimmed' mt={4}>
//             {current.work}m work
//             {current.shortBreak ? ` · ${current.shortBreak}m break` : ''}
//             {current.cyclesBeforeLongBreak ? ` · ${current.cyclesBeforeLongBreak} cycles` : ''}
//           </Text>
//         )}
//       {/* </div> */}

//       </Stack>
//     </Group>
//   )
// }

import { Group, Select, Button, Text, ActionIcon } from '@mantine/core'
import { Plus, Pencil, Trash } from 'lucide-react'

export default function TechniquePicker({ technique, setTechnique, TECHNIQUES, BUILT_IN_TECHNIQUES, isRunning, onNewTechnique, onDelete, onEdit }) {
  const options = Object.entries(TECHNIQUES).map(([key, val]) => ({
    value: key,
    label: val.name,
  }))

  const current = TECHNIQUES[technique]
  const isUserCreated = !BUILT_IN_TECHNIQUES[technique]

  return (
    <Group gap='xs' align='flex-start' justify='center'>
      <Stack gap={4}>
        <Group gap='xs'>
          <Select
            w={200}
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
          {/* edit + delete only for user created */}
          {isUserCreated && (
            <>
              <ActionIcon
                variant='subtle'
                color='pink'
                size='sm'
                disabled={isRunning}
                onClick={() => onEdit(technique)}
              >
                <Pencil size={14} />
              </ActionIcon>
              <ActionIcon
                variant='subtle'
                color='red'
                size='sm'
                disabled={isRunning}
                onClick={() => onDelete(technique)}
              >
                <Trash size={14} />
              </ActionIcon>
            </>
          )}
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
        {current && (
          <Text size='xs' c='dimmed'>
            {current.work}m work
            {current.shortBreak ? ` · ${current.shortBreak}m break` : ''}
            {current.cyclesBeforeLongBreak ? ` · ${current.cyclesBeforeLongBreak} cycles` : ''}
          </Text>
        )}
      </Stack>
    </Group>
  )
}