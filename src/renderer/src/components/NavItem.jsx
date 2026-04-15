export default function NavItem({ label, icon, isActive, onClick }) {
  return (
    <button

      onClick={onClick}
      className={ isActive ? 'text-blue-500' : 'text-gray-500'}
    >
      {icon}
      {label}
    </button>
  )
}