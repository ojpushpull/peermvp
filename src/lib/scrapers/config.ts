import { JobSource } from '@/types/job'

export interface ScraperConfig {
  source: JobSource
  baseUrl: string
  searchKeywords: string[]
  searchLocations: string[]
  maxPages: number
  rateLimit: number // milliseconds between requests
  selectors: {
    jobCard?: string
    title?: string
    company?: string
    location?: string
    salary?: string
    description?: string
    url?: string
    postedDate?: string
    nextPage?: string
  }
}

// Search keywords for peer support roles
const PEER_SEARCH_KEYWORDS = [
  'peer specialist',
  'peer advocate',
  'recovery coach',
  'certified recovery peer advocate',
  'peer counselor',
  'peer support specialist',
]

// NYC locations to search
const NYC_LOCATIONS = [
  'New York, NY',
  'Brooklyn, NY',
  'Manhattan, NY',
  'Queens, NY',
  'Bronx, NY',
  'Staten Island, NY',
]

// Indeed scraper configuration
export const INDEED_CONFIG: ScraperConfig = {
  source: 'Indeed',
  baseUrl: 'https://www.indeed.com',
  searchKeywords: PEER_SEARCH_KEYWORDS,
  searchLocations: NYC_LOCATIONS,
  maxPages: 3, // MVP limit
  rateLimit: 2000, // 2 seconds between requests
  selectors: {
    jobCard: '.job_seen_beacon',
    title: 'h2.jobTitle',
    company: '[data-testid="company-name"]',
    location: '[data-testid="text-location"]',
    salary: '.salary-snippet',
    description: '#jobDescriptionText',
    url: 'h2.jobTitle a',
    postedDate: '.date',
    nextPage: '[data-testid="pagination-page-next"]',
  },
}

// LinkedIn scraper configuration
export const LINKEDIN_CONFIG: ScraperConfig = {
  source: 'LinkedIn',
  baseUrl: 'https://www.linkedin.com',
  searchKeywords: PEER_SEARCH_KEYWORDS,
  searchLocations: NYC_LOCATIONS,
  maxPages: 2,
  rateLimit: 3000, // 3 seconds (LinkedIn is more strict)
  selectors: {
    jobCard: '.job-search-card',
    title: '.job-search-card__title',
    company: '.job-search-card__company-name',
    location: '.job-search-card__location',
    salary: '.job-search-card__salary-info',
    description: '.description__text',
    url: '.job-search-card__title-link',
    postedDate: '.job-search-card__listdate',
  },
}

// HealthcareJobSite scraper configuration
export const HEALTHCAREJOBSITE_CONFIG: ScraperConfig = {
  source: 'HealthcareJobSite',
  baseUrl: 'https://www.healthcarejobsite.com',
  searchKeywords: PEER_SEARCH_KEYWORDS,
  searchLocations: NYC_LOCATIONS,
  maxPages: 3,
  rateLimit: 1500,
  selectors: {
    // These will need to be updated based on actual site structure
    jobCard: '.job-listing',
    title: '.job-title',
    company: '.company-name',
    location: '.job-location',
    salary: '.salary',
    description: '.job-description',
    url: '.job-title a',
    postedDate: '.posted-date',
  },
}

// User agent for requests
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Scraper configurations map
export const SCRAPER_CONFIGS: Record<JobSource, ScraperConfig | null> = {
  Indeed: INDEED_CONFIG,
  LinkedIn: LINKEDIN_CONFIG,
  HealthcareJobSite: HEALTHCAREJOBSITE_CONFIG,
  BehavioralHealthJobs: null, // To be implemented
}
