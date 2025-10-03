'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({
  placeholder = 'Search jobs by title, company, or keyword...',
  className = ''
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [debouncedValue, setDebouncedValue] = useState(searchValue)

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchValue])

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue) {
      params.set('search', debouncedValue)
      params.set('page', '1') // Reset to page 1 on new search
    } else {
      params.delete('search')
    }

    // Only push if we're on the jobs page or if there's a search value
    if (debouncedValue || window.location.pathname === '/jobs') {
      router.push(`/jobs?${params.toString()}`)
    }
  }, [debouncedValue, router, searchParams])

  const handleClear = useCallback(() => {
    setSearchValue('')
    setDebouncedValue('')
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Immediately update without waiting for debounce
    setDebouncedValue(searchValue)
  }, [searchValue])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search hint */}
      {searchValue && searchValue !== debouncedValue && (
        <div className="absolute mt-2 text-sm text-gray-500">
          Searching...
        </div>
      )}
    </form>
  )
}
