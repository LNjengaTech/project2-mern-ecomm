// /client/src/screens/PaymentScreen.jsx

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

  // 🛡️ Redirect if shipping address is missing (protected route logic)
  if (!shippingAddress.address) {
    navigate('/shipping')
  }

  // Set initial state to PayPal since it's the only option for now
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder') // Go to the final step
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <CheckoutSteps step1 step2 step3 />

        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Method</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">Select Method</label>
              
              {/* PayPal Option */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="paypal" className="ml-3 block text-base font-medium text-gray-700">
                  PayPal or Credit Card
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
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