// /client/src/screens/ShippingScreen.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/cartActions'
// Helper component to show checkout steps (will be defined next)
import CheckoutSteps from '../components/CheckoutSteps' 

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  // Use default values from state if they exist
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment') // Go to the next step
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <CheckoutSteps step1 step2 /> {/* step1=Login, step2=Shipping */}

        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shipping</h1>

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Address Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
              <input type="text" id="address" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} className="shadow border rounded w-full py-2 px-3 bg-white text-gray-800" required />
            </div>
            {/* City Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
              <input type="text" id="city" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} className="shadow border rounded w-full py-2 px-3 bg-white text-gray-800" required />
            </div>
            {/* Postal Code Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="shadow border rounded w-full py-2 px-3 bg-white text-gray-800" required />
            </div>
            {/* Country Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Country</label>
              <input type="text" id="country" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} className="shadow border rounded w-full py-2 px-3 bg-white text-gray-800" required />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShippingScreen