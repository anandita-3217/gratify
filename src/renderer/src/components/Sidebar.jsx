import { CheckSquare, TextAlignJustify, Calendar,Timer ,ChartLine , Settings      } from 'lucide-react'
import NavItem from './NavItem'
import { useState } from 'react';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle(){
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  return(
    <button
    className='text-gray-500'
    onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
    >{computedColorScheme === 'light' ? <Moon size={20}/> : <Sun size={20} />}</button>
  )

}

export default function Sidebar({activePage, onNavigate}){
  // const [activePage, setActivePage] = useState('tasks')
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartLine size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Notes', icon: <TextAlignJustify size={20} /> },
    { id: 'timer', label: 'Timer', icon: <Timer size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings  size={20} /> },
    
  ]
  return (
    <div className='flex flex-col gap-2  h-full w-56 '>
      <div className='flex items-center gap-2 p-4'>
        <div className='w-8 h-8 rounded-lg bg-[#cc225c]'/>
        <span className='text-gray-500 font-semibold'>Gratify</span>
      </div>
      <div className='flex flex-col'>
      {navItems.map(
        item => (
          <NavItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          isActive={activePage === item.id}
          onClick={() => onNavigate(item.id)}
          />
        )
      ) }

      </div>
      <div className='mt-auto p-4'>
        <ThemeToggle/>
      </div>
    </div>
  );
}