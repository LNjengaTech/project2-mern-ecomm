// /client/src/components/CategoryScroller.jsx

import React, { useRef, useEffect } from 'react'; // 🔑 UPDATED: Imported useRef and useEffect from React
import { Link } from 'react-router-dom';
import { useDispatch, useSelector, } from 'react-redux';
import { listFilterOptions } from '../actions/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from './Loader';
import Message from './Message';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

// Swiper requires its core CSS and the CSS for any module you use
import 'swiper/css';
import 'swiper/css/navigation';

import { 
    faMobileAlt, 
    faStopwatch, 
    faCamera, 
    faHeadphones, 
    faDesktop, 
    faGamepad,
    faChargingStation,
    faNetworkWired,
    // faArrowAltCircleRight, // Not used, can be removed
    faArrowRight,
    faArrowLeft, // 🔑 NEW: Import the left arrow icon
    
} from '@fortawesome/free-solid-svg-icons';

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
};

const CategoryScroller = () => {
  const dispatch = useDispatch();

  // 🔑 NEW: Create refs for custom navigation elements
  const swiperNavPrevRef = useRef(null);
  const swiperNavNextRef = useRef(null);

  // Fetch filter options from Redux store
  const filterOptions = useSelector((state) => state.filterOptions);
  const { 
      loading: loadingOptions, 
      error: errorOptions, 
      categories: availableCategories 
  } = filterOptions;

  // 🔑 NEW: Fetch categories on component mount
    useEffect(() => {
        if (availableCategories.length === 0 && !loadingOptions && !errorOptions) {
             dispatch(listFilterOptions());
        }
    }, [dispatch, availableCategories.length, loadingOptions, errorOptions]);

  return (
    <div className='py-8 bg-gray-200'>
      <div className='w-[100%] md:w-[90%] mx-auto px-0'>
        
        {/* 🔑 UPDATED: New container for the heading and arrows, using justify-between */}
        <div className='flex justify-between items-center mb-6 px-4 md:px-0'>
            <h2 className='text-2xl font-bold text-gray-800'>Browse By Category</h2>
            
            {/* Custom Navigation Controls Container */}
            <div className='flex space-x-3'>
                {/* Previous Button Placeholder */}
                <button
                    ref={swiperNavPrevRef}
                    className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous Category"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600 text-sm" />
                </button>
                {/* Next Button Placeholder */}
                <button
                    ref={swiperNavNextRef}
                    className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next Category"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-600 text-sm" />
                </button>
            </div>
        </div>
      
      {loadingOptions ? (
                <Loader />
            ) : errorOptions ? (
                <Message variant='danger'>{errorOptions}</Message>
            ) : (
                
                <Swiper
                    modules={[Navigation, A11y]} 
                    // 🔑 UPDATED: Pass the refs to the navigation module
                    navigation={{
                        prevEl: swiperNavPrevRef.current,
                        nextEl: swiperNavNextRef.current,
                    }}
                    // 🔑 UPDATED: Add onBeforeInit to ensure Swiper binds refs after render
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = swiperNavPrevRef.current;
                        swiper.params.navigation.nextEl = swiperNavNextRef.current;
                        swiper.navigation.update();
                    }}
                    slidesPerView={3}
                    spaceBetween={16}
                    breakpoints={{
                        640: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 24,
                        },
                    }}
                    // 🔑 UPDATED: Removed 'pb-4' padding as arrows are now outside the Swiper flow
                    className="category-swiper-container" 
                >
                    {availableCategories.map((catName) => (
                        <SwiperSlide key={catName}>
                             <Link 
                                to={`/products?categories=${catName}`} 
                                className='
                                    flex flex-col items-center justify-center 
                                    p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200 shadow-md hover:shadow-lg
                                    h-full
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
                    
                    {availableCategories.length === 0 && (
                        <div className='col-span-6 p-4 text-center text-gray-500 bg-gray-50 rounded-lg'>
                            No categories available at the moment.
                        </div>
                    )}
                </Swiper>
            )}
      </div>
    </div>
  );
};

export default CategoryScroller;