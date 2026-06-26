import {
  Stack,
  Text,
  Switch,
  ColorSwatch,
  Group,
  Divider,
  useMantineColorScheme,
  useComputedColorScheme
} from '@mantine/core'
import { Sun, Moon } from 'lucide-react'
import { useEffect } from 'react'
import useSettings  from '../../hooks/useSettings'
const colors = [
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange'
]

export default function AppearanceSection() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')
  const isDark = computedColorScheme === 'dark'
  const { accentColor: accent, setAccentColor: setAccent } = useSettings()

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault()
        setColorScheme(isDark ? 'light' : 'dark')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isDark, setColorScheme])

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Theme</Text>
        <Text size="xs" c="dimmed">
          Switch between light and dark mode
        </Text>
        <Switch
          p={8}
          size="sm"
          checked={isDark}
          onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
          thumbIcon={isDark ? <Moon size={12} color="blue" /> : <Sun size={12} color="red" />}
        />
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Accent Color</Text>
        <Text size="xs" c="dimmed">
          Choose your primary accent
        </Text>
        <Group gap="xs">
          {colors.map((c) => (
            <ColorSwatch
              withShadow
              key={c}
              color={`var(--mantine-color-${c}-5)`}
              size={24}
              style={{
                cursor: 'pointer',
                outline: accent == c ? '2px solid var(--mantine-color-dimmed)' : 'none'
              }}
              onClick={() => setAccent(c)}
            />
          ))}
        </Group>
      </Stack>
    </Stack>
  )
}
