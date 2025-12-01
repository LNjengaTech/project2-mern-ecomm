import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Tailwind classes for link styles
  const activeClass = 'text-black font-bold border-b-2 border-black pb-1 hover:text-blue-500 ';
  const inactiveClass = 'text-gray-500 hover:text-blue-500'

  return (
    <div className="flex justify-between items-center w-full mb-6 border-b border-gray-300">
      {/* Step 1: Login */}
      <div className="flex-1 text-center pb-2">
        {step1 ? (
          <Link to="/login" className={activeClass}>1. Sign In <span><FontAwesomeIcon icon={faCheck} className="ml-2 text-green-500" /></span></Link>
        ) : (
          <span className={inactiveClass}>1. Sign In</span>
        )}
      </div>

      {/* Step 2: Shipping */}
      <div className="flex-1 text-center pb-2">
        {step2 ? (
          <Link to="/shipping" className={activeClass}>2. Shipping <span><FontAwesomeIcon icon={faCheck} className="ml-2 text-green-500" /></span></Link>
        ) : (
          <span className={inactiveClass}>2. Shipping</span>
        )}
      </div>

      {/* Step 3: Payment */}
      <div className="flex-1 text-center pb-2">
        {step3 ? (
          <Link to="/payment" className={activeClass}>3. Payment <span><FontAwesomeIcon icon={faCheck} className="ml-2 text-green-500" /></span></Link>
        ) : (
          <span className={inactiveClass}>3. Payment</span>
        )}
      </div>

      {/* Step 4: Place Order */}
      <div className="flex-1 text-center pb-2">
        {step4 ? (
          <Link to="/placeorder" className={activeClass}>4. Place Order <span><FontAwesomeIcon icon={faCheck} className="ml-2 text-green-500" /></span></Link>
        ) : (
          <span className={inactiveClass}>4. Place Order</span>
        )}
      </div>
    </div>
  )
}

export default CheckoutSteps