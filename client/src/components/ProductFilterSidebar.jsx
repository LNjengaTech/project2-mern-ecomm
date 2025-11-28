// /client/src/components/ProductFilterSidebar.jsx (REFINED)

import React from 'react'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'

const ProductFilterSidebar = ({ 
    showFilters, 
    setShowFilters, 
    selectedBrands, 
    selectedCategories, 
    handleBrandChange, 
    handleCategoryChange 
}) => {

    // Redux State for Filter Options (Accessed directly here)
    const filterOptions = useSelector((state) => state.filterOptions)
    const { 
        loading: loadingOptions, 
        error: errorOptions, 
        brands: availableBrands,
        categories: availableCategories 
    } = filterOptions

    // Helper to close the mobile menu
    const handleClose = () => {
        setShowFilters(false) 
    }
    
    // Handler for filter change that closes the mobile panel
    const handleFilterChangeAndClose = (handler, value) => {
        handler(value);
        // Auto-close the filter panel on change on mobile
        if (window.innerWidth < 1024) handleClose();
    }


    return (
        // 🔑 REFINED MOBILE CONTAINER: fixed, full-height, flex column
        <div className={`
            w-full lg:w-1/4 lg:block 
            ${showFilters 
                ? 'fixed inset-0 z-40 bg-white shadow-2xl flex flex-col' 
                : 'hidden'}
            p-0 lg:p-0 transition-transform duration-300 ease-in-out
        `}>
            
            {/* 🔑 MOBILE HEADER (Always fixed at the top on mobile) */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden sticky top-0 bg-white z-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faFilter} className='mr-2 text-indigo-600' /> Filter Options
                </h2>
                <button onClick={handleClose} className="p-2 text-gray-600 hover:text-red-600">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            </div>


            {/* 🔑 FILTER CONTENT AREA: Scrollable area, taking remaining height */}
            <div className={`
                flex-grow overflow-y-auto p-4 lg:p-0 
                ${showFilters ? 'lg:pt-0' : 'lg:pt-0'} // Ensure padding is correct
            `}>
                <div className="w-full bg-white lg:shadow-xl lg:rounded-xl lg:sticky lg:top-6">
                    
                    {/* 🔑 DESKTOP HEADER: Hidden on mobile, only shows on desktop */}
                    <h2 className={`
                        hidden lg:flex text-xl font-bold mb-4 text-gray-700 items-center border-b pb-2
                    `}>
                        <FontAwesomeIcon icon={faFilter} className='mr-2 text-indigo-600' /> Filter Options
                    </h2>
                    
                    {loadingOptions ? (
                        <div className='p-4 text-center'><Loader /></div>
                    ) : errorOptions ? (
                        <Message variant='danger'>{errorOptions}</Message>
                    ) : (
                        <>
                            {/* --- CATEGORY FILTER SECTION --- */}
                            <div className="mb-6 border-b pb-4">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800 mt-2">Product Category</h3>
                                
                                <div className="space-y-3">
                                    {availableCategories.map((cat) => (
                                        <div key={cat} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id={`category-${cat}`}
                                                value={cat}
                                                checked={selectedCategories.includes(cat)} 
                                                onChange={() => handleFilterChangeAndClose(handleCategoryChange, cat)} 
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`category-${cat}`} className="ml-2 text-base text-gray-700 cursor-pointer">
                                                {cat}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* --- Brand Filter --- */}
                            <div className="mb-6 pt-4"> 
                                <h3 className="text-lg font-semibold mb-2">Brand</h3>
                                <div className="space-y-3">
                                    {availableBrands.map((brand) => (
                                        <div key={brand.name} className="flex items-center justify-between">
                                            <label htmlFor={`brand-${brand.name}`} className="flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    id={`brand-${brand.name}`}
                                                    value={brand.name}
                                                    checked={selectedBrands.includes(brand.name)}
                                                    onChange={() => handleFilterChangeAndClose(handleBrandChange, brand.name)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-base text-gray-700 hover:text-indigo-600 transition">
                                                    {brand.name}
                                                </span>
                                            </label>
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
            </div>
            
            {/* 🔑 ACTION BUTTON (Always fixed at the bottom on mobile) */}
            <div className='p-4 border-t border-gray-200 lg:hidden sticky bottom-0 bg-white z-50'>
                <button onClick={handleClose} className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg'>
                    SHOW ({selectedBrands.length + selectedCategories.length} Active)
                </button>
            </div>
            
            {/* Mobile Backdrop - Keep for accessibility */}
            {/* ... */}
        </div>
    )
}

export default ProductFilterSidebar