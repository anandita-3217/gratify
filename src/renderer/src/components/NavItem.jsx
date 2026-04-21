export default function NavItem({ label, icon, isActive, onClick }) {
  return (
    <button

      onClick={onClick}
      className={`flex flex-row items-center gap-2 cursor-pointer pl-4 py-1 ${isActive ? 'text-[#c2255c]' : 'text-gray-500'}`}
    >
      {icon}
      {label}
    </button>
  )
}