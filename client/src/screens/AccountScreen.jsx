// /client/src/screens/AccountScreen.jsx (UPDATED FOR TOGGLE)

import React, { useEffect, useState } from 'react' // 🔑 Import useState
import { useSelector } from 'react-redux'
import { useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Assuming you have font awesome installed
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons' // Icons for menu toggle

const AccountScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // 🔑 NEW STATE: Manages sidebar visibility (starts open on desktop, but we'll use media query to hide on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) 

  // Protection: Redirect if user is not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [navigate, userInfo])

  // Get the base path for active link styling
  const basePath = location.pathname.split('/')[2] || 'dashboard'
  
  // Array defining the sidebar links
  const navLinks = [
    { path: '/account', label: 'Dashboard', key: 'dashboard' },
    { path: '/account/details', label: 'Profile (Details)', key: 'details' },
    { path: '/account/orders', label: 'Orders', key: 'orders' },
    { path: '/account/addresses', label: 'Addresses', key: 'addresses' },
    
  ]
  
  if (!userInfo) return null 

  return (
    <div className="py-10 container mx-auto px-4">
      <h1 className="text-4xl font-light text-gray-800 mb-8 border-b pb-4">MY ACCOUNT</h1>

      {/* 🔑 MOBILE MENU TOGGLE BUTTON */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full text-left bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg flex justify-between items-center"
        >
          {isSidebarOpen ? (
            <>
              <FontAwesomeIcon icon={faTimes} className="mr-2" /> Hide Menu
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faBars} className="mr-2" /> Show Menu
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Account Sidebar Navigation */}
        <div 
          className={`
            md:col-span-1 bg-white p-6 shadow-lg border rounded-lg h-full 
            // 🔑 Toggling Logic: Hidden on mobile by default, shown when toggled, and always shown on desktop (md:block)
            ${isSidebarOpen ? 'block' : 'hidden md:block'}
          `}
        >
          <ul className="space-y-3 font-medium">
            {navLinks.map((link) => (
              <li key={link.key}>
                <NavLink
                  to={link.path}
                  end={link.path === '/account'}
                  onClick={() => setIsSidebarOpen(false)} // 🔑 Close menu on navigation
                  className={({ isActive }) => 
                    `block p-2 rounded transition duration-150 ${
                      isActive || basePath === link.key ? 'bg-gray-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2, 3 & 4: Content Area */}
        <div className="md:col-span-3 bg-white p-6 shadow-lg border rounded-lg">
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AccountScreen