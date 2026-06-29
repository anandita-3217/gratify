import { Box, Divider, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import AboutCard from './AboutCard'
import TeamSection from './TeamSection'
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
            {/* <AboutCard
              thumbnail={Dev}
              name={'Alka'}
              position={'Lead dev'}
              socials={socials}
              nickname={'panda'}
              description={
                'Hi I am redacted I am the lead dev (P.S.: Only dev) lead designer everything of this Project. My family helped test it (AKA: Tear everything down) so hopefully it should break. I built this as a personal productivity app because I have a hard time getting things done. If you find this useful and helpful drop me a star and if you have any issues open an issue and i will look into it, suggestions are welcome too.'
              }
            /> */}
            <TeamSection />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
// export default function About() {
//   const theme = useMantineTheme()
//   return (
//     <Box p="xl" style={{ height: '100%', overflow: 'auto' }}>
//       <Stack gap={2} mb="sm">
//         <Group gap={4} justify="space-between">
//           <Title order={2} fw={600} style={{ color: `var(--mantine-color-${theme.primaryColor}-5)` }}>
//             About
//           </Title>
//         </Group>
//         <Text c="dimmed" size="sm">About the app</Text>
//         <Divider color={theme.primaryColor} />
//       </Stack>

//       <Stack gap="xl">

//         {/* ── About the app ── */}
//         <Stack gap="sm">
//           <Title order={4} fw={600}>What is Gratify?</Title>
//           <Text size="sm" c="dimmed">
//             Gratify is a local-first productivity app built for people who want
//             to stay focused, organised and on top of their work — without
//             sacrificing their data to the cloud.
//           </Text>
//           <Text size="sm" c="dimmed">
//             Everything lives on your machine. No accounts, no sync, no tracking.
//             Just you and your work.
//           </Text>
//         </Stack>

//         <Divider />

//         {/* ── Features ── */}
//         <Stack gap="xs">
//           <Title order={4} fw={600}>Features</Title>
//           {[
//             '📝 Tasks — quick-add with natural language parsing',
//             '📓 Notes — rich text editor with tags and colours',
//             '⏱ Timer — basic countdown and focus techniques (Pomodoro, 52/17, custom)',
//             '📅 Calendar — day, week and month views with task deadline sync',
//             '⚙️ Settings — accent colour, theme, default priority and more',
//           ].map((f, i) => (
//             <Text key={i} size="sm" c="dimmed">{f}</Text>
//           ))}
//         </Stack>

//         <Divider />

//         {/* ── Version ── */}
//         <Stack gap={2}>
//           <Title order={4} fw={600}>Version</Title>
//           <Text size="sm" c="dimmed">Gratify v1.0.0</Text>
//           <Text size="sm" c="dimmed">Built with Electron, React, Mantine and TipTap</Text>
//         </Stack>

//         <Divider />

//         {/* ── Meet the team ── */}
//         <Stack gap="md">
//           <Title order={4} fw={600}>Meet the team</Title>
//           <AboutCard
//             thumbnail={Dev}
//             name="Alka"
//             position="Lead dev"
//             socials={socials}
//             nickname="panda"
//             description="lorem ipsum"
//           />
//         </Stack>

//       </Stack>
//     </Box>
//   )
// }
