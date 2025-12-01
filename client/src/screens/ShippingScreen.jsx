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
  const [county, setCounty] = useState(shippingAddress.county || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [town, setTown] = useState(shippingAddress.town || '')
  const [phone, setPhone] = useState(shippingAddress.phone || '')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, county, postalCode, town, phone }))
    navigate('/payment') // Go to the next step
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-5xl">
        <CheckoutSteps step1 step2 /> {/* step1=Login, step2=Shipping */}

        <div className=" p-8 shadow-xl border border-black mt-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shipping</h1>

          <form onSubmit={submitHandler} className="space-y-4">
                
                {/* 🔑 NEW: Phone Field (Placed last for contact info) */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mt-8" htmlFor="phone">Phone Number:</label>
                  <input type="text" id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded border-gray-300 w-full py-2 px-3 bg-white text-gray-800" required />
                </div>
                
                {/* Address Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mt-8" htmlFor="address">House No/Building Address:</label>
                  <input type="text" id="address" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} className="border rounded border-gray-300 w-full py-2 px-3 bg-white text-gray-800" required />
                </div>
                {/* Postal Code Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mt-8"htmlFor="postalCode">Postal Code:</label>
                  <input type="text" id="postalCode" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border rounded border-gray-300 w-full py-2 px-3 bg-white text-gray-800" required />
                </div>
                {/* County Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mt-8" htmlFor="County">County:</label>
                  <input type="text" id="County" placeholder="Enter county" value={county} onChange={(e) => setCounty(e.target.value)} className="border rounded border-gray-300 w-full py-2 px-3 bg-white text-gray-800" required />
                </div>
                
                {/* 🔑 NEW: Town Field (Placed after Address/County for flow) */}
                <div>
                  <label className="block text-gray-700 text-sm font-bold mt-8" htmlFor="town">Town/Area:</label>
                  <input type="text" id="town" placeholder="Enter town/area" value={town} onChange={(e) => setTown(e.target.value)} className="border rounded border-gray-300 w-full py-2 px-3 bg-white text-gray-800" required />
                </div>

                <button type="submit" className="w-full bg-black hover:bg-gray-800 border-none text-white font-bold py-4 px-4 rounded-none transition duration-150">
                  Continue to Payment
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default ShippingScreen