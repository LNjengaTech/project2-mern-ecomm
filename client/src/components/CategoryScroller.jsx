// /client/src/components/CategoryScroller.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux' // 🔑 NEW: Import Redux hooks
import { listFilterOptions } from '../actions/productActions' // 🔑 NEW: Import action
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import Loader from './Loader'
import Message from './Message'
import { 
    faMobileAlt, 
    faStopwatch, 
    faCamera, 
    faHeadphones, 
    faDesktop, 
    faGamepad, 
    
} from '@fortawesome/free-solid-svg-icons'

// Helper function to map category names to Font Awesome icons
const categoryIconMap = {
    'Phones': faMobileAlt,
    'Smart Watches': faStopwatch,
    'Cameras': faCamera,
    'Headphones': faHeadphones,
    'Computers': faDesktop,
    'Gaming': faGamepad,
    // Add more mappings here for any other categories you use
}



const CategoryScroller = () => {
  const dispatch = useDispatch()

  // Fetch filter options from Redux store
  const filterOptions = useSelector((state) => state.filterOptions)
  const { 
      loading: loadingOptions, 
      error: errorOptions, 
      categories: availableCategories 
  } = filterOptions

  // 🔑 NEW: Fetch categories on component mount
    useEffect(() => {
        // We only fetch here if filterOptions hasn't been fetched yet
        if (availableCategories.length === 0 && !loadingOptions && !errorOptions) {
             dispatch(listFilterOptions())
        }
    }, [dispatch, availableCategories.length, loadingOptions, errorOptions])



  return (
    <div className='py-8 container mx-auto px-4'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Browse By Category</h2>
      
      {loadingOptions ? (
                <Loader />
            ) : errorOptions ? (
                <Message variant='danger'>{errorOptions}</Message>
            ) : (
                
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
                    {/* 🔑 DYNAMICALLY MAP AVAILABLE CATEGORIES */}
                    {availableCategories.map((catName) => (
                        <Link 
                            key={catName}
                            // Link now uses the plural 'categories' query parameter for consistency
                            to={`/products?categories=${catName}`} 
                            className='flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200 shadow-md hover:shadow-lg'
                        >
                            {/* Icon Circle - Use mapping or a default icon */}
                            <div className='bg-white p-4 rounded-lg mb-2 shadow-inner'>
                                <FontAwesomeIcon 
                                    icon={categoryIconMap[catName] || faDesktop} // Use mapped icon or a default
                                    className='text-2xl text-indigo-600' 
                                />
                            </div>
                            {/* Category Name */}
                            <p className='text-sm font-semibold text-gray-700 mt-1'>{catName}</p>
                        </Link>
                    ))}
                    
                    {/* Handle case where no categories are available */}
                    {availableCategories.length === 0 && (
                        <div className='col-span-6 p-4 text-center text-gray-500 bg-gray-50 rounded-lg'>
                            No categories available at the moment.
                        </div>
                    )}
                </div>
            )}
        </div>
  )
}

export default CategoryScroller