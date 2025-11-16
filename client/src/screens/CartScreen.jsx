// /client/src/screens/CartScreen.jsx

import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = () => {
  const { id } = useParams() // Product ID from the URL param: /cart/:id?
  const location = useLocation() // Used to get query params (?qty=X)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Calculate the quantity from the URL query string
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    // If an ID exists in the URL, dispatch the addToCart action
    if (id) {
      dispatch(addToCart(id, qty))
    }
  }, [dispatch, id, qty])

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const checkoutHandler = () => {
    // If the user is logged in, navigate to shipping. If not, navigate to login.
    // We'll update this logic after implementing login in Phase 3.5
    navigate('/login?redirect=/shipping')
  }

  return (
    <div className="py-8 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-3">
          {cartItems.length === 0 ? (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
              Your cart is empty. <Link to="/" className="font-bold hover:underline">Go Back</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center bg-white p-4 shadow-md rounded-lg">
                  <div className="w-16 h-16 mr-4">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>

                  {/* Name Link */}
                  <Link to={`/product/${item.product}`} className="flex-grow text-lg font-semibold text-blue-600 hover:text-blue-800">
                    {item.name}
                  </Link>

                  {/* Price */}
                  <div className="w-20 text-center font-bold text-gray-800">${item.price}</div>

                  {/* Quantity Selector */}
                  <div className="w-28 text-center">
                    <select
                      className="p-2 border border-gray-300 rounded"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {/* Generate options up to the stock count */}
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="ml-4 p-2 text-red-600 hover:text-red-800 transition duration-150"
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtotal Card (Order Summary) */}
        <div className="lg:col-span-1">
          <div className="border border-gray-300 rounded-lg p-6 shadow-xl sticky top-20">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3">Subtotal</h2>

            <div className="text-xl mb-4">
              {/* Calculate total items */}
              Items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </div>

            <div className="text-2xl font-bold mb-6 text-green-700 border-t pt-3">
              {/* Calculate total price */}
              ${cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
            </div>

            <button
              type="button"
              className={`w-full py-3 rounded text-white font-bold transition duration-150 ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartScreen