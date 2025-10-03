import { IndeedScraper } from './indeed'
import { ScrapeResult } from './base'

export interface SchedulerResult {
  timestamp: Date
  results: ScrapeResult[]
  totalJobsScraped: number
  totalJobsSaved: number
  totalDuplicates: number
  totalErrors: number
  duration: number
}

/**
 * Run all active scrapers
 */
export async function runAllScrapers(): Promise<SchedulerResult> {
  const startTime = Date.now()
  const results: ScrapeResult[] = []

  console.log('[Scheduler] Starting scraper run...')

  // Run Indeed scraper
  try {
    console.log('[Scheduler] Running Indeed scraper...')
    const indeedScraper = new IndeedScraper()
    const indeedResult = await indeedScraper.scrape()
    results.push(indeedResult)
    console.log('[Scheduler] Indeed scraper completed:', indeedResult)
  } catch (error) {
    console.error('[Scheduler] Indeed scraper failed:', error)
    results.push({
      source: 'Indeed',
      jobsScraped: 0,
      jobsSaved: 0,
      duplicatesSkipped: 0,
      errors: [(error as Error).message],
      duration: 0,
    })
  }

  // Future scrapers can be added here:
  // - LinkedIn scraper
  // - HealthcareJobSite scraper
  // - etc.

  const duration = Date.now() - startTime

  const summary: SchedulerResult = {
    timestamp: new Date(),
    results,
    totalJobsScraped: results.reduce((sum, r) => sum + r.jobsScraped, 0),
    totalJobsSaved: results.reduce((sum, r) => sum + r.jobsSaved, 0),
    totalDuplicates: results.reduce((sum, r) => sum + r.duplicatesSkipped, 0),
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    duration,
  }

  console.log('[Scheduler] Scraper run completed:', summary)

  return summary
}

/**
 * Archive old jobs (mark as inactive)
 */
export async function archiveOldJobs(daysOld: number = 90): Promise<number> {
  const { prisma } = await import('@/lib/db')

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const result = await prisma.job.updateMany({
    where: {
      scrapedAt: {
        lt: cutoffDate,
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  })

  console.log(`[Scheduler] Archived ${result.count} jobs older than ${daysOld} days`)

  return result.count
}

/**
 * Get scraper statistics
 */
export async function getScraperStats() {
  const { prisma } = await import('@/lib/db')

  const [totalJobs, activeJobs, jobsBySource, recentJobs] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.job.groupBy({
      by: ['source'],
      _count: true,
      where: { isActive: true },
    }),
    prisma.job.findMany({
      where: { isActive: true },
      orderBy: { scrapedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        company: true,
        scrapedAt: true,
        source: true,
      },
    }),
  ])

  return {
    totalJobs,
    activeJobs,
    jobsBySource,
    recentJobs,
  }
}
