// /client/src/components/CategoryScroller.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux' // 🔑 NEW: Import Redux hooks
import { listFilterOptions } from '../actions/productActions' // 🔑 NEW: Import action
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import Loader from './Loader'
import Message from './Message'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules' // Import necessary modules (Navigation for arrows)

// Swiper requires its core CSS and the CSS for any module you use
import 'swiper/css'
import 'swiper/css/navigation'

import { 
    faMobileAlt, 
    faStopwatch, 
    faCamera, 
    faHeadphones, 
    faDesktop, 
    faGamepad,
    faChargingStation,
    faNetworkWired,
    
} from '@fortawesome/free-solid-svg-icons'

// Helper function to map category names to Font Awesome icons
const categoryIconMap = {
    'Phones': faMobileAlt,
    'Smart Watches': faStopwatch,
    'Cameras': faCamera,
    'Headphones': faHeadphones,
    'Computers': faDesktop,
    'Gaming': faGamepad,
    'Accessories': faChargingStation,
    'Networking': faNetworkWired,

    // 'Tablets': faTabletAlt, // Uncomment if you import faTabletAlt
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
    <div className='py-8  bg-gray-200'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Browse By Category</h2>
      
      {loadingOptions ? (
                <Loader />
            ) : errorOptions ? (
                <Message variant='danger'>{errorOptions}</Message>
            ) : (
                
                // 🔑 REPLACED: Use Swiper component for the slider functionality
                <Swiper
                    // 🔑 Enable the Navigation module for arrows
                    modules={[Navigation, A11y]} 
                    navigation={true}
                    // 🔑 Define how many slides are visible based on screen size
                    slidesPerView={3}
                    spaceBetween={16} // Tailwind equivalent of space-x-4
                    breakpoints={{
                        640: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 6, // Show 6 items on large screens
                            spaceBetween: 24,
                        },
                    }}
                    // 🔑 Add padding to the container to prevent items from touching the edges
                    className="category-swiper-container pb-4" 
                >
                    {availableCategories.map((catName) => (
                        <SwiperSlide key={catName}>
                             <Link 
                                // Link uses the plural 'categories' query parameter
                                to={`/products?categories=${catName}`} 
                                className='
                                    flex flex-col items-center justify-center 
                                    p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200 shadow-md hover:shadow-lg
                                    h-full // Ensures all slides have the same height
                                '
                            >
                                {/* Icon Circle */}
                                <div className='bg-white p-4 rounded-lg mb-2 shadow-inner'>
                                    <FontAwesomeIcon 
                                        icon={categoryIconMap[catName] || faDesktop}
                                        className='text-2xl text-indigo-600' 
                                    />
                                </div>
                                {/* Category Name */}
                                <p className='text-sm font-semibold text-gray-700 mt-1 text-center'>{catName}</p>
                            </Link>
                        </SwiperSlide>
                    ))}
                    
                    {/* Handle case where no categories are available */}
                    {availableCategories.length === 0 && (
                        <div className='col-span-6 p-4 text-center text-gray-500 bg-gray-50 rounded-lg'>
                            No categories available at the moment.
                        </div>
                    )}
                </Swiper>
            )}
      </div>
      
        </div>
  )
}

export default CategoryScroller