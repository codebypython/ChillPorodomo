import React from 'react'

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl focus:ring-purple-400',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-400',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg focus:ring-green-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

