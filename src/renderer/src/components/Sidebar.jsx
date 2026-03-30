import { NavLink } from 'react-router-dom'
import { Stack, Text, Tooltip, UnstyledButton } from '@mantine/core'
import {
  IconLayoutDashboard,
  IconChecklist,
  IconCalendar,
  IconSettings,
} from '@tabler/icons-react'

const links = [
  { icon: IconLayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: IconChecklist,       label: 'Tasks',     to: '/tasks' },
  { icon: IconCalendar,        label: 'Calendar',  to: '/calendar' },
  { icon: IconSettings,        label: 'Settings',  to: '/settings' },
]

function NavItem({ icon: Icon, label, to }) {
  return (
    <Tooltip label={label} position="right" withArrow>
      <UnstyledButton
        component={NavLink}
        to={to}
        end
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 10,
          color: isActive ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dimmed)',
          background: isActive ? 'var(--mantine-color-blue-0)' : 'transparent',
        })}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

export default function Sidebar() {
  return (
    <Stack
      align="center"
      justify="space-between"
      style={{
        width: 64,
        height: '100vh',
        borderRight: '1px solid var(--mantine-color-default-border)',
        padding: '16px 0',
        flexShrink: 0,
      }}
    >
      {/* Logo / app icon */}
      <Stack align="center" gap="xs">
        <Text fw={700} size="lg" c="blue">G</Text>
        <Stack align="center" gap={4} mt="md">
          {links.slice(0, -1).map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </Stack>
      </Stack>

      {/* Settings pinned to bottom */}
      <NavItem {...links[links.length - 1]} />
    </Stack>
  )
}