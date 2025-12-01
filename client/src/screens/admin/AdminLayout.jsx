import React from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import AdminHeader from '../../components/AdminHeader' // <-- IMPORT THE NEW HEADER

// This component acts as a wrapper for all admin screens
const AdminLayout = ({ children }) => {
  return (
    // Change min-h-screen to h-screen and use flex column to manage header height
    <div className='flex flex-col h-screen bg-gray-50'> 
      
      {/* 1. Admin Header (Stays at the top) */}
      <AdminHeader /> 

      {/* 2. Content and Sidebar Wrapper (Takes remaining height) */}
      <div className='flex flex-1 overflow-hidden'>
          
          {/* 2a. Sidebar (Fixed height: full height of the wrapper) */}
          <AdminSidebar />
          
          {/* 2b. Main Content Area (Takes remaining width and allows scrolling) */}
          <main className='flex-1 p-6 overflow-y-auto'> 
            <div className='max-w-full mx-auto'>
              {/* Render the specific Admin Screen (e.g., UserListScreen) */}
              {children} 
            </div>
          </main>
          
      </div>
    </div>
  )
}

export default AdminLayout