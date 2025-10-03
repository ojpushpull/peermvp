import { Suspense } from 'react'
import JobCard from '@/components/JobCard'
import SearchBar from '@/components/SearchBar'
import JobFilters from '@/components/JobFilters'
import { Job } from '@/types/job'

interface SearchParams {
  page?: string
  search?: string
  location?: string
  jobType?: string
  specialty?: string
  certification?: string
  source?: string
}

interface JobsPageProps {
  searchParams: SearchParams
}

async function fetchJobs(searchParams: SearchParams) {
  const params = new URLSearchParams()

  if (searchParams.page) params.set('page', searchParams.page)
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.location) params.set('location', searchParams.location)
  if (searchParams.jobType) params.set('jobType', searchParams.jobType)
  if (searchParams.specialty) params.set('specialty', searchParams.specialty)
  if (searchParams.certification) params.set('certification', searchParams.certification)
  if (searchParams.source) params.set('source', searchParams.source)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/jobs?${params.toString()}`

  const response = await fetch(url, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return response.json()
}

function JobsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your search criteria or filters.
      </p>
    </div>
  )
}

async function JobsList({ searchParams }: JobsPageProps) {
  const data = await fetchJobs(searchParams)

  if (!data.success) {
    throw new Error(data.error || 'Failed to load jobs')
  }

  const { jobs, pagination } = data.data
  const currentPage = pagination.page

  if (jobs.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {jobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {currentPage > 1 && (
          <a
            href={`/jobs?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) }).toString()}`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </a>
        )}

        <span className="text-sm text-gray-700">
          Page {currentPage} of {pagination.totalPages} ({pagination.total} jobs)
        </span>

        {pagination.hasMore && (
          <a
            href={`/jobs?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) }).toString()}`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Next
          </a>
        )}
      </div>
    </>
  )
}

export default function JobsPage({ searchParams }: JobsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Peer Support Job Opportunities
          </h1>
          <p className="mt-2 text-gray-600">
            Find recovery peer advocate and peer specialist positions across NYC
          </p>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<JobsLoading />}>
              <JobsList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}