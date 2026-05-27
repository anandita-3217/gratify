import { ListChecks , NotepadText , Calendar,Timer ,ChartLine , Settings, Sun, Moon , PanelLeftOpen, PanelLeftClose     } from 'lucide-react'
import NavItem from './NavItem'
import { useEffect, useState } from 'react';
import { useMantineColorScheme, useComputedColorScheme, Switch } from '@mantine/core'

function ThemeToggle({ collapsed }){
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const [checked, setChecked] = useState(false)
  const isDark = computedColorScheme === 'dark'

  return(
    <>
    {/* <button
    className='flex items-center gap-2 w-full pl-3 py-2 cursor-pointer text-gray-500 hover:text-gray-600  rounder-md transition-colors'
    onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
    >
      {computedColorScheme === 'light' ? <Moon size={25}/> : <Sun size={25} />}
    </button> */}
    <Switch
      p={8}
      cursor="pointer"
      size="md"
      checked={isDark}
      onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
      offLabel={<Sun size={16} color="red" />}
      onLabel={<Moon size={16} color="blue" />}
    />
    {/* <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}/> */}
    </>

  )

}

export default function Sidebar({activePage, onNavigate}){
  const[ collapsed, setCollapsed ] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      if(e.ctrlKey && e.key === 'b'){
        e.preventDefault()
        setCollapsed(c => !c)
      }
    }
    window.addEventListener('keydown', handler)
    return () =>window.removeEventListener('keydown', handler)
  },[])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartLine size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <ListChecks  size={20} /> },
    { id: 'notes', label: 'Notes', icon: <NotepadText  size={20} /> },
    { id: 'timer', label: 'Timer', icon: <Timer size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings  size={20} /> },
    
  ]
  return (
    <div className={`flex flex-col h-full border-r border-white/[0.07] transition-all duration-200 overflow-hidden ${ collapsed ? 'w-14' : 'w-52'}`}>
      <div className='flex items-center gap-2.5 px-5 h-14'>
        <div className='w-5 h-5 min-w-[20px] flex justify-center items-center rounded-md bg-[#cc225c]'>
          <p className='text-white font-bold text-xs'>G</p>
        </div>
        <span className={`text-sm text-gray-500 font-semibold whitespace-nowrap transition-opacity duration-150 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          Gratify
        </span>
      </div>
      <div className='flex flex-col flex-1 gap-0.5 px-2'>
      {navItems.map(
        item => (
          <NavItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          isActive={activePage === item.id}
          onClick={() => onNavigate(item.id)}
          collapsed={collapsed}
          />
        )
      ) }

      </div>
      <div className='pb-4 px-2 pt-3 border-t border-white/[0.07] flex flex-col gap-0.5'>
        <button onClick={() => setCollapsed(c => !c)}
          className='flex items-center gap-2.5 w-full px-2.5 py-2 text-gray-600 hover:text-gray-600 cursor-pointer p-1 transition-colors'>
            <span className='min-w-[20px] flex'>
              {collapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}
            </span>
          </button>
        <ThemeToggle collapsed={collapsed}/>
      </div>
    </div>
  );
}
// TODO: replace themetoggle with this import { Switch } from '@mantine/core';
// import { SunIcon, MoonStarsIcon } from '@phosphor-icons/react';

// function Demo() {
//   return (
//     <Switch
//       size="md"
//       color="dark.4"
//       onLabel={<SunIcon size={16} color="var(--mantine-color-yellow-4)" />}
//       offLabel={<MoonStarsIcon size={16} color="var(--mantine-color-blue-6)" />}
//     />
//   );
// }