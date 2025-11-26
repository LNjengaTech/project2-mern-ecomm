// /client/src/components/HomepageProductTabs.jsx

import React, { useState } from 'react'
import Product from './Product'
import { addToCart } from '../actions/cartActions' // To handle cart addition
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const tabs = [
    { key: 'newArrivals', label: 'New Arrival' },
    { key: 'bestSellers', label: 'Bestseller' },
    { key: 'featuredProducts', label: 'Featured Products' },
]

const HomepageProductTabs = ({ newArrivals, bestSellers, featuredProducts }) => {
    // State to manage the active tab (defaults to New Arrivals)
    const [activeTab, setActiveTab] = useState('newArrivals')
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Map the active key to the corresponding array prop
    const getActiveProducts = () => {
        switch (activeTab) {
            case 'bestSellers':
                return bestSellers
            case 'featuredProducts':
                return featuredProducts
            case 'newArrivals':
            default:
                return newArrivals
        }
    }

    // Handler to add the product to cart and redirect (reusing logic from ProductListScreen)
    const handleAddToCart = (productId) => {
        dispatch(addToCart(productId, 1)) 
        navigate('/cart') 
    }

    const productsToDisplay = getActiveProducts()
    
    return (
        <div className='pb-8 container mx-auto px-4'>
            {/* 1. Tab Navigation Links */}
            <div className='flex space-x-6 border-b border-gray-200 mb-8'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                            py-2 px-1 text-lg font-semibold transition duration-200
                            ${activeTab === tab.key 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' // Active style
                                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300' // Inactive style
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 2. Product Grid Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsToDisplay && productsToDisplay.length > 0 ? (
                    productsToDisplay.map((product) => (
                        <Product 
                            key={product._id} 
                            product={product} 
                            // Reuse the existing button text and handler
                            customButtonText="Buy Now" 
                            customButtonHandler={() => handleAddToCart(product._id)}
                        />
                    ))
                ) : (
                    <div className='col-span-4 p-8 text-center bg-gray-50 rounded-lg'>
                        <p className='text-gray-500'>
                            No {tabs.find(t => t.key === activeTab)?.label} found in the system.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomepageProductTabs