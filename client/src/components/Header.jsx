// /client/src/components/Header.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { USER_LIST_RESET } from '../constants/userConstants';
//import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  // 🔑 NEW: State for the search keyword input
  const [keyword, setKeyword] = useState(''); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0); 

  const logoutHandler = () => {
    dispatch(logout());
    dispatch({ type: USER_LIST_RESET });
    // dispatch({ type: ORDER_LIST_MY_RESET }); 
    navigate('/login');
    setUserMenuOpen(false);
  };
  
  const closeMenus = () => {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
  }

  // 🔑 NEW: Submit handler for search
  const submitHandler = (e) => {
    e.preventDefault();
    closeMenus(); // Close mobile menu if open

    if (keyword.trim()) {
      // If there's a keyword, navigate to products with the keyword in the URL
      navigate(`/products/search/${keyword.trim()}`);
    } else {
      // If the keyword is empty, navigate to the base products page
      navigate('/products');
    }
    setKeyword(''); // Clear the input after submission
  };

  return (
    <header className="bg-white shadow-md m-0 w-full sticky top-0 z-50">
      <div className="w-[100%] md:w-[90%] mx-auto p-2 flex justify-between items-center py-4">
        
        {/* Logo & Search Container */}
        <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black text-gray-900 tracking-wider" onClick={closeMenus}>
                ProTech
            </Link>
            
            {/* 🔑 DESKTOP Search Bar implementation */}
            <form onSubmit={submitHandler} className="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 w-72">
                {/* Search Icon (remains the same) */}
                <button type="submit" className="p-0 border-none bg-transparent">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-gray-50 outline-none text-sm text-gray-700 w-full"
                />
            </form>
        </div>

        {/* Navigation Links and Icons */}
        <nav className="flex items-center space-x-5 text-gray-700">
            
            {/* MOBILE MENU TOGGLE BUTTON */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-800 bg-white transition"
                aria-label="Toggle navigation menu"
            >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} size="lg" />
            </button>


            {/* DESKTOP NAVIGATION (Hidden on screens < 1024px) */}
            <div className="hidden lg:flex items-center space-x-6">
                
                {/* Main Marketing Navigation Links */}
                <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                    <Link to="/" className="text-black hover:text-gray-900 transition duration-150">Home</Link>
                    <Link to="/products" className="text-black hover:text-gray-900 transition duration-150">Products</Link>
                    <Link to="#" className="text-black hover:text-gray-900 transition duration-150">About</Link>
                    <Link to="#" className="text-black hover:text-gray-900 transition duration-150">Contact Us</Link>
                    <Link to="#" className="text-black hover:text-gray-900 transition duration-150">Blog</Link>
                </div>
            
                {/* Icons Container (Cart, Wishlist, User) - Visible on Desktop */}
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
                    
                    {/* User Dropdown (Login/Profile) */}
                    {userInfo ? (
                        <div className="relative">
                            <button 
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center space-x-1 bg-transparent text-gray-700 focus:outline-none"
                            >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </button>
                            {/* Dropdown Menu Items */}
                            {userMenuOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100"
                                onMouseLeave={() => setUserMenuOpen(false)}
                            >
                                <Link to="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100" onClick={closeMenus}>Profile</Link>
                                
                                {userInfo.isAdmin && (
                                    <>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={closeMenus}>Dashboard</Link>
                                    </>
                                )}

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
                        onClick={closeMenus}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m18-6V7a3 3 0 00-3-3h-4"></path></svg>
                    </Link>
                    )}
                </div>
            </div>
            
            {/* CART AND USER ICONS ON MOBILE (Visible on screens < 1024px) */}
            <div className="flex items-center space-x-5 lg:hidden text-gray-700">
                {/* Cart Icon */}
                <Link to="/cart" className="relative text-black hover:text-gray-900 transition duration-150">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* User Dropdown (Login/Profile) - Mobile version */}
                {userInfo ? (
                <div className="relative">
                    <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 bg-transparent text-gray-700 focus:outline-none"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </button>
                    {/* The dropdown logic remains the same */}
                    {userMenuOpen && (
                    <div 
                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100"
                        onMouseLeave={() => setUserMenuOpen(false)}
                    >
                        <Link to="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100" onClick={closeMenus}>Profile</Link>
                        {userInfo.isAdmin && (
                            <>
                                <div className="border-t border-gray-200 my-1"></div>
                                <Link to="/admin/userlist" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={closeMenus}>Dashboard</Link>
                            </>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm bg-transparent border-none text-red-600 hover:bg-gray-100">
                            Logout
                        </button>
                    </div>
                    )}
                </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition duration-150"
                        onClick={closeMenus}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m18-6V7a3 3 0 00-3-3h-4"></path></svg>
                    </Link>
                )}
            </div>
        </nav>
      </div>

    {/* MOBILE MENU OVERLAY */}
    <div 
        className={`
            lg:hidden absolute top-full right-0 min-w-[60%] bg-white shadow-xl 
            transition-all duration-1000 ease-in-out z-40 p-4 border-t border-gray-200
            ${mobileMenuOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}
        `}
    >
        {/* 🔑 MOBILE Search Bar (Functional) */}
        <form onSubmit={submitHandler} className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 mb-4">
            <button type="submit" className="p-0 border-none bg-transparent">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-gray-50 outline-none text-sm text-gray-700 w-full"
            />
        </form>

        {/* Mobile Main Navigation Links */}
        <div className="flex flex-col space-y-3 text-lg font-medium text-gray-800">
            <Link to="/" className="text-black hover:text-gray-500 transition duration-150 border-b pb-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-black hover:text-gray-500 transition duration-150 border-b pb-2" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="#" className="text-black hover:text-gray-500 transition duration-150 border-b pb-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="#" className="text-black hover:text-gray-500 transition duration-150 border-b pb-2" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            <Link to="#" className="text-black hover:text-gray-500 transition duration-150" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
        </div>
        
    </div>
    
    {/* MOBILE MENU BACKDROP */}
    {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)}
        ></div>
    )}
    
    </header>
  );
};

export default Header;


// The search functionality is now active on both the desktop and mobile search bars. When a user submits a query, they will be redirected to a URL like `/products/search/laptop` (or `/products` if empty), which triggers the existing product listing logic to filter the results by the keyword.

// ---

// ## ⏭️ Next Step

// The Header is now functional, responsive, and includes working search. We return to the remaining functional/debugging tasks:

// 1.  **A. Debugging:** Fix the **Product Delete on Cancel** issue (The logic in `handleGoBack` when creating/disbanding a sample product in `ProductEditScreen.jsx`).
// 2.  **B. Payment Methods:** Start implementing **Stripe/Mpesa** payment options.

// Which should we tackle next?