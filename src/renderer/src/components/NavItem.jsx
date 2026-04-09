import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function NavItem({ label, icon,isActive }) {
    // const [active, setActive] = useState<Boolean>(false);
  return (
    <button className={isActive ? "text-blue-400" : "text-white/40"}>
      {icon}
      {label}
    </button>
  )
}