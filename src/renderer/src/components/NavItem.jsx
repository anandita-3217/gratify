export default function NavItem({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{color: isActive ? 'blue' : 'gray'}}
    >
      {icon}
      {label}
    </button>
  )
}