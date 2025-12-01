// /client/src/components/OrderConfirmedBanner.jsx

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const OrderConfirmedBanner = () => {
  return (
    <div className='bg-gray-50 border-4 border-dashed border-yellow-600 text-green-900 px-4 py-3 shadow-md mb-8' role='alert'>
      <div className='flex flex-col items-center justify-center'>
        <div className='py-1 mr-3'>
          <FontAwesomeIcon icon={faCheckCircle} className='text-yellow-600 w-20 h-20 text-3xl' />
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-2xl'>Your order is completed!</h2>
          <p className='text-lg'>Thank you. Your order has been received and is being processed.</p>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmedBanner