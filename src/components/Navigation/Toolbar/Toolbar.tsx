import './Toolbar.css'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'

const Toolbar = () => {
  return (
    <header className="toolbar">
      <div>MENU</div>
      <div className="toolbar-logo">
        <Logo />
      </div>
      <nav className="desktop-only">
        <NavigationItems />
      </nav>
    </header>
  )
}

export default Toolbar
