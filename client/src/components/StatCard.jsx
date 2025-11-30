// /client/src/components/StatCard.jsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StatCard = ({ title, value, icon, iconBgColor, iconColor, isCurrency = false }) => {
  
  // Format the currency display if needed
  const formattedValue = isCurrency 
    ? (value >= 0 ? 'Ksh. ' : '-Ksh. ') + Math.abs(value).toLocaleString() 
    : value.toLocaleString()

  return (
    <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300'>
      <div className='flex justify-between items-start'>
        
        {/* Value and Title */}
        <div>
          <h3 className='text-xs font-light text-gray-500 uppercase tracking-wider mb-2'>
            {title}
          </h3>
          <p className='text-3xl font-bold text-gray-900'>
            {formattedValue}
          </p>
        </div>
        
        {/* Icon */}
        {/* Using Font Awesome classes from the image for icons */}
        <div className={`p-3 rounded-full bg-opacity-10 text-xl`} style={{ backgroundColor: `${iconBgColor}20` }}>
          <FontAwesomeIcon icon={icon} className={`w-8 h-8 mr-4 ${iconColor}`} />
        </div>

      </div>
    </div>
  )
}

export default StatCard