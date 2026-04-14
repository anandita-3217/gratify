import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core'
import {
  IconLayoutDashboard,
  IconClock,
  IconChecklist,
  IconNotes,
  IconCalendar,
  IconChartBar,
  IconSettings2,
} from '@tabler/icons-react'


// import {CheckSquare, LayoutDashboard,TextAlignJustify,} from 'lucide-react'



const NAV_LINKS = [
  { icon: IconLayoutDashboard, label: 'Dashboard',     to: '/' },
  { icon: IconClock,           label: 'Pomodoro',      to: '/pomodoro' },
  { icon: IconChecklist,       label: 'Tasks',         to: '/tasks' },
  { icon: IconNotes,           label: 'Notes',         to: '/notes' },
  { icon: IconCalendar,        label: 'Calendar',      to: '/calendar' },
  { icon: IconChartBar,        label: 'Stats',         to: '/stats' },
]

const BOTTOM_LINKS = [
  { icon: IconSettings2,       label: 'Settings',      to: '/settings' },
]

function NavItem({ icon: Icon, label, to, expanded }) {
  return (
    <Tooltip
    label={label}
    position="right"
    withArrow
      disabled={expanded}
      offset={8}
      >
      <UnstyledButton
        component={NavLink}
        to={to}
        end={to === '/'}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          textDecoration: 'none',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s ease, color 0.15s ease',
          color: isActive
          ? 'var(--mantine-color-blue-6)'
          : 'var(--mantine-color-dimmed)',
          background: isActive
          ? 'var(--mantine-color-blue-0)'
          : 'transparent',
        })}
        onMouseEnter={(e) => {
          if (!e.currentTarget.dataset.active) {
            e.currentTarget.style.background = 'var(--mantine-color-gray-0)'
          }
        }}
        onMouseLeave={(e) => {
          const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
        >
        <Box style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Icon size={20} stroke={1.5} />
        </Box>
        <Text
          size="sm"
          fw={500}
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          >
          {label}
        </Text>
      </UnstyledButton>
    </Tooltip>
  )
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Box
    onMouseEnter={() => setExpanded(true)}
    onMouseLeave={() => setExpanded(false)}
    style={{
      width: expanded ? 200 : 64,
      minWidth: expanded ? 200 : 64,
      height: '100vh',
      borderRight: '1px solid var(--mantine-color-default-border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 10px',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      flexShrink: 0,
      background: 'var(--mantine-color-body)',
      zIndex: 100,
    }}
    >
      {/* Logo */}
      <Stack gap={4}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px 16px',
            borderBottom: '1px solid var(--mantine-color-default-border)',
            marginBottom: 8,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
          >
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--mantine-color-blue-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            >
            <Text fw={700} size="sm" c="white" style={{ lineHeight: 1 }}>G</Text>
          </Box>
          <Text
            fw={700}
            size="sm"
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
            >
            Gratify
          </Text>
        </Box>

        {/* Main nav links */}
        <Stack gap={2}>
          {/* {NAV_LINKS.map((link) => (
            <NavItem key={link.to} {...link} expanded={expanded} />
            ))} */}
        </Stack>
      </Stack>

      {/* Bottom: Settings */}
      <Stack gap={2}>
      {BOTTOM_LINKS.map((link) => (
           <NavItem key={link.to} {...link} expanded={expanded} />
          ))} 
        
        <NavItem icon={<LayoutDashboard/> } label={"Dashboard"}/>
        <NavItem icon={<CheckSquare size={20} />} label={"Tasks"}/>
         <NavItem icon={<TextAlignJustify/> } label={"Notes"}/>
        <NavItem icon={<Calendar/> } label={"Calendar"}/>
        <NavItem icon={<Timer/> } label={"Timer"}/>
        <NavItem icon={<ChartLine/> } label={"Stats"}/> 
      </Stack>
    </Box>
  )
}
// import { CheckSquare, TextAlignJustify, Calendar,Timer ,ChartLine      } from 'lucide-react'
// import NavItem from './NavItem'
// import { useState } from 'react';
// import {Box, Stack} from '@mantine/core'

// export default function Sidebar(){
//   const [activePage, setActivePage] = useState('tasks')
//   return (
//     <div className='flex flex-row gap-2'>

//       <NavItem
//         label="Tasks"
//         icon={<CheckSquare size={20} />}
//         isActive={activePage === 'tasks'}
//         onClick={() => setActivePage('tasks')}
//       />
//       <NavItem
//         label="Notes"
//         icon={<TextAlignJustify size={20} />}
//         isActive={activePage === 'notes'}
//         onClick={() => setActivePage('notes')}
//       />
    

//     </div>
//   );
// }