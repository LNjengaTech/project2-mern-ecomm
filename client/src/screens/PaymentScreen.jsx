// /client/src/screens/PaymentScreen.jsx (UPDATED)

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 🛡️ Redirect if shipping address is missing
  if (!shippingAddress.address) {
    navigate('/shipping')
  }

  // 🔑 Set initial state to the saved method, or 'PayPal' if none is saved
  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'PayPal')

  const submitHandler = (e) => {
    e.preventDefault()
    // 🔑 Dispatch the selected payment method
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder') 
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-5xl">
        <CheckoutSteps step1 step2 step3 />

        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Method</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">Select Method</label>
              
              {/* 1. PayPal Option (Corrected) */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="paypal" className="ml-3 block text-base font-medium text-gray-700">
                  PayPal or Credit Card
                </label>
              </div>
              
              {/* 🔑 2. Payment on Delivery Option (NEW) */}
              <div className="flex items-center">
                <input 
                  type="radio"
                  id="pod" // 🔑 Use a unique ID
                  name="paymentMethod"
                  value="Payment on Delivery" // 🔑 Set the unique value for backend tracking
                  checked={paymentMethod === 'Payment on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <label htmlFor="pod" className="ml-3 block text-base font-medium text-gray-700">
                  Payment on Delivery (Cash/M-Pesa)
                </label>
              </div>

            </div>
            
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 border-none text-white font-bold py-4 px-4 rounded transition duration-150"
            >
              Continue to Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentScreen