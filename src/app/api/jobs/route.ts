import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

import { JobFilterSchema } from '@/types/job';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());

  const validation = JobFilterSchema.safeParse(queryParams);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: validation.error.flatten() }, { status: 400 });
  }

  const { page, limit, search, ...filters } = validation.data;

  const where: any = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  for (const key in filters) {
    if (filters[key as keyof typeof filters]) {
      where[key] = filters[key as keyof typeof filters];
    }
  }

  try {
    const [jobs, totalJobs] = await prisma.$transaction([
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          postedDate: 'desc',
        },
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(totalJobs / limit);

    return NextResponse.json({
      jobs,
      metadata: {
        totalJobs,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

import { IndeedScraper } from '@/lib/scrapers/indeed';

export async function POST(request: Request) {
  try {
    // TODO: Add authentication to protect this endpoint
    console.log('Manual scrape triggered.');

    const scraper = new IndeedScraper();
    const result = await scraper.scrape();

    console.log('Scrape finished.', result);

    return NextResponse.json({ message: 'Scrape completed successfully', result });
  } catch (error) {
    console.error('Failed to trigger scrape:', error);
    return NextResponse.json({ error: 'Failed to trigger scrape' }, { status: 500 });
  }
}