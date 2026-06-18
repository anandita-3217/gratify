import { Button } from '@mantine/core'
import PropTypes from 'prop-types'

export default function NavItem({ label, icon, isActive, onClick, collapsed }) {
  return (
    <Button
      variant="transparent"
      justify="left"
      onClick={onClick}
      title={collapsed ? label : ''}
      color={isActive ? 'violet' : 'gray'}
      leftSection={icon}

      // className={`relative flex items-center cursor-pointer gap-2.5 w-full rounded-md  px-2.5 py-2
      //   ${isActive ? 'text-[#c2255c]' : 'text-gray-500 hover:text-gray-600'}`}
    >
      {!collapsed && (
        <span
          className={`whitespace-nowrap transition-opacity duration-100 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
        >
          {label}
        </span>
      )}
    </Button>
  )
}
NavItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  isActive: PropTypes.func,
  onClick: PropTypes.func,
  collapsed: PropTypes.bool
}
