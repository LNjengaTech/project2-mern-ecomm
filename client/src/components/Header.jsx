import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart; // Get cart items from Redux state


  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-400 hover:text-blue-300 transition duration-150"
        >
          ProTech
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          {/* Cart Link */}
          {/* Cart Link */}
          <Link 
            to="/cart" 
            className="relative flex items-center space-x-1 hover:text-blue-300 transition duration-150" // <-- Added relative
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="hidden sm:inline">Cart</span>

            {/* Cart Item Count Badge */}
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-[-10px] transform translate-x-1/2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          {/* Login/User Link */}
          <Link
            to="/login"
            className="flex items-center space-x-1 hover:text-blue-300 transition duration-150"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
