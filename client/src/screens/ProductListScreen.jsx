// /client/src/screens/ProductListScreen.jsx

import React, { useState, useEffect } from 'react' // <-- Added useState
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { listProducts, listFilterOptions } from '../actions/productActions' // NEW: Import listFilterOptions
import { addToCart } from '../actions/cartActions' 

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons' // Added faTimes

import Paginate from '../components/Paginate'


// Helper function to extract query parameters (from useLocation hook)
function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const ProductListScreen = () => {

    // Get keyword and pageNumber from URL parameters
    const { keyword } = useParams() 
    const { pageNumber } = useParams() || 1 // Defaults to 1 if not in URL

    // Extract the category from the URL query string (e.g., ?category=Phones)
    const query = useQuery()
    // Read brands and categories from the URL, splitting into an array if they exist
    const brandQuery = query.get('brands') ? query.get('brands').split(',') : []
    const categoryQuery = query.get('categories') ? query.get('categories').split(',') : [] // UPDATED: Look for 'categories' parameter

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //STATE: For managing filter visibility on mobile
    const [showFilters, setShowFilters] = useState(false)
    //STATE: To track selected category checkboxes (initial value could be populated from query params)
    const [selectedCategories, setSelectedCategories] = useState(categoryQuery)
    // FIX APPLIED HERE: Initialize selectedBrands with brandQuery
    const [selectedBrands, setSelectedBrands] = useState(brandQuery)


    // 🔑 NEW: Redux State for Filter Options
    const filterOptions = useSelector((state) => state.filterOptions)
    const { 
        loading: loadingOptions, 
        error: errorOptions, 
        brands: availableBrands,       // 🔑 Rename from state for easier use
        categories: availableCategories // 🔑 Rename from state for easier use
    } = filterOptions

    // Existing Redux State for Product List
    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    const handleAddToCart = (productId) => {
        dispatch(addToCart(productId, 1)) 
        navigate('/cart') 
    }

    // NEW: Handler for category checkbox changes
    const handleCategoryChange = (categoryName) => {
        setSelectedCategories(prevCategories => {
            const newCategories = prevCategories.includes(categoryName)
                ? prevCategories.filter(c => c !== categoryName) // Remove category
                : [...prevCategories, categoryName] // Add category
            
            // Navigate to update the URL with the new comma-separated list
            const brandParams = selectedBrands.length > 0 ? `brands=${selectedBrands.join(',')}` : ''
            const categoryParams = newCategories.length > 0 ? `categories=${newCategories.join(',')}` : ''

            let url = '/products'
            const params = [brandParams, categoryParams].filter(p => p).join('&')
            if (params) {
                url = `/products?${params}`
            }
            
            navigate(url)
            return newCategories
        })
    }


    // UPDATED: Handler for brand checkbox changes
    const handleBrandChange = (brandName) => {
        setSelectedBrands(prevBrands => {
            const newBrands = prevBrands.includes(brandName)
                ? prevBrands.filter(b => b !== brandName) // Remove brand
                : [...prevBrands, brandName] // Add brand
            
            // Navigate to update the URL with the new comma-separated list
            const brandParams = newBrands.length > 0 ? `brands=${newBrands.join(',')}` : ''
            const categoryParams = selectedCategories.length > 0 ? `categories=${selectedCategories.join(',')}` : ''

            let url = '/products'
            const params = [brandParams, categoryParams].filter(p => p).join('&')
            if (params) {
                url = `/products?${params}`
            }

            navigate(url)
            return newBrands
            // useEffect will trigger listProducts with updated brands automatically
        })
    }

     useEffect(() => {
        // 🔑 1. Fetch the available filter options (brands and categories) once
        dispatch(listFilterOptions())
        
        // 🔑 2. Fetch the products based on the current filters
        // Call listProducts, passing the selected brands array
        // Pass the current pageNumber from the URL to the action
        dispatch(listProducts(keyword || '', pageNumber || 1, selectedBrands, selectedCategories)) 

        // 🚨 Note: Removed 'category' dependency as it's now tracked by selectedCategories. 
        // The URL change from navigate() triggers a component re-render, re-reads the URL 
        // in useQuery(), and updates the initial state for selectedBrands/Categories.
        // We ensure we only fetch when selectedBrands or selectedCategories changes.
    }, [dispatch, keyword, pageNumber, selectedBrands, selectedCategories])


    return (
        <div className="container mx-auto px-4 py-8 relative">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-extrabold text-gray-800">All Products</h1>
                 {/* Mobile Filter Toggle Button */}
                 <button 
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden p-3 bg-black text-white rounded-lg shadow-md  transition flex items-center"
                 >
                    <FontAwesomeIcon icon={faFilter} className='mr-2' /> Filters
                 </button>
            </div>


            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* 1. Filter Sidebar Container */}
                {/* Mobile: fixed, full screen. Desktop: block, 1/4 width */}
                <div className={`
                    w-full lg:w-1/4 lg:block 
                    ${showFilters ? 'fixed inset-0 z-40 bg-white p-6 shadow-2xl overflow-y-auto' : 'hidden'}
                    p-0 lg:p-0
                `}>
                    
                    {/* Filter Card */}
                    {/* Mobile Header (Close Button) */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2 lg:hidden">
                            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                            <button onClick={() => setShowFilters(false)} className="p-2 text-gray-600 hover:text-red-600">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center border-b pb-2 mt-12">
                            <FontAwesomeIcon icon={faFilter} className='mr-2 text-indigo-600' /> Filter Options
                        </h2>
                    {/* 🔑 NEW: Loader/Error for Filter Options */}
                        {loadingOptions ? (
                            <div className='p-4 text-center'><Loader /></div>
                        ) : errorOptions ? (
                            <Message variant='danger'>{errorOptions}</Message>
                        ) : (
                            <>
                                {/* --- CATEGORY FILTER SECTION --- */}
                                <div className="mb-6 border-b pb-4">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Product Category</h3>
                                    
                                    <div className="space-y-2">
                                        {/* 🔑 DYNAMIC CATEGORY MAPPING */}
                                        {availableCategories.map((cat) => (
                                            <div key={cat} className="flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    id={`category-${cat}`}
                                                    name="category"
                                                    value={cat}
                                                    checked={selectedCategories.includes(cat)} 
                                                    onChange={() => handleCategoryChange(cat)} 
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`category-${cat}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                                    {cat}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* --- Brand Filter --- */}
                                <div className="mb-6 pt-4"> 
                                    <h3 className="text-lg font-semibold mb-2">Brand</h3>
                                    <div className="space-y-2">
                                        {/* 🔑 DYNAMIC BRAND MAPPING */}
                                        {availableBrands.map((brand) => (
                                            <div key={brand.name} className="flex items-center justify-between">
                                                <label htmlFor={`brand-${brand.name}`} className="flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        id={`brand-${brand.name}`}
                                                        name="brand"
                                                        value={brand.name}
                                                        checked={selectedBrands.includes(brand.name)}
                                                        onChange={() => handleBrandChange(brand.name)}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 hover:text-indigo-600 transition">
                                                        {brand.name}
                                                    </span>
                                                </label>
                                                {/* Display product count next to brand name */}
                                                <span className='text-xs text-gray-500'>
                                                    ({brand.count})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                </div>

                {/* 2. Product Grid (Main Content) */}
                <div className="w-full lg:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-3 bg-white shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                           Products Result: {products.length}
                        </h2>
                        {/* Rating/Sort Dropdown */}
                        <select className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                            <option>By rating</option>
                            <option>By price (low to high)</option>
                            <option>By price (high to low)</option>
                        </select>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error}</Message>
                    ) : (
                        <>
                        {/* // Check if products exists AND is an array before mapping */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products && Array.isArray(products) && products.map((product) => ( // <-- ADD THIS CHECK
                                <div key={product._id} className='relative'>
                                    <Product 
                                        product={product} 
                                        customButtonText="Add to Cart & Checkout"
                                        customButtonHandler={() => handleAddToCart(product._id)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* RENDER PAGINATION: Pass the total pages and current page */}
                            <Paginate 
                                pages={pages} 
                                page={page} 
                                keyword={keyword} 
                            />
                        </>
                        
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductListScreen