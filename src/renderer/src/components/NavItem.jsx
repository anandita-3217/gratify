export default function NavItem({ label, icon, isActive, onClick }) {
  return (
    <button

      onClick={onClick}
      // className={ isActive ? 'text-blue-500' : 'text-gray-500'} 
      className={`flex flex-row items-center gap-2 cursor-pointer pl-4 py-1 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
    >
      {icon}
      {label}
    </button>
  )
}