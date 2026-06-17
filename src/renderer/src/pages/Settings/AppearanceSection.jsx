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
import { useState, useEffect } from 'react'
const colors = [
  'orange',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow'
]

export default function AppearanceSection() {
  // theme toggle — same pattern as Sidebar ThemeToggle
  // accent accent — useLocalStorage('accentaccent', 'pink')
  // accent accents to pick from: pink, violet, blue, teal, orange
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')
  const isDark = computedColorScheme === 'dark'
  const [accent, setAccent] = useState('pink')

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
        {/* Switch — same as ThemeToggle in Sidebar */}
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
              key={c}
              color={`var(--mantine-color-${c}-5)`}
              size={24}
              style={{ cursor: 'pointer', outline: accent == c ? '2px solid white' : 'none' }}
              onClick={() => setAccent(c)}
            />
          ))}
        </Group>
      </Stack>
    </Stack>
  )
}
