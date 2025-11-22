import React from 'react'

const Message = ({ variant, children }) => {
  // Map variant prop to specific Tailwind classes
  let classNames = ''
  switch (variant) {
    case 'danger':
      classNames = 'bg-red-100 border border-red-400 text-red-700'
      break
    case 'success':
      classNames = 'bg-green-100 border border-green-400 text-green-700'
      break
    case 'warning':
      classNames = 'bg-yellow-100 border border-yellow-400 text-yellow-700'
      break
    case 'info':
    default:
      classNames = 'bg-blue-100 border border-blue-400 text-blue-700'
      break
  }

  return (
    <div 
      className={`px-4 py-3 rounded relative my-4 ${classNames}`} 
      role='alert'
    >
      <span className='block sm:inline'>{children}</span>
    </div>
  )
}

Message.defaultProps = {
  variant: 'info',
}

export default Message