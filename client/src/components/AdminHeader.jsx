import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faCog, faExpand, faSearch, faSyncAlt, faTh, faUser } from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';



// The Logo/Brand name can be the same as your app's name, or a simpler admin-focused name
const AdminHeader = () => {
    // Get the logged-in admin's information
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    return (
        // Fixed white header with shadow
        <header className='bg-white shadow-sm h-16 w-full border-b border-gray-200'>
            <div className='flex justify-between items-center h-full px-6'>

                {/* Left Section: Logo, Toggle, Search */}
                <div className='flex items-center space-x-6'>
                    {/* Logo/Brand Name */}
                    <div className='flex items-center space-x-2 text-xl font-bold text-blue-600'>
                        <span className='text-3xl'>
                            <FontAwesomeIcon icon={faThLarge} className='text-green-500' />
                        </span>
                        Remos {/* Or your app's name, e.g., cyber Admin */}
                    </div>

                    {/* Menu Toggle (Hamburger) */}
                    <button className='p-2 text-gray-500 hover:text-gray-900 focus:outline-none'>
                         <FontAwesomeIcon icon={faBars} className='text-green-500' />
                        <i className='fas fa-bars text-lg'></i>
                    </button>

                    {/* Search Bar */}
                    <div className='hidden lg:block'>
                        <div className='flex items-center bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 w-96'>
                            <input
                                type='text'
                                placeholder='Search here...'
                                className='bg-gray-50 outline-none text-sm text-gray-700 w-full'
                            />
                            <FontAwesomeIcon icon={faSearch} className='text-green-500' />
                        </div>
                    </div>
                </div>

                {/* Right Section: Icons and Profile */}
                <div className='flex items-center space-x-4'>
                    {/* Utility Icons (Refresh, Expand, Notification, Apps) */}
                    <div className='flex items-center space-x-2'>
                        <button className='p-2 border-gray-300 hover:border-gray-500 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faSyncAlt} className='text-green-500' />
                        </button>
                        <button className='p-2 border-gray-300 hover:border-gray-500 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faExpand} className='text-green-500' />
                        </button>
                        <button className='p-2 border-gray-300 hover:border-gray-500 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center relative'>
                            <FontAwesomeIcon icon={faBell} className='text-green-500' />
                            <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white'></span>
                        </button>
                        <button className='p-2 border-gray-300 hover:border-gray-500 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faTh} className='text-green-500' />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='w-px h-6 bg-gray-300 mx-2'></div>

                    {/* Admin Profile */}
                    <div className='flex items-center space-x-3'>
                        <div className="user-icon w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className='text-black h-[70%] w-[70%]' />
                        </div>
                        
                        
                        <div>
                            <div className='text-sm font-semibold text-gray-800'>
                                {userInfo ? userInfo.name : 'Admin Name'}
                            </div>
                            <div className='text-xs text-gray-500'>Admin</div>
                        </div>
                    </div>

                    {/* Settings Icon */}
                    <button className='p-2 border-gray-300 hover:border-gray-500 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center'>
                        <FontAwesomeIcon icon={faCog} className='text-green-500' />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader