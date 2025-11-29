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
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);


  return (
    <div className='flex min-h-screen w-full mx-auto'>
      
      {/* 1. SIDEBAR */}
      <AdminSidebar
        isToggled={isSidebarToggled} 
        setIsToggled={setIsSidebarToggled} 
      />
      
      {/* 2. MAIN CONTENT AREA */}
      <div className='flex-1 w-full flex flex-col'>
        
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