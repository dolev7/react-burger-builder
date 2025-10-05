import { NavLink } from 'react-router-dom'
import './NavigationItem.css'

interface NavigationItemProps {
  link: string
  children: React.ReactNode
}

const NavigationItem = ({ link, children }: NavigationItemProps) => {
  return (
    <li className="navigation-item">
      <NavLink 
        to={link}
        className={({ isActive }) => isActive ? 'active' : undefined}
      >
        {children}
      </NavLink>
    </li>
  )
}

export default NavigationItem
