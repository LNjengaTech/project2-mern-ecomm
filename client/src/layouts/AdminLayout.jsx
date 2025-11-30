// /client/src/layouts/AdminLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, } from '@fortawesome/free-solid-svg-icons';
import { faBell, faCog, faExpand, faSearch, faSyncAlt, faTh, faUser } from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';

const AdminLayout = () => {
  // State to control sidebar visibility
  const [isSidebarToggled, setIsSidebarToggled] = useState(true);

  // The sidebar width is 64 (w-64)
  const sidebarWidthClass = 'pl-64'; 

  return (
    // The main layout wrapper uses 'flex min-h-screen'
    <div className='flex min-h-screen w-full bg-gray-100'>
      
      {/* 1. SIDEBAR */}
      <AdminSidebar
        isToggled={isSidebarToggled} 
        setIsToggled={setIsSidebarToggled} 
      />
      
      {/* 2. MAIN CONTENT AREA */}
      {/* 
        Apply conditional padding-left to push the content.
        This padding matches the width of the sidebar (w-64/pl-64).
        It applies only when the sidebar is visible, transitioning smoothly.
        On large screens (lg+), the sidebar is likely always open (if configured that way), 
        so the padding ensures content always respects the sidebar's space.
      */}
      <div className={`flex-1 m-0 w-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarToggled ? sidebarWidthClass : 'pl-0'} lg:${sidebarWidthClass}`}>
        
        {/* HEADER BAR with TOGGLE BUTTON */}
        <AdminHeader 
          isSidebarToggled={isSidebarToggled} 
          setIsSidebarToggled={setIsSidebarToggled}
        />

        {/* PAGE CONTENT */}
        <main className='p-6 flex-1 border- w-full'>
          <Outlet /> {/* Renders the current admin route component (e.g., UserListScreen) */}
        </main>
      </div>

      {/* 3. MOBILE BACKDROP (Closes sidebar when clicking outside) */}
      {/* This is still needed for mobile overlay behavior if you keep the sidebar as 'fixed' on mobile */}
      {isSidebarToggled && (
        <div 
          className='fixed inset-0 bg-black opacity-50 z-40 lg:hidden'
          onClick={() => setIsSidebarToggled(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;