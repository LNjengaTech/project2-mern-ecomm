import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
// Note: Assuming these constants are defined globally or imported correctly
import { USER_LIST_RESET } from '../constants/userConstants';
//import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';


const Header = () => {
  // State to control the visibility of the user dropdown menu
  const [menuOpen, setMenuOpen] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Calculate total items in cart for the badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0); 

  const logoutHandler = () => {
    dispatch(logout());
    dispatch({ type: USER_LIST_RESET }); // Clear Admin user list
    dispatch({ type: ORDER_LIST_MY_RESET }); // Clear user orders
    navigate('/login'); // Redirect after logout
    setMenuOpen(false); // Close menu after logging out
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        
        {/* Logo & Search Container */}
        <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black text-gray-900 tracking-wider">
                cyber
            </Link>
            {/* Search Bar implementation */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 w-72">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-50 outline-none text-sm text-gray-700 w-full"
                />
            </div>
        </div>

        {/* Navigation Links and Icons */}
        <nav className="flex items-center space-x-6">

            {/* Main Marketing Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
                <Link to="/" className="text-black hover:text-gray-900 transition duration-150">Home</Link>
                <Link to="/products" className="text-black hover:text-gray-900 transition duration-150">Products</Link>
                <Link to="#" className="text-black hover:text-gray-900 transition duration-150">About</Link>
                <Link to="#" className="text-black hover:text-gray-900 transition duration-150">Contact Us</Link>
                <Link to="#" className="text-black hover:text-gray-900 transition duration-150">Blog</Link>
            </div>
            
            {/* Icons Container */}
            <div className="flex items-center space-x-5 text-gray-700">
                
                {/* Wishlist/Heart Icon */}
                <Link to="#" className="text-black hover:text-gray-900 transition duration-150">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </Link>

                {/* Cart Icon */}
                <Link to="/cart" className="relative text-black hover:text-gray-900 transition duration-150">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* Conditional Login/User Dropdown */}
                {userInfo ? (
                <div className="relative">
                    <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-1 bg-transparent text-gray-700 focus:outline-none"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </button>
                    {/* Dropdown Menu Items */}
                    {menuOpen && (
                    <div 
                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100"
                        onMouseLeave={() => setMenuOpen(false)} // UX: Close on mouse leave
                    >
                        <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-black hover:bg-gray-100" 
                            onClick={() => setMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        
                        {/* ------------------------------------------------------------------ */}
                        {/* CORRECTED ADMIN DASHBOARD LINK */}
                        {userInfo.isAdmin && (
                            <>
                                <div className="border-t border-gray-200 my-1"></div>
                                <span className="block px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase">Admin</span>
                                {/* Link to the default admin page (User List in our case) */}
                                <Link to="/admin/userlist" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            </>
                        )}
                        {/* ------------------------------------------------------------------ */}

                        <div className="border-t border-gray-200 my-1"></div>
                        <button 
                            onClick={logoutHandler}
                            className="block w-full text-left px-4 py-2 text-sm bg-transparent border-none text-red-600 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                    )}
                </div>
                ) : (
                // Display Sign In link if not logged in
                <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition duration-150"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m18-6V7a3 3 0 00-3-3h-4"></path></svg>
                </Link>
                )}
            </div>
            
        </nav>
      </div>
    </header>
  );
};

export default Header;