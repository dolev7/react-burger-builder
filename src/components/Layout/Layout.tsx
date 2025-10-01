import React from 'react'
import './Layout.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Toolbar />
      <main className="layout-content">
        {children}
      </main>
    </>
  )
}

export default Layout
