// /client/src/screens/PlaceOrderScreen.jsx

import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)

  // Helper function to add decimals correctly
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  // Calculate Prices
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  // Shipping: Free if over $100, otherwise $10
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10) 
  // Tax: 15%
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))

  // Total Price
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)


  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error, loading } = orderCreate // Added loading here

  useEffect(() => {
    // 🔑 1. HIGH PRIORITY: Handle Order Creation Success
    if (success) {
      // Navigate to the order detail screen
      navigate(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
      // 🔑 CRITICAL: Use return to prevent the rest of the hook from running 
      // when a successful order has just occurred.
      return 
    }
    
    // 🛡️ 2. LOW PRIORITY: Redirect if prerequisites are missing
    // This check should ONLY run on component load or if the user navigates here directly, 
    // NOT immediately after a successful order.
    // if (cart.cartItems.length === 0 || !cart.paymentMethod) {
    //   navigate('/cart')
    // }
  // The cart object is a necessary dependency here, but be aware of its side effects
  }, [navigate, success, order, cart, dispatch])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        // Pass prices as Numbers (although we pass them as strings from calculation)
        itemsPrice: Number(cart.itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(cart.totalPrice),
      })
    )
  }

  return (
    <div className="py-10 text-black container mx-auto px-4">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Order Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Details */}
          <div className=" border-gray-300 p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Address:</strong>{' '}{cart.shippingAddress.phone} - {cart.shippingAddress.address}, {' '}{cart.shippingAddress.postalCode}, {cart.shippingAddress.county}, {cart.shippingAddress.town}
              
            </p>
          </div>

          {/* Payment Details */}
          <div className=" border-gray-300 p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payment</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Method:</strong> {cart.paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className=" border-gray-300 p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Items</h2>
            {cart.cartItems.length === 0 ? (
              <div className="text-red-500">Your cart is empty</div>
            ) : (
              <ul className="space-y-4">
                {cart.cartItems.map((item) => (
                  <li key={item.product} className="flex justify-between items-center border-b last:border-b-0 py-2">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                      <Link to={`/product/${item.product}`} className="font-medium text-blue-600 hover:underline">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Column 3: Order Summary and Place Order Button */}
        <div className="lg:col-span-1">
          <div className="border border-gray-300 p-6 shadow-xl sticky top-20">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-center">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Tax (15%):</span>
                <span>${cart.taxPrice}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total:</span>
                <span className="text-green-700">${cart.totalPrice}</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                {error}
              </div>
            )}
            {loading && <div className="text-center text-blue-600 my-4">Placing Order...</div>}

            <button
              type="button"
              onClick={placeOrderHandler}
              className={`w-full py-4 rounded text-white font-bold transition duration-150 ${cart.cartItems.length === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'border-none bg-black hover:bg-gray-800'}`}
              disabled={cart.cartItems.length === 0 || loading}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen