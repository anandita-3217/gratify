import { Box, Divider, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import AboutCard from './AboutCard'
import Dawn from '../../assets/Dawn.png'

// Data shape — pass this as the `socials` prop
const socials = [
  { label: 'GitHub', url: 'https://github.com/username' },
  { label: 'Mail', url: 'mailto:ananditad21@gmail.com?subject=Hello&body=Hi there!' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/username' }
]

export default function About() {
  const theme = useMantineTheme()
  return (
    <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={2} mb="sm">
        <Group gap={4} justify="space-between">
          <Title order={2} fw={600}>
            About
          </Title>
        </Group>
        <Text c="dimmed" size="sm">
          {' '}
          Meet the team!
        </Text>
        <Divider color={theme.primaryColor} />
      </Stack>
      <Box justify="center">
        <Stack align="center">
          <AboutCard
            thumbnail={Dawn}
            name={'Alka'}
            position={'Lead dev'}
            socials={socials}
            nickname={'panda'}
            description={
              'Hi I am redacted I am the lead dev (P.S.: Only dev) of this Project. I built this as a personal productivity app because I have a hard time getting things done. If you find this useful and helpful drop me a star and if you have any issues open an issue and i will look into it, suggestions are welcome too.'
            }
          />
        </Stack>
      </Box>
    </Box>
  )
}
