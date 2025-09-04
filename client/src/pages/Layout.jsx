// Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const Layout = () => {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden bg-[#818582]/10">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout




