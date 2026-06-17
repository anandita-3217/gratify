import { Stack, Text, Switch, ColorSwatch, Group, Divider } from '@mantine/core'
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core'

export default function AppearanceSection() {
  // theme toggle — same pattern as Sidebar ThemeToggle
  // accent color — useLocalStorage('accentColor', 'pink')
  // accent colors to pick from: pink, violet, blue, teal, orange

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text fw={600}>Theme</Text>
        <Text size="xs" c="dimmed">
          Switch between light and dark mode
        </Text>
        {/* Switch — same as ThemeToggle in Sidebar */}
      </Stack>

      <Divider />

      <Stack gap="xs">
        <Text fw={600}>Accent Color</Text>
        <Text size="xs" c="dimmed">
          Choose your primary color
        </Text>
        {/* ColorSwatch row — on click saves to localStorage and updates MantineProvider primaryColor */}
      </Stack>
    </Stack>
  )
}
