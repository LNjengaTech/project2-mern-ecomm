import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header'; // Your main e-commerce header component
// import Footer from './Footer'; // Assuming you have a Footer component

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Define which paths should NOT show the main header
  // If the path starts with '/admin', we hide the header.
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* The main header is only rendered if it is NOT an admin route.
        The AdminLayout component (which we created in Step 8) will handle the admin view's header/sidebar. 
      */}
      {!isAdminRoute && <Header />} 
      
      <main>
        {children}
      </main>

      {/* Optionally, you can also conditionally hide the footer */}
      {/* {!isAdminRoute && <Footer />} */}
    </>
  );
};

export default Layout;