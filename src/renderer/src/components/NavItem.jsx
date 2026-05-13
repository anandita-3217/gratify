export default function NavItem({ label, icon, isActive, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : ''}
      className={`relative flex items-center cursor-pointer gap-2.5 w-full rounded-md  px-2.5 py-2 
        ${isActive ? 'text-[#c2255c]' : 'text-gray-500 hover:text-gray-600'}`}
    >
      <span className='min-w-[20px] flex'>
       {icon}
      </span>
      {!collapsed && <span className={`whitespace-nowrap transition-opacity duration-100 ${collapsed ?  'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
        {label}
        </span>}
    </button>
  )
}