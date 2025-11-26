// /client/src/components/CategoryScroller.jsx

import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faMobileAlt, 
    faStopwatch, 
    faCamera, 
    faHeadphones, 
    faDesktop, 
    faGamepad, 
    
} from '@fortawesome/free-solid-svg-icons'

// Placeholder data for the categories section
const categories = [
    { name: 'Phones', icon: faMobileAlt, link: '/products?category=Phones' }, // Assumes category is 'Phones' in DB
    { name: 'Smart Watches', icon: faStopwatch, link: '/products?category=Smart%20Watches' }, // Use %20 for spaces
    { name: 'Cameras', icon: faCamera, link: '/products?category=Cameras' },
    { name: 'Headphones', icon: faHeadphones, link: '/products?category=Headphones' },
    { name: 'Computers', icon: faDesktop, link: '/products?category=Computers' },
    { name: 'Gaming', icon: faGamepad, link: '/products?category=Gaming' },
]

const CategoryScroller = () => {
  return (
    <div className='py-8 container mx-auto px-4'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Browse By Category</h2>
      
      {/* Category Grid Container */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
        {categories.map((category) => (
          <Link 
            key={category.name}
            to={category.link}
            className='flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200 shadow-md hover:shadow-lg'
          >
            {/* Icon Circle */}
            <div className='bg-white p-4 rounded-lg mb-2 shadow-inner'>
              <FontAwesomeIcon icon={category.icon} className='text-2xl text-indigo-600' />
            </div>
            {/* Category Name */}
            <p className='text-sm font-semibold text-gray-700 mt-1'>{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryScroller