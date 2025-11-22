import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const adminLinks = [
  { name: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/admin/dashboard' },
  { name: 'Users', icon: 'fas fa-users', path: '/admin/userlist' },
  { name: 'Products', icon: 'fas fa-box-open', path: '/admin/productlist' },
  { name: 'Orders', icon: 'fas fa-truck', path: '/admin/orderlist' },
  // Add other links as needed (Category, Roles, Settings, etc.)
]

const AdminSidebar = () => {
  const location = useLocation()

  return (
    <div className='w-64 bg-white border-r border-gray-200 min-h-screen pt-4 pb-10'>
      <div className='px-4 text-xl font-bold text-gray-900 mb-6'>
        REMO S
      </div>
      
      <div className='space-y-2'>
        <div className='px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase'>MAIN MENU</div>
        
        {adminLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            // Highlight the link if the current path matches
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