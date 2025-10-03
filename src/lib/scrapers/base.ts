import puppeteer, { Browser, Page } from 'puppeteer'
import { prisma } from '@/lib/db'
import { JobCreate, JobSource, validateJobCreate } from '@/types/job'
import { retry, sleep, isDuplicate, isPeerSupportJob, cleanText } from '@/lib/utils'
import { ScraperConfig, USER_AGENT } from './config'

export interface ScrapeResult {
  source: JobSource
  jobsScraped: number
  jobsSaved: number
  duplicatesSkipped: number
  errors: string[]
  duration: number
}

export abstract class BaseScraper {
  protected config: ScraperConfig
  protected browser: Browser | null = null
  protected page: Page | null = null
  protected errors: string[] = []

  constructor(config: ScraperConfig) {
    this.config = config
  }

  /**
   * Main scrape method - orchestrates the entire scraping process
   */
  async scrape(): Promise<ScrapeResult> {
    const startTime = Date.now()
    let jobsScraped = 0
    let jobsSaved = 0
    let duplicatesSkipped = 0

    try {
      await this.initialize()

      for (const keyword of this.config.searchKeywords) {
        for (const location of this.config.searchLocations) {
          try {
            const jobs = await this.scrapeSearch(keyword, location)
            jobsScraped += jobs.length

            const saveResult = await this.saveJobs(jobs)
            jobsSaved += saveResult.saved
            duplicatesSkipped += saveResult.duplicates

            // Rate limiting between searches
            await sleep(this.config.rateLimit)
          } catch (error) {
            const errorMsg = `Error scraping ${keyword} in ${location}: ${(error as Error).message}`
            console.error(errorMsg)
            this.errors.push(errorMsg)
          }
        }
      }
    } catch (error) {
      const errorMsg = `Fatal scraping error: ${(error as Error).message}`
      console.error(errorMsg)
      this.errors.push(errorMsg)
    } finally {
      await this.cleanup()
    }

    const duration = Date.now() - startTime

    return {
      source: this.config.source,
      jobsScraped,
      jobsSaved,
      duplicatesSkipped,
      errors: this.errors,
      duration,
    }
  }

  /**
   * Initialize browser and page
   */
  protected async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    this.page = await this.browser.newPage()
    await this.page.setUserAgent(USER_AGENT)
    await this.page.setViewport({ width: 1920, height: 1080 })
  }

  /**
   * Cleanup browser resources
   */
  protected async cleanup(): Promise<void> {
    if (this.page) await this.page.close()
    if (this.browser) await this.browser.close()
  }

  /**
   * Scrape jobs for a specific search query
   * Must be implemented by each scraper
   */
  protected abstract scrapeSearch(keyword: string, location: string): Promise<JobCreate[]>

  /**
   * Parse a single job from the page
   * Must be implemented by each scraper
   */
  protected abstract parseJob(element: any): Promise<JobCreate | null>

  /**
   * Save jobs to database with duplicate detection
   */
  protected async saveJobs(jobs: JobCreate[]): Promise<{ saved: number; duplicates: number }> {
    let saved = 0
    let duplicates = 0

    // Get existing jobs to check for duplicates
    const existingJobs = await prisma.job.findMany({
      where: {
        source: this.config.source,
        isActive: true,
      },
      select: {
        title: true,
        company: true,
        url: true,
      },
    })

    for (const job of jobs) {
      try {
        // Filter out non-peer support jobs
        if (!isPeerSupportJob(job.title, job.description)) {
          continue
        }

        // Check for duplicates
        const isDup = existingJobs.some(existing =>
          isDuplicate(
            { title: job.title, company: job.company, url: job.url },
            { title: existing.title, company: existing.company, url: existing.url }
          )
        )

        if (isDup) {
          duplicates++
          continue
        }

        // Validate and save
        const validatedJob = validateJobCreate(job)

        await retry(async () => {
          await prisma.job.create({
            data: validatedJob as any,
          })
        })

        saved++
      } catch (error) {
        const errorMsg = `Error saving job "${job.title}": ${(error as Error).message}`
        console.error(errorMsg)
        this.errors.push(errorMsg)
      }
    }

    return { saved, duplicates }
  }

  /**
   * Extract text from element with retry
   */
  protected async extractText(element: any, selector: string): Promise<string | null> {
    try {
      const el = await element.$(selector)
      if (!el) return null

      const text = await el.evaluate((node: Element) => node.textContent)
      return text ? cleanText(text) : null
    } catch {
      return null
    }
  }

  /**
   * Extract attribute from element
   */
  protected async extractAttribute(
    element: any,
    selector: string,
    attribute: string
  ): Promise<string | null> {
    try {
      const el = await element.$(selector)
      if (!el) return null

      const attr = await el.evaluate((node: Element, attr: string) =>
        node.getAttribute(attr), attribute
      )
      return attr ? cleanText(attr) : null
    } catch {
      return null
    }
  }

  /**
   * Navigate to URL with retry
   */
  protected async navigateWithRetry(url: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized')

    await retry(async () => {
      await this.page!.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      })
    })
  }

  /**
   * Log scraping progress
   */
  protected log(message: string): void {
    console.log(`[${this.config.source}] ${message}`)
  }
}
