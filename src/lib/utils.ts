import { PEER_SUPPORT_KEYWORDS } from '@/types/job'

/**
 * Format salary string to a consistent format
 */
export function formatSalary(salary: string | null | undefined): string | null {
  if (!salary) return null

  // Remove extra whitespace
  const cleaned = salary.trim().replace(/\s+/g, ' ')

  // Common patterns
  const patterns = [
    /\$[\d,]+(?:\.\d{2})?\s*-\s*\$[\d,]+(?:\.\d{2})?/i, // $50,000 - $60,000
    /\$[\d,]+(?:\.\d{2})?/i, // $50,000
    /[\d,]+(?:\.\d{2})?\s*-\s*[\d,]+(?:\.\d{2})?/i, // 50000 - 60000
  ]

  for (const pattern of patterns) {
    const match = cleaned.match(pattern)
    if (match) return match[0]
  }

  return cleaned
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null

  const cleaned = dateString.toLowerCase().trim()

  // Handle relative dates
  if (cleaned.includes('today') || cleaned.includes('just posted')) {
    return new Date()
  }

  if (cleaned.includes('yesterday')) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday
  }

  // Handle "X days ago"
  const daysMatch = cleaned.match(/(\d+)\s*day[s]?\s*ago/)
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10)
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  }

  // Handle "X weeks ago"
  const weeksMatch = cleaned.match(/(\d+)\s*week[s]?\s*ago/)
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1], 10)
    const date = new Date()
    date.setDate(date.getDate() - (weeks * 7))
    return date
  }

  // Handle "X months ago"
  const monthsMatch = cleaned.match(/(\d+)\s*month[s]?\s*ago/)
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10)
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date
  }

  // Try parsing as standard date
  try {
    const parsed = new Date(dateString)
    return isNaN(parsed.getTime()) ? null : parsed
  } catch {
    return null
  }
}

/**
 * Extract certifications from job description
 */
export function extractCertifications(text: string): string[] {
  if (!text) return []

  const certifications: string[] = []
  const lowerText = text.toLowerCase()

  const certPatterns = [
    { pattern: /crpa|certified recovery peer advocate/i, cert: 'CRPA' },
    { pattern: /\bcps\b|certified peer specialist/i, cert: 'CPS' },
    { pattern: /cprs|certified peer recovery specialist/i, cert: 'CPRS' },
    { pattern: /\bcrs\b|certified recovery specialist/i, cert: 'CRS' },
    { pattern: /casac|credentialed alcoholism and substance abuse counselor/i, cert: 'CASAC' },
  ]

  for (const { pattern, cert } of certPatterns) {
    if (pattern.test(lowerText)) {
      certifications.push(cert)
    }
  }

  return [...new Set(certifications)] // Remove duplicates
}

/**
 * Detect if job title/description matches peer support keywords
 */
export function isPeerSupportJob(title: string, description?: string): boolean {
  const combinedText = `${title} ${description || ''}`.toLowerCase()

  return PEER_SUPPORT_KEYWORDS.some(keyword =>
    combinedText.includes(keyword.toLowerCase())
  )
}

/**
 * Calculate similarity between two strings (for duplicate detection)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  if (s1 === s2) return 1.0

  // Simple Jaccard similarity using word tokens
  const words1 = new Set(s1.split(/\s+/))
  const words2 = new Set(s2.split(/\s+/))

  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

/**
 * Check if two jobs are duplicates
 */
export function isDuplicate(
  job1: { title: string; company: string; url?: string },
  job2: { title: string; company: string; url?: string }
): boolean {
  // Exact URL match
  if (job1.url && job2.url && job1.url === job2.url) {
    return true
  }

  // High similarity in title and same company
  const titleSimilarity = calculateSimilarity(job1.title, job2.title)
  const companySame = job1.company.toLowerCase().trim() === job2.company.toLowerCase().trim()

  return titleSimilarity > 0.8 && companySame
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim()
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format job location
 */
export function formatLocation(location: string): string {
  if (!location) return 'Location Not Specified'

  const cleaned = cleanText(location)

  // Add "NY" if location is in NYC but doesn't specify state
  if (/(brooklyn|manhattan|queens|bronx|staten island)/i.test(cleaned) && !/\bny\b/i.test(cleaned)) {
    return `${cleaned}, NY`
  }

  return cleaned
}

/**
 * Retry wrapper for async functions
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delay?: number } = {}
): Promise<T> {
  const { attempts = 3, delay = 1000 } = options

  let lastError: Error | undefined

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < attempts - 1) {
        // Exponential backoff
        await sleep(delay * Math.pow(2, i))
      }
    }
  }

  throw lastError
}
