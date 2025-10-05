import { useAuth } from '../../../contexts/AuthContext'
import './NavigationItems.css'
import NavigationItem from '../NavigationItem/NavigationItem'

const NavigationItems = () => {
  const { currentUser, signOut, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ul className="navigation-items">
      <NavigationItem link="/">Burger Builder</NavigationItem>
      
      {isAuthenticated && (
        <NavigationItem link="/orders">Orders</NavigationItem>
      )}
      
      {!isAuthenticated ? (
        <NavigationItem link="/auth">Authenticate</NavigationItem>
      ) : (
        <li className="navigation-item user-info">
          <span className="user-email">👤 {currentUser?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      )}
    </ul>
  )
}

export default NavigationItems
