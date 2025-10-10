import Hero from '@/app/components/Hero'
import Features from '@/app/components/Features'
import SearchBar from '@/components/SearchBar'
import JobCard from '@/components/JobCard'
import Link from 'next/link'
import { prisma } from '@/lib/db'

async function getFeaturedJobs() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
      },
      take: 6,
      orderBy: {
        scrapedAt: 'desc',
      },
    })
    return jobs
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    return []
  }
}

async function getJobStats() {
  try {
    const [totalJobs, sources] = await Promise.all([
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.groupBy({
        by: ['source'],
        where: { isActive: true },
        _count: true,
      }),
    ])
    return {
      totalJobs,
      totalSources: sources.length,
    }
  } catch (error) {
    console.error('Error fetching job stats:', error)
    return { totalJobs: 0, totalSources: 0 }
  }
}

export default async function Homepage() {
  const featuredJobs = await getFeaturedJobs()
  const stats = await getJobStats()

  const quickFilters = [
    { label: 'Remote Jobs', href: '/jobs?jobType=Remote', icon: '💻' },
    { label: 'CRPA Required', href: '/jobs?certification=CRPA', icon: '📋' },
    { label: 'Full-time', href: '/jobs?jobType=Full-time', icon: '⏰' },
    { label: 'Substance Use', href: '/jobs?specialty=Substance%20Use', icon: '🏥' },
    { label: 'Mental Health', href: '/jobs?specialty=Mental%20Health', icon: '🧠' },
  ]

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Search Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Next Opportunity
            </h2>
            <p className="text-gray-600">
              Search from {stats.totalJobs}+ peer support jobs across NYC
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar placeholder="Search by job title, company, or keywords..." />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter, idx) => (
              <Link
                key={idx}
                href={filter.href}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-full text-sm font-medium transition-colors"
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">{stats.totalJobs}+</div>
              <div className="text-blue-100">Active Job Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{stats.totalSources}</div>
              <div className="text-blue-100">Job Sources</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Updated Daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Recent Job Postings</h2>
                <p className="mt-2 text-gray-600">Latest opportunities for peer support professionals</p>
              </div>
              <Link
                href="/jobs"
                className="hidden md:inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Jobs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job as any} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Jobs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Features />
    </main>
  )
}