
import React from 'react'

const FormContainer = ({ children }) => {
  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-lg'> {/* Set a max width for the form content */}
        {children}
      </div>
    </div>
  )
}

export default FormContainer