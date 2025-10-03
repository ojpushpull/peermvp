'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { JOB_TYPES, CERTIFICATIONS, SPECIALTIES, JOB_SOURCES } from '@/types/job'

interface JobFiltersProps {
  isMobile?: boolean
}

export default function JobFilters({ isMobile = false }: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(!isMobile)

  const currentFilters = {
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    specialty: searchParams.get('specialty') || '',
    certification: searchParams.get('certification') || '',
    source: searchParams.get('source') || '',
  }

  const hasActiveFilters = Object.values(currentFilters).some(value => value !== '')
  const activeFilterCount = Object.values(currentFilters).filter(value => value !== '').length

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
      params.set('page', '1') // Reset to page 1 when filtering
    } else {
      params.delete(key)
    }

    router.push(`/jobs?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('location')
    params.delete('jobType')
    params.delete('specialty')
    params.delete('certification')
    params.delete('source')
    params.set('page', '1')

    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={currentFilters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="Manhattan">Manhattan, NY</option>
              <option value="Brooklyn">Brooklyn, NY</option>
              <option value="Queens">Queens, NY</option>
              <option value="Bronx">Bronx, NY</option>
              <option value="Staten Island">Staten Island, NY</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              value={currentFilters.jobType}
              onChange={(e) => updateFilter('jobType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <select
              value={currentFilters.specialty}
              onChange={(e) => updateFilter('specialty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Certification Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification
            </label>
            <select
              value={currentFilters.certification}
              onChange={(e) => updateFilter('certification', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Certifications</option>
              {CERTIFICATIONS.map((cert) => (
                <option key={cert} value={cert}>
                  {cert}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Source
            </label>
            <select
              value={currentFilters.source}
              onChange={(e) => updateFilter('source', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              {JOB_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
