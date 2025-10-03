'use client'

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  const widthStyles = fullWidth ? 'w-full' : ''
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'

  return (
    <div className={widthStyles}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${widthStyles} ${errorStyles} ${className}`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
