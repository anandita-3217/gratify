import { Box, Divider, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import AboutCard from './AboutCard'
// import TeamSection from './TeamSection'
import Dev from '../../assets/dev_svg.svg'

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
          <Title
            order={2}
            fw={600}
            style={{ color: `var(--mantine-color-${theme.primaryColor}-5)` }}
          >
            About
          </Title>
        </Group>
        <Text c="dimmed" size="sm">
          {' '}
          About the app
        </Text>
        <Divider color={theme.primaryColor} />
      </Stack>
      <Stack>
        <Box justify="center">
          <Stack align="center" justify="center">
            <Box>
              <Title
                order={3}
                fw={600}
                style={{ color: `var(--mantine-color-${theme.primaryColor}-8)` }}
              >
                {' '}
                Meet the team
              </Title>
            </Box>
            <AboutCard
              thumbnail={Dev}
              name={'Alka'}
              position={'Lead dev'}
              socials={socials}
              nickname={'panda'}
              description={
                'Hi I am redacted I am the lead dev (P.S.: Only dev) lead designer everything of this Project. My family helped test it (AKA: Tear everything down) so hopefully it should break. I built this as a personal productivity app because I have a hard time getting things done. If you find this useful and helpful drop me a star and if you have any issues open an issue and i will look into it, suggestions are welcome too.'
              }
            />
            {/* <TeamSection /> */}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
