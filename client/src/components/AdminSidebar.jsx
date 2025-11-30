import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Assuming you're using FontAwesome for icons
import { faTimes, faThLarge, faSignOut } from '@fortawesome/free-solid-svg-icons' // For the close button
import { faTachometerAlt, faUser, faBoxOpen, faTruck, faCog, } from '@fortawesome/free-solid-svg-icons' // Example icons

const adminLinks = [
  { name: 'Dashboard', icon: faTachometerAlt, path: '/admin/dashboard' },
  { name: 'Customers', icon: faUser, path: '/admin/userlist' },
  { name: 'Products', icon: faBoxOpen, path: '/admin/productlist' },
  { name: 'Orders', icon: faTruck, path: '/admin/orderlist' },
  { name: 'Settings', icon: faCog, path: '/admin/settings' },
  { name: 'logout', icon: faSignOut, path: '/logout' },
  // Add other links as needed (Category, Roles, Settings, etc.)
]

// 🔑 ACCEPT PROPS for toggle state and handler
const AdminSidebar = ({ isToggled, setIsToggled }) => {
  const location = useLocation()

 

  return (
    // 🔑 APPLY CONDITIONAL CLASSES for responsiveness and visibility
     <div className={`
      // Base classes for desktop size (always visible, fixed width)
      w-[272px] bg-white border-r border-gray-200 pt-4 pb-10 shadow-2xl
      // Ensure it takes full viewport height
      min-h-screen 
      
      // Mobile behavior: fixed position for overlay/slide-in on small screens
      // Desktop behavior: relative/inline-block, part of the flow (no fixed positioning here)
      xxl:relative m-0 transition-transform duration-300 ease-in-out

      // Mobile only (fixed positioning makes it overlay)
      ${!isToggled ? 'fixed inset-y-0 left-0 z-50' : 'fixed inset-y-0 left-0 z-50'}
      
      // Toggle logic (affects mobile display only, on desktop it's always 'translate-x-0')
      ${isToggled ? 'translate-x-0' : '-translate-x-full'} 
      `}>
      
      {/* 🔑 MOBILE CLOSE BUTTON (Hidden on large screens) */}
      <div className='flex justify-between items-center py-5 px-4 mb-6 border-b border-gray-200'>
        <div className="flex items-center space-x-2 text-xl font-bold text-blue-600">
                    <span className="text-3xl">
                      <FontAwesomeIcon icon={faThLarge} className="text-green-500" />
                    </span>
                    ProTech
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
      {/* <div className='px-4 text-xl font-bold text-gray-900 mb-6 hidden lg:block'>
        REMO S
      </div> */}
      
      <div className='space-y-2'>
        <div className='px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase'>MAIN MENU</div>
        
        {adminLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsToggled(false)} // 🔑 Close on link click for mobile UX
            className={`flex text-sm font-bold items-center space-x-3 px-6 py-3 transition duration-150 ${
              location.pathname === link.path
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {/* <i className={`${link.icon} w-5`}></i> */}
            <FontAwesomeIcon icon={link.icon} className='w-5' />
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
            <FontAwesomeIcon icon={faCog} className='w-5' />
            <span>Setting</span>
          </Link>
          
      </div>
    </div>
  )
}

export default AdminSidebar