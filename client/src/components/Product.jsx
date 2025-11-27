// /client/src/components/Product.jsx (Updated)

import React from 'react'
import { Link } from 'react-router-dom'
// import Rating from './Rating'

// Accept custom button props
const Product = ({ product, customButtonText, customButtonHandler }) => {
  return (
    <div className='rounded-xl shadow-lg hover:shadow-2xl transition duration-300 bg-white overflow-hidden flex flex-col h-full'>
      <Link to={`/product/${product._id}`} className='flex-grow'>
        <img 
          src={product.image}
          alt={product.name}
          className='w-full object-cover object-center p-8'
        />
      </Link>

      <div className='p-4 flex flex-col justify-between flex-grow'>
        <Link to={`/product/${product._id}`}>
          <div className='text-gray-800 font-semibold text-base mb-1 hover:text-indigo-600 line-clamp-2'>
            {product.name}
          </div>
        </Link>

        <div className="my-2 text-sm text-yellow-500">
                  {/* Rating Component Placeholder */}
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))} ({product.numReviews} reviews)
                </div>

        <div className='flex items-center justify-between mt-auto pt-2 border-t border-gray-100'>
            <div className='text-2xl font-bold text-gray-900'>
                ${product.price}
            </div>
            
            
            <button
                onClick={customButtonHandler ? customButtonHandler : () => { /* default behavior */ }}
                className='bg-black border-none text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition duration-150 ease-in-out shadow-md'
                disabled={product.countInStock === 0}
            >
                {product.countInStock === 0 
                    ? 'Out of Stock' : 'Buy Now'}
            </button>

        </div>
      </div>
    </div>
  )
}

export default Product