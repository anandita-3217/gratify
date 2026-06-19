import { Button, useMantineTheme } from '@mantine/core'
import PropTypes from 'prop-types'

export default function NavItem({ label, icon, isActive, onClick, collapsed }) {
  const theme = useMantineTheme()
  return (
    <Button
      variant="transparent"
      justify="left"
      onClick={onClick}
      title={collapsed ? label : ''}
      color={isActive ? theme.primaryColor : 'gray'}
      leftSection={icon}
      fullWidth
      // className={`relative flex items-center cursor-pointer gap-2.5 w-full rounded-md  px-2.5 py-2
      //   ${isActive ? 'text-[#c2255c]' : 'text-gray-500 hover:text-gray-600'}`}
    >
      {!collapsed && label}
    </Button>
  )
}
NavItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  collapsed: PropTypes.bool
}
