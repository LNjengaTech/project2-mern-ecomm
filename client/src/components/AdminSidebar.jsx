import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Assuming you're using FontAwesome for icons
import { faTimes } from '@fortawesome/free-solid-svg-icons' // For the close button

const adminLinks = [
  { name: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/admin/dashboard' },
  { name: 'Users', icon: 'fas fa-users', path: '/admin/userlist' },
  { name: 'Products', icon: 'fas fa-box-open', path: '/admin/productlist' },
  { name: 'Orders', icon: 'fas fa-truck', path: '/admin/orderlist' },
  // Add other links as needed (Category, Roles, Settings, etc.)
]

// 🔑 ACCEPT PROPS for toggle state and handler
const AdminSidebar = ({ isToggled, setIsToggled }) => {
  const location = useLocation()

 

  return (
    // 🔑 APPLY CONDITIONAL CLASSES for responsiveness and visibility
    <div className={`
      // Base classes for desktop size (always visible, fixed width)
      w-64 bg-white border-r border-gray-200 pt-4 pb-10 
      // Ensure it takes full viewport height
      min-h-screen 
      
      //Mobile behavior: fixed, full height, transition
      xl:relative xl:translate-x-0 transition-transform duration-300 ease-in-out
      fixed inset-y-0 left-0 z-50
      
      // Toggle logic
      ${isToggled ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'} 
      `}>
      
      {/* 🔑 MOBILE CLOSE BUTTON (Hidden on large screens) */}
      <div className='flex justify-between items-center px-4 mb-4 lg:hidden'>
        <div className='text-xl font-bold text-gray-900'>
          REMO S
        </div>
        <button 
          onClick={() => setIsToggled(false)}
          className='text-gray-600 hover:text-red-600 p-2'
          aria-label='Close sidebar'
        >
          {/* Using FontAwesomeIcon for the close button */}
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>

      {/* DESKTOP LOGO (Shown only on desktop, offset by mobile button height) */}
      <div className='px-4 text-xl font-bold text-gray-900 mb-6 hidden lg:block'>
        REMO S
      </div>
      
      <div className='space-y-2'>
        <div className='px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase'>MAIN MENU</div>
        
        {adminLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsToggled(false)} // 🔑 Close on link click for mobile UX
            className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium transition duration-150 ${
              location.pathname === link.path
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={`${link.icon} w-5`}></i>
            <span>{link.name}</span>
          </Link>
        ))}
        
        <div className='px-4 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase'>SETTING</div>
        <Link
            to="/admin/settings"
            onClick={() => setIsToggled(false)} // 🔑 Close on link click for mobile UX
            className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium transition duration-150 ${
              location.pathname === '/admin/settings'
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className='fas fa-cog w-5'></i>
            <span>Setting</span>
          </Link>
          
      </div>
    </div>
  )
}

export default AdminSidebar