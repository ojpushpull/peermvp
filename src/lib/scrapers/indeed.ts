import { BaseScraper } from './base'
import { JobCreate } from '@/types/job'
import { INDEED_CONFIG } from './config'
import { formatSalary, parseDate, extractCertifications, sleep, formatLocation } from '@/lib/utils'

export class IndeedScraper extends BaseScraper {
  constructor() {
    super(INDEED_CONFIG)
  }

  /**
   * Scrape jobs for a specific keyword and location
   */
  protected async scrapeSearch(keyword: string, location: string): Promise<JobCreate[]> {
    const jobs: JobCreate[] = []
    const encodedKeyword = encodeURIComponent(keyword)
    const encodedLocation = encodeURIComponent(location)

    this.log(`Scraping: ${keyword} in ${location}`)

    for (let page = 0; page < this.config.maxPages; page++) {
      try {
        const start = page * 10 // Indeed uses start parameter for pagination
        const url = `${this.config.baseUrl}/jobs?q=${encodedKeyword}&l=${encodedLocation}&start=${start}`

        this.log(`Navigating to page ${page + 1}: ${url}`)
        await this.navigateWithRetry(url)

        // Wait for job cards to load
        await this.page!.waitForSelector(this.config.selectors.jobCard!, {
          timeout: 10000,
        }).catch(() => {
          this.log('No job cards found on this page')
        })

        // Get all job card elements
        const jobCards = await this.page!.$$(this.config.selectors.jobCard!)

        if (jobCards.length === 0) {
          this.log('No more jobs found, stopping pagination')
          break
        }

        this.log(`Found ${jobCards.length} job cards on page ${page + 1}`)

        // Parse each job card
        for (const card of jobCards) {
          try {
            const job = await this.parseJob(card)
            if (job) {
              jobs.push(job)
            }
          } catch (error) {
            this.log(`Error parsing job card: ${(error as Error).message}`)
          }
        }

        // Rate limiting between pages
        await sleep(this.config.rateLimit)
      } catch (error) {
        this.log(`Error on page ${page + 1}: ${(error as Error).message}`)
        break
      }
    }

    this.log(`Scraped ${jobs.length} jobs for "${keyword}" in ${location}`)
    return jobs
  }

  /**
   * Parse a single job card element
   */
  protected async parseJob(element: any): Promise<JobCreate | null> {
    try {
      // Extract basic info
      const title = await this.extractText(element, this.config.selectors.title!)
      const company = await this.extractText(element, this.config.selectors.company!)
      const location = await this.extractText(element, this.config.selectors.location!)
      const salary = await this.extractText(element, this.config.selectors.salary!)
      const postedDateText = await this.extractText(element, this.config.selectors.postedDate!)

      // Extract job URL
      const urlElement = await element.$(this.config.selectors.url!)
      const relativeUrl = urlElement
        ? await urlElement.evaluate((el: Element) => el.getAttribute('href'))
        : null

      if (!title || !company || !relativeUrl) {
        return null
      }

      const fullUrl = relativeUrl.startsWith('http')
        ? relativeUrl
        : `${this.config.baseUrl}${relativeUrl}`

      // Navigate to job detail page to get full description
      const description = await this.getJobDescription(fullUrl)

      if (!description) {
        return null
      }

      // Process data
      const formattedSalary = formatSalary(salary)
      const postedDate = parseDate(postedDateText)
      const certifications = extractCertifications(description)
      const formattedLocation = formatLocation(location || 'New York, NY')

      // Determine job type from title/description
      const jobType = this.determineJobType(title, description)

      // Determine specialty from description
      const specialty = this.determineSpecialty(description)

      const job: JobCreate = {
        title,
        company,
        location: formattedLocation,
        salary: formattedSalary,
        description,
        url: fullUrl,
        source: 'Indeed',
        jobType,
        certificationsReq: certifications,
        specialty,
        postedDate,
        isActive: true,
      }

      return job
    } catch (error) {
      this.log(`Error parsing job: ${(error as Error).message}`)
      return null
    }
  }

  /**
   * Get full job description from detail page
   */
  private async getJobDescription(url: string): Promise<string | null> {
    try {
      // Open new page for job details
      const detailPage = await this.browser!.newPage()
      await detailPage.setUserAgent(this.config.baseUrl)

      await detailPage.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 15000,
      })

      // Wait for description
      await detailPage.waitForSelector(this.config.selectors.description!, {
        timeout: 5000,
      })

      const description = await detailPage.$eval(
        this.config.selectors.description!,
        (el: Element) => el.textContent
      )

      await detailPage.close()

      return description ? description.trim() : null
    } catch (error) {
      this.log(`Error getting job description from ${url}: ${(error as Error).message}`)
      return null
    }
  }

  /**
   * Determine job type from title and description
   */
  private determineJobType(title: string, description: string): string | null {
    const combined = `${title} ${description}`.toLowerCase()

    if (combined.includes('full-time') || combined.includes('full time')) {
      return 'Full-time'
    }
    if (combined.includes('part-time') || combined.includes('part time')) {
      return 'Part-time'
    }
    if (combined.includes('contract')) {
      return 'Contract'
    }
    if (combined.includes('temporary') || combined.includes('temp')) {
      return 'Temporary'
    }
    if (combined.includes('remote')) {
      return 'Remote'
    }

    return 'Full-time' // Default
  }

  /**
   * Determine specialty from description
   */
  private determineSpecialty(description: string): string | null {
    const lower = description.toLowerCase()

    if (lower.includes('substance use') || lower.includes('substance abuse') || lower.includes('addiction')) {
      return 'Substance Use'
    }
    if (lower.includes('mental health') || lower.includes('psychiatric')) {
      return 'Mental Health'
    }
    if (lower.includes('dual diagnosis') || lower.includes('co-occurring')) {
      return 'Dual Diagnosis'
    }
    if (lower.includes('youth') || lower.includes('adolescent') || lower.includes('child')) {
      return 'Youth Services'
    }
    if (lower.includes('veteran') || lower.includes('military')) {
      return 'Veterans Services'
    }
    if (lower.includes('lgbtq') || lower.includes('lgbt')) {
      return 'LGBTQ+ Services'
    }

    return 'General Peer Support'
  }
}
