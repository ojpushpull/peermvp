import { NextRequest, NextResponse } from 'next/server'
import { runAllScrapers, archiveOldJobs } from '@/lib/scrapers/scheduler'

/**
 * Cron endpoint to run scrapers automatically
 *
 * This endpoint should be called by:
 * - Vercel Cron Jobs (recommended for production)
 * - External cron service (cron-job.org, etc.)
 * - Manual trigger for testing
 *
 * Vercel Cron configuration (add to vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/scrape",
 *     "schedule": "0 */6 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron sends a special header)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // In production, verify the cron secret
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret) {
        return NextResponse.json(
          { success: false, error: 'CRON_SECRET not configured' },
          { status: 500 }
        )
      }

      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    console.log('[Cron] Starting scheduled scraper run...')

    // Run all scrapers
    const scraperResult = await runAllScrapers()

    // Archive old jobs
    const archivedCount = await archiveOldJobs(90)

    console.log('[Cron] Scraper run completed successfully')

    return NextResponse.json({
      success: true,
      data: {
        scraperResult,
        archivedJobs: archivedCount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[Cron] Scraper run failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0
