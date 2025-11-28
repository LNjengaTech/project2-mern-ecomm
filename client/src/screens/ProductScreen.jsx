// /client/src/screens/ProductScreen.jsx

import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails } from '../actions/productActions'
// We will create ReviewComponent and RatingComponent later
// For now, use basic display

const ProductScreen = () => {
  const { id } = useParams() // Get the product ID from the URL
  const navigate = useNavigate() // For redirecting to the cart
  const dispatch = useDispatch()

  const [qty, setQty] = useState(1) // State for quantity selector

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(id))
  }, [dispatch, id])

  // Handler for "Add to Cart" button
  const addToCartHandler = () => {
    // Redirect to /cart/:id?qty=X
    navigate(`/cart/${id}?qty=${qty}`) 
  }

  return (
    <div className="py-8 container mx-auto px-4">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Go Back
      </Link>

      {loading ? (
        <div className="text-center text-xl text-blue-600">Loading product details...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Product Image */}
          <div className="lg:col-span-1 w-[80%] mx-auto">
            <img src={product.image} alt={product.name} className="w-full object-cover rounded-lg" />
          </div>

          {/* Product Info (Center Column) */}
          <div className="lg:col-span-1 text-black border-r border-gray-200 pr-8">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">Brand: {product.brand}</p>
            <p className="text-lg text-gray-600 mb-4">Description: {product.description}</p>

            <div className="py-2 mb-4 border-t border-b border-gray-200">
              {/* Rating/Reviews Placeholder */}
              <div className="text-yellow-500 font-semibold mb-2">
                 ({product.rating} / 5 Stars) from {product.numReviews} Reviews
              </div>
              <div className="text-2xl font-bold text-gray-900">${product.price}</div>
            </div>

            
          </div>

          {/* Add to Cart/Status Card (Right Column) */}
          <div className="lg:col-span-1 text-black">
            <div className="border border-gray-300 rounded-lg p-6 shadow-md">
              <div className="flex justify-between  items-center pb-3 mb-3 border-b border-gray-200">
                <span className="font-semibold text-lg">Price:</span>
                <span className="font-bold text-xl">${product.price}</span>
              </div>
              <div className="flex justify-between  items-center pb-3 mb-3 border-b border-gray-200">
                <span className="font-semibold text-lg">Status:</span>
                <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="flex justify-between  items-center pb-4">
                  <span className="font-semibold text-lg">Qty:</span>
                  <select
                    className="p-2 border bg-white border-gray-300 rounded"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {/* Generate options up to the stock count */}
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={addToCartHandler}
                className={`w-full py-3 rounded text-white font-bold transition duration-150 ${product.countInStock === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={product.countInStock === 0 || loading}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
        // Review Section Placeholder will go here later
      )}
    </div>
  )
}

export default ProductScreen