import Link from 'next/link'
import { Job } from '@/types/job'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  // Calculate if job is new (< 48 hours old)
  const isNew = job.scrapedAt
    ? new Date().getTime() - new Date(job.scrapedAt).getTime() < 48 * 60 * 60 * 1000
    : false

  // Format posted date
  const formatPostedDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Recently posted'

    const postedDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Get job type badge color
  const getJobTypeBadge = (jobType: string | null | undefined) => {
    if (!jobType) return null

    const colors: Record<string, string> = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-blue-100 text-blue-800',
      Contract: 'bg-yellow-100 text-yellow-800',
      Temporary: 'bg-purple-100 text-purple-800',
      Remote: 'bg-indigo-100 text-indigo-800',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[jobType] || 'bg-gray-100 text-gray-800'}`}>
        {jobType}
      </span>
    )
  }

  // Truncate description for preview
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
              {job.title}
            </h3>
          </div>
          {isNew && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
              NEW
            </span>
          )}
        </div>

        {/* Company and Location */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium truncate">{job.company}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="mb-4">
            <span className="text-sm font-semibold text-green-700">{job.salary}</span>
          </div>
        )}

        {/* Description Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {truncateDescription(job.description)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {job.jobType && getJobTypeBadge(job.jobType)}

          {job.specialty && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {job.specialty}
            </span>
          )}

          {job.certificationsReq && job.certificationsReq.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {job.certificationsReq[0]}
              {job.certificationsReq.length > 1 && ` +${job.certificationsReq.length - 1}`}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {formatPostedDate(job.postedDate || job.scrapedAt)}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {job.source}
          </span>
        </div>
      </div>
    </Link>
  )
}
