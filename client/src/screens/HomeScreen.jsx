// /client/src/screens/HomeScreen.jsx

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { Link } from 'react-router-dom';

// We will create a dedicated Product component soon, but for now, list them directly

const HomeScreen = () => {
  const dispatch = useDispatch()

  // Select the productList state slice from the Redux store
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList // Destructure data

  // Runs after component mounts
  useEffect(() => {
    dispatch(listProducts()) // Dispatch the action to fetch products
  }, [dispatch])

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-500 mb-6">Latest Electronics</h1>

      {loading ? (
        <div className="text-center text-xl text-blue-600">Loading products...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      ) : (
          // Add a check: Make sure 'products' is an array before trying to render.
        Array.isArray(products) && ( 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-[1.02]">
              {/* Tailwind Product Card Placeholder */}
                <Link to={`/product/${product._id}`}> 
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}> {/* Link for the title */}
                    <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition duration-150">{product.name}</h2>
                </Link>
                <p className="text-gray-600 mb-4">{product.brand}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {/* Link to detail screen will go here */}
                </div>
              </div>
            </div>
          ))}
        </div>
        )
      )}
        
    </div>
  )
}

export default HomeScreen