import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { JobFilterSchema } from '@/types/job'
import { IndeedScraper } from '@/lib/scrapers/indeed'
import { Prisma } from '@prisma/client'

/**
 * GET /api/jobs
 * Fetch jobs with filtering, pagination, and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const filterParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
      location: searchParams.get('location') || undefined,
      jobType: searchParams.get('jobType') || undefined,
      specialty: searchParams.get('specialty') || undefined,
      certification: searchParams.get('certification') || undefined,
      source: searchParams.get('source') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const filters = JobFilterSchema.parse(filterParams)

    // Build Prisma where clause
    const where: Prisma.JobWhereInput = {
      isActive: true,
    }

    // Location filter
    if (filters.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive',
      }
    }

    // Job type filter
    if (filters.jobType) {
      where.jobType = filters.jobType
    }

    // Specialty filter
    if (filters.specialty) {
      where.specialty = {
        contains: filters.specialty,
        mode: 'insensitive',
      }
    }

    // Certification filter
    if (filters.certification) {
      where.certificationsReq = {
        has: filters.certification,
      }
    }

    // Source filter
    if (filters.source) {
      where.source = filters.source
    }

    // Search filter (searches title, company, and description)
    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ]
    }

    // Calculate pagination
    const skip = (filters.page - 1) * filters.limit
    const take = filters.limit

    // Execute queries
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take,
        orderBy: {
          scrapedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          salary: true,
          description: true,
          url: true,
          source: true,
          jobType: true,
          certificationsReq: true,
          specialty: true,
          postedDate: true,
          scrapedAt: true,
          updatedAt: true,
        },
      }),
      prisma.job.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / filters.limit)

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: totalCount,
          totalPages,
          hasMore: filters.page < totalPages,
        },
      },
    })
  } catch (error) {
    console.error('GET /api/jobs error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/jobs
 * Trigger manual scraping (for testing/admin use)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source = 'Indeed' } = body

    // Currently only Indeed scraper is implemented
    if (source !== 'Indeed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only Indeed scraper is currently available',
        },
        { status: 400 }
      )
    }

    // Run the scraper
    const scraper = new IndeedScraper()
    const result = await scraper.scrape()

    return NextResponse.json({
      success: true,
      data: {
        source: result.source,
        jobsScraped: result.jobsScraped,
        jobsSaved: result.jobsSaved,
        duplicatesSkipped: result.duplicatesSkipped,
        errors: result.errors,
        duration: result.duration,
        message: `Scraping completed in ${(result.duration / 1000).toFixed(2)}s`,
      },
    })
  } catch (error) {
    console.error('POST /api/jobs error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Scraping failed',
      },
      { status: 500 }
    )
  }
}
