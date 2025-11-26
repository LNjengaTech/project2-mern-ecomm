// /client/src/screens/HomeScreen.jsx

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
// REMOVED: import { listProducts } from '../actions/productActions'
import { listHomepageProducts } from '../actions/productActions' // 🔑 NEW: Import homepage action
import banner_iPhone from '../assets/banner_iPhone.png'


// REMOVED: import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CategoryScroller from '../components/CategoryScroller' // 🔑 NEW: Import Category Scroller
import HomepageProductTabs from '../components/HomepageProductTabs' // 🔑 NEW: Import Tabs Component


// 🚨 NOTE: The handleAddToCart handler for the old product grid was removed, 
// as the homepage no longer shows the full product list.

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { keyword } = useParams() // Keep keyword for potential future search bar integration

  // 🔑 UPDATED: Select the new homepageProducts state
  const homepageProducts = useSelector((state) => state.homepageProducts)
  const { loading, error, newArrivals, bestSellers, featuredProducts } = homepageProducts

  useEffect(() => {
    // 🔑 UPDATED: Dispatch the specialized action to fetch all homepage data
    dispatch(listHomepageProducts())
    // The dependency array only needs dispatch here, as we are not relying on URL params for this fetch
  }, [dispatch])

  return (
    <>
      {/* 🚀 HERO SECTION (Kept as is - Banner) */}
      <div className="bg-[#1a111a] text-white py-20 lg:py-0 min-h-[500px] flex items-center justify-center rounded-xl my-0 shadow-2xl">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Text Content */}
          <div className="z-10 py-10 lg:py-20 max-w-lg">
            <h3 className="text-xl lg:text-2xl font-light text-gray-300 mb-2 tracking-wider">
              Pro.Beyond.
            </h3>
            <h1 className="text-5xl lg:text-7xl font-extralight mb-6 leading-tight">
              iPhone 14 <span className="text-white font-extrabold">Pro</span>
            </h1>
            <p className="text-base lg:text-lg text-gray-400 mb-10">
              Created to change everything for the better. For everyone
            </p>
            <Link to="/products/latest" className="inline-block">
                <button
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-[#1a111a] transition duration-300 shadow-lg"
                >
                Shop Now
                </button>
            </Link>
          </div>
          
          {/* Image Section */}
          <div className="flex justify-center lg:justify-end overflow-hidden lg:h-full">
            <img 
              src={banner_iPhone}
              alt="iPhone 14 Pro" 
              className="w-full max-w-xl object-contain transform translate-x-10 lg:translate-x-0" 
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </div>
      
      {/* 🔑 NEW: BROWSE BY CATEGORY SECTION */}
      <div className='py-8'>
          <CategoryScroller />
      </div>
      {/* 🔑 DYNAMIC PRODUCT TABS SECTION - Render Component Here */}
            <div className='py-8'>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    // 🔑 RENDER THE TABS COMPONENT AND PASS ALL THREE DATA ARRAYS
                    <HomepageProductTabs
                        newArrivals={newArrivals}
                        bestSellers={bestSellers}
                        featuredProducts={featuredProducts}
                    />
                )}
            </div>
    </>
  )
}

export default HomeScreen