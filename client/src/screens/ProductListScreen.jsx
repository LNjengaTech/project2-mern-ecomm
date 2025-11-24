// /client/src/screens/ProductListScreen.jsx

import React, { useState, useEffect } from 'react' // <-- Added useState
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { listProducts } from '../actions/productActions'
import { addToCart } from '../actions/cartActions' 

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons' // Added faTimes

import Paginate from '../components/Paginate'

// Placeholder data for filters (Replace this later with data fetched from backend)
const availableBrands = [
    { name: 'Apple', count: 110 },
    { name: 'Samsung', count: 125 },
    { name: 'Xiaomi', count: 68 },
    { name: 'Poco', count: 44 },
    { name: 'OPPO', count: 36 },
    { name: 'Honor', count: 10 },
    { name: 'Motorola', count: 24 },
    { name: 'Nokia', count: 22 },
    { name: 'Realme', count: 35 },
]


const ProductListScreen = () => {

    // 🔑 NEW: Get keyword and pageNumber from URL parameters
    const { keyword } = useParams() 
    const { pageNumber } = useParams() || 1 // Defaults to 1 if not in URL

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // 🔑 NEW STATE: For managing filter visibility on mobile
    const [showFilters, setShowFilters] = useState(false)
    // 🔑 NEW STATE: To track selected brand checkboxes (initial value could be populated from query params)
    const [selectedBrands, setSelectedBrands] = useState([])


    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        // 🔑 Call listProducts, passing the selected brands array
        // 🔑 Pass the current pageNumber from the URL to the action
        dispatch(listProducts(keyword || '', pageNumber || 1, selectedBrands)) 

    // 🔑 IMPORTANT: Add selectedBrands to the dependency array
    }, [dispatch, selectedBrands, keyword, pageNumber])

    const handleAddToCart = (productId) => {
        dispatch(addToCart(productId, 1)) 
        navigate('/cart') 
    }

    // Handler for brand checkbox changes
    const handleBrandChange = (brandName) => {
        setSelectedBrands(prevBrands => 
            prevBrands.includes(brandName)
                ? prevBrands.filter(b => b !== brandName) // Remove brand
                : [...prevBrands, brandName] // Add brand
        )
        return newBrands
        // The useEffect hook will now run automatically because selectedBrands changed
    }


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
                    <div className="w-full p-4 bg-white shadow-xl rounded-xl lg:sticky lg:top-6">
                        
                        {/* Mobile Header (Close Button) */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2 lg:hidden">
                            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                            <button onClick={() => setShowFilters(false)} className="p-2 text-gray-600 hover:text-red-600">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center border-b pb-2">
                            <FontAwesomeIcon icon={faFilter} className='mr-2 text-indigo-600' /> Filter Options
                        </h2>
                        
                        {/* --- Brand Filter (Checkboxes) --- */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Brand</h3>
                            
                            <div className="space-y-2">
                                {/* Map through available brands */}
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
                                        <span className='text-xs text-gray-500'>
                                            {brand.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- Other Filters (Placeholder Sections) --- */}
                        <div className="mt-4 hidden sm:block border-t pt-4 space-y-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Battery capacity</h3>
                                <p className="text-sm text-gray-500">Range slider or checkboxes here</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Screen type</h3>
                                <p className="text-sm text-gray-500">Dropdown or radio buttons here</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Built-in memory</h3>
                                <p className="text-sm text-gray-500">Range filter or radio buttons here</p>
                            </div>
                        </div>

                        {/* Close button for Mobile (for better UX) */}
                        <div className='mt-6 lg:hidden'>
                             <button onClick={() => setShowFilters(false)} className='w-full py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition'>
                                SHOW
                             </button>
                        </div>
                    </div>
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

                        {/* 🔑 RENDER PAGINATION: Pass the total pages and current page */}
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