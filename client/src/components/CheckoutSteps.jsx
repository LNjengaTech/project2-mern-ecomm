import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Tailwind classes for link styles
  const activeClass = 'text-blue-600 font-bold border-b-2 border-blue-600'
  const inactiveClass = 'text-gray-500 hover:text-blue-500'

  return (
    <div className="flex justify-between items-center w-full mb-6 border-b border-gray-300">
      {/* Step 1: Login */}
      <div className="flex-1 text-center pb-2">
        {step1 ? (
          <Link to="/login" className={activeClass}>Sign In</Link>
        ) : (
          <span className={inactiveClass}>Sign In</span>
        )}
      </div>

      {/* Step 2: Shipping */}
      <div className="flex-1 text-center pb-2">
        {step2 ? (
          <Link to="/shipping" className={activeClass}>Shipping</Link>
        ) : (
          <span className={inactiveClass}>Shipping</span>
        )}
      </div>

      {/* Step 3: Payment */}
      <div className="flex-1 text-center pb-2">
        {step3 ? (
          <Link to="/payment" className={activeClass}>Payment</Link>
        ) : (
          <span className={inactiveClass}>Payment</span>
        )}
      </div>

      {/* Step 4: Place Order */}
      <div className="flex-1 text-center pb-2">
        {step4 ? (
          <Link to="/placeorder" className={activeClass}>Place Order</Link>
        ) : (
          <span className={inactiveClass}>Place Order</span>
        )}
      </div>
    </div>
  )
}

export default CheckoutSteps