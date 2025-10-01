import './NavigationItem.css'

interface NavigationItemProps {
  link: string
  active?: boolean
  children: React.ReactNode
}

const NavigationItem = ({ link, active, children }: NavigationItemProps) => {
  return (
    <li className="navigation-item">
      <a 
        href={link}
        className={active ? 'active' : undefined}
      >
        {children}
      </a>
    </li>
  )
}

export default NavigationItem
