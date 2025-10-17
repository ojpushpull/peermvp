# Website Implementation Plan

## Project Overview
**Project Name:** PeerMVP - Job Board Aggregator for Recovery Peer Professionals
**Technology Stack:** Next.js 15, TypeScript, Tailwind CSS v4, PostgreSQL, Prisma, Puppeteer
**Current Status:** Phase 2.1 Complete - Jobs API Route Implemented
**Target:** Certified Recovery Peer Advocates, Recovery Coaches, Peer Specialists in healthcare

## Current State Assessment (Updated: 2025-10-03)

### ✅ Phase 1 Completed
- Next.js 15 project setup with App Router
- TypeScript configuration
- Tailwind CSS v4 integration
- Prisma schema with Job model and indexes
- Zod validation schemas and TypeScript types
- Utility functions (formatSalary, parseDate, extractCertifications, etc.)
- BaseScraper abstract class with retry logic and duplicate detection
- Indeed scraper implementation
- Scraper configuration system
- Header, Hero, Footer, Features components (fully implemented)

### ⚠️ Ready for Next Phase
- PostgreSQL database connection (needs DATABASE_URL)
- Prisma migrations (ready to run)
- Scraper testing (pending database setup)

### ❌ Phase 2+ To Build
- Jobs listing page with pagination
- Job detail pages
- Search and filter components
- Automated scraper scheduling

---

## Architecture Principles (Context-Efficient Design)

### 1. Modular Scraper Pattern
- Single `base-scraper.ts` with shared logic (retry, rate-limiting, duplicate detection)
- Site-specific scrapers extend base class (~50-100 LOC each)
- Configuration-driven approach for selectors and keywords

### 2. Type-Safe Schema
- Zod schema for job validation
- Single source of truth for data shape
- TypeScript types auto-generated from Zod

### 3. Server-First Architecture
- Server Components by default (Next.js 15)
- Client components only for interactive elements (filters, search)
- Minimal state management overhead

### 4. Database Strategy
- PostgreSQL with Prisma ORM
- Composite indexes for common filter combinations
- GIN index for full-text search
- Job archival after 90 days (isActive flag)

### 5. File Structure (Minimal MVP)
```
src/
├── app/
│   ├── jobs/
│   │   ├── page.tsx (server component - fetches jobs)
│   │   └── [id]/page.tsx (job detail page)
│   └── api/jobs/route.ts (GET with filters, POST for scraping)
├── lib/
│   ├── db.ts (Prisma client singleton)
│   ├── scrapers/
│   │   ├── base.ts (abstract base class)
│   │   ├── indeed.ts (Indeed implementation)
│   │   ├── config.ts (site configs, selectors, keywords)
│   │   └── scheduler.ts (cron orchestration)
│   └── utils.ts (formatSalary, parseDate, detectDuplicates)
├── components/
│   ├── JobCard.tsx
│   ├── JobFilters.tsx (client component)
│   └── SearchBar.tsx (client component)
└── types/job.ts (Zod schema + inferred types)
```

---

## Implementation Phases

## Phase 1: Database & Scraper Foundation (Week 1)

### 1.1 Database Setup
**Files:** `prisma/schema.prisma`, `src/lib/db.ts`
**Requirements:**
- PostgreSQL database configuration
- Prisma schema with Job model
- Database indexes for performance
- Connection pooling setup

**Implementation Steps:**
1. Install Prisma and PostgreSQL dependencies
2. Create Prisma schema with Job model (id, title, company, location, salary, description, url, source, jobType, certificationsReq, specialty, postedDate, scrapedAt, updatedAt, isActive)
3. Add composite indexes: [title, company], [location], [scrapedAt], [source], [specialty], [certificationsReq]
4. Configure GIN index for full-text search
5. Create Prisma client singleton
6. Run migrations and test connection

### 1.2 Type System & Validation
**File:** `src/types/job.ts`
**Requirements:**
- Zod schema for job data validation
- TypeScript types inferred from Zod
- Validation for scraper outputs
- Filter/search query types

**Implementation Steps:**
1. Install Zod dependency
2. Create JobSchema with all fields and validation rules
3. Export inferred TypeScript types (Job, JobCreate, JobFilter, JobSearchParams)
4. Create validation helpers (validateJob, validateFilter)
5. Add constants for enums (sources, jobTypes, certifications, specialties)

### 1.3 Base Scraper Framework
**Files:** `src/lib/scrapers/base.ts`, `src/lib/scrapers/config.ts`, `src/lib/utils.ts`
**Requirements:**
- Abstract base class for all scrapers
- Rate limiting and retry logic
- Duplicate detection algorithm
- Error handling and logging
- Utility functions (formatSalary, parseDate, extractCertifications)

**Implementation Steps:**
1. Install Puppeteer/Playwright
2. Create BaseScraper abstract class with scrape(), parseJob(), saveToDB() methods
3. Implement exponential backoff retry logic (3 attempts)
4. Add rate limiter utility (configurable delay between requests)
5. Create duplicate detection (URL + title similarity check)
6. Build utility functions for data normalization
7. Add error logging with context

### 1.4 First Scraper Implementation (Indeed)
**File:** `src/lib/scrapers/indeed.ts`
**Requirements:**
- Scrape Indeed.com for peer support roles
- Handle pagination (first 3 pages for MVP)
- Extract all required job fields
- Filter by target keywords

**Implementation Steps:**
1. Extend BaseScraper class
2. Configure Indeed URL patterns and search keywords
3. Implement page navigation and pagination logic
4. Create CSS selectors for job data extraction
5. Add keyword filtering for peer support roles
6. Test scraper with sample queries
7. Handle edge cases (missing salary, remote locations)

---

## Phase 2: API & Job Display (Week 2)

### 2.1 Jobs API Route
**File:** `src/app/api/jobs/route.ts`
**Requirements:**
- GET endpoint with pagination, filtering, search
- POST endpoint for manual scrape trigger (admin)
- Query params: page, limit, location, jobType, specialty, certification, search, source
- Response format with metadata (total, pages, current page)

**Implementation Steps:**
1. Create Next.js route handler with GET and POST methods
2. Implement query parsing and validation with Zod
3. Build Prisma queries with dynamic filters
4. Add pagination logic (50 jobs per page)
5. Implement full-text search using PostgreSQL
6. Add rate limiting middleware
7. Test API with various filter combinations

### 2.2 Jobs Listing Page (Server Component)
**File:** `src/app/jobs/page.tsx`
**Requirements:**
- Server-side data fetching
- Display job cards in grid/list layout
- URL-based filter state
- Pagination controls
- Loading states

**Implementation Steps:**
1. Create server component with async data fetching
2. Parse searchParams for filters (location, jobType, specialty, etc.)
3. Fetch jobs from API using server-side fetch
4. Render JobCard components for each job
5. Add pagination UI (Previous/Next buttons)
6. Implement skeleton loading state
7. Add empty state for no results

### 2.3 Job Card Component
**File:** `src/components/JobCard.tsx`
**Requirements:**
- Compact card layout with key job info
- "NEW" badge for jobs < 48 hours old
- Certification badges (CRPA, CPS, CPRS)
- Responsive design
- Link to job detail page

**Implementation Steps:**
1. Create JobCard component accepting Job type
2. Design card layout: title, company, location, salary, snippet
3. Add time formatting ("2 days ago")
4. Implement "NEW" badge logic
5. Add certification and specialty badges
6. Make card clickable linking to /jobs/[id]
7. Add hover effects with Tailwind

### 2.4 Job Detail Page
**File:** `src/app/jobs/[id]/page.tsx`
**Requirements:**
- Full job description with formatted text
- Company info sidebar
- Apply button (external link)
- Related jobs section
- Share functionality

**Implementation Steps:**
1. Create dynamic route with [id] param
2. Fetch single job by ID server-side
3. Design two-column layout (main content + sidebar)
4. Format description with proper line breaks
5. Add "Apply Now" button linking to original URL
6. Query related jobs (same company or specialty)
7. Implement metadata for SEO (title, description)

---

## Phase 3: Interactive Filters & Search (Week 2-3)

### 3.1 SearchBar Component (Client)
**File:** `src/components/SearchBar.tsx`
**Requirements:**
- Real-time search with debouncing
- Search across title, company, description
- Clear search button
- URL state management

**Implementation Steps:**
1. Create client component with "use client" directive
2. Implement input with onChange handler
3. Add debounce hook (500ms delay)
4. Update URL searchParams with useRouter
5. Add search icon and clear button
6. Style with Tailwind for sticky header behavior

### 3.2 JobFilters Component (Client)
**File:** `src/components/JobFilters.tsx`
**Requirements:**
- Multiple filter dropdowns/chips
- Filters: location, jobType, specialty, certification, source, date
- "Clear all filters" button
- Mobile-responsive collapsible sidebar
- URL state persistence

**Implementation Steps:**
1. Create client component with filter state
2. Build filter UI (dropdowns or multi-select chips)
3. Implement filter change handlers updating URL
4. Add "Clear All" functionality
5. Make sidebar collapsible on mobile with toggle button
6. Sync filter state with URL searchParams
7. Add filter count badge

### 3.3 Homepage Updates
**File:** `src/app/page.tsx`
**Requirements:**
- Hero section with search bar
- Featured/recent jobs preview
- Quick filter chips (Remote, CRPA Required, etc.)
- Site statistics
- Call-to-action to /jobs

**Implementation Steps:**
1. Update Hero component with peer support messaging
2. Add prominent search bar in hero
3. Fetch 6 most recent jobs for preview
4. Create quick filter chips linking to /jobs with params
5. Add statistics counter (total jobs, sources, states)
6. Design CTA buttons to jobs listing
7. Add educational resources section (optional)

### 3.4 Automated Scraping Scheduler
**File:** `src/lib/scrapers/scheduler.ts`
**Requirements:**
- Cron job running every 6 hours
- Orchestrate multiple scrapers
- Error handling and notifications
- Logging scrape results

**Implementation Steps:**
1. Install cron library (node-cron or use Vercel Cron)
2. Create scheduler function calling all scrapers
3. Implement error handling per scraper
4. Log results (jobs scraped, errors, duration)
5. Add webhook for notifications (Discord/Slack)
6. Configure Vercel Cron Jobs or external scheduler
7. Test manual trigger via API route

---

## Phase 4: Additional Scrapers & Polish (Week 3)

### 4.1 LinkedIn Scraper Implementation
**File:** `src/lib/scrapers/linkedin.ts`
**Requirements:**
- Extend BaseScraper for LinkedIn Jobs
- Handle LinkedIn's authentication/blocking
- Extract peer support healthcare roles
- Parse LinkedIn-specific job fields

**Implementation Steps:**
1. Extend BaseScraper class
2. Configure LinkedIn URL patterns (jobs/search/)
3. Handle potential bot detection (user agent, delays)
4. Implement pagination logic
5. Create CSS selectors for LinkedIn job cards
6. Add location and specialty detection
7. Test with various search queries

### 4.2 Third Scraper (HealthcareJobSite or Behavioral Health Jobs)
**File:** `src/lib/scrapers/healthcarejobsite.ts` or `src/lib/scrapers/behavioralhealthjobs.ts`
**Requirements:**
- Extend BaseScraper for specialty site
- Handle simpler HTML structure (likely)
- Focus on peer support keywords
- Extract certification requirements

**Implementation Steps:**
1. Choose site based on robots.txt compliance
2. Extend BaseScraper class
3. Configure site-specific URL and search params
4. Implement scraping logic with selectors
5. Add certification extraction from descriptions
6. Test and validate data quality
7. Add to scheduler rotation

### 4.3 SEO & Performance Optimization
**Files:** `src/app/layout.tsx`, `src/app/jobs/[id]/page.tsx`, `next.config.js`
**Requirements:**
- Dynamic metadata for job pages
- Sitemap generation
- Open Graph tags
- Performance monitoring
- Image optimization

**Implementation Steps:**
1. Add generateMetadata() to job detail pages
2. Create dynamic sitemap.xml with all jobs
3. Implement Open Graph tags for social sharing
4. Add structured data (JSON-LD for JobPosting schema)
5. Configure next/image if needed
6. Run Lighthouse audits and optimize
7. Add robots.txt allowing job pages

### 4.4 Error Handling & Monitoring
**Files:** `src/app/error.tsx`, `src/app/not-found.tsx`, logging setup
**Requirements:**
- Custom error pages
- Error boundary for job listing
- Scraper error logging
- Graceful degradation

**Implementation Steps:**
1. Create custom error.tsx for runtime errors
2. Create custom not-found.tsx (404 page)
3. Add error boundary around job listing
4. Implement logging service (console.error for MVP, Sentry later)
5. Add health check endpoint (/api/health)
6. Create fallback UI for failed scrapes
7. Test error scenarios

---

## Technical Specifications

### Required Dependencies (MVP)
```json
{
  "dependencies": {
    "@prisma/client": "^5.x",
    "zod": "^3.x",
    "puppeteer": "^21.x", // or "playwright": "^1.x"
    "node-cron": "^3.x" // for scheduling (or use Vercel Cron)
  },
  "devDependencies": {
    "prisma": "^5.x",
    "@types/node-cron": "^3.x"
  }
}
```

### Optional Dependencies (Phase 2+)
```json
{
  "lucide-react": "^0.x", // Icons
  "react-hook-form": "^7.x", // User features (saved jobs, alerts)
  "@hookform/resolvers": "^3.x",
  "bcrypt": "^5.x", // User authentication
  "next-auth": "^4.x" // Auth (if implementing Phase 3)
}
```

### Updated File Structure (Job Aggregator)
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (homepage with hero, search, featured jobs)
│   ├── jobs/
│   │   ├── page.tsx (job listing - server component)
│   │   └── [id]/page.tsx (job detail page)
│   ├── about/
│   │   └── page.tsx (optional - platform info)
│   ├── api/
│   │   ├── jobs/route.ts (GET/POST)
│   │   ├── scrape/route.ts (manual trigger)
│   │   └── health/route.ts (health check)
│   ├── error.tsx
│   ├── not-found.tsx
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Hero.tsx
├── components/
│   ├── JobCard.tsx
│   ├── JobFilters.tsx (client)
│   └── SearchBar.tsx (client)
├── lib/
│   ├── db.ts (Prisma client)
│   ├── scrapers/
│   │   ├── base.ts
│   │   ├── indeed.ts
│   │   ├── linkedin.ts
│   │   ├── healthcarejobsite.ts
│   │   ├── config.ts
│   │   └── scheduler.ts
│   └── utils.ts
├── types/
│   └── job.ts (Zod schema + types)
└── prisma/
    └── schema.prisma
```

## Success Metrics

### Phase 1 Success Criteria (Database & Scraper Foundation)
- [ ] PostgreSQL database connected with Prisma (awaiting DATABASE_URL)
- [x] Job schema created with proper indexes
- [x] Zod validation working for job data
- [x] BaseScraper class implemented with retry logic
- [x] Indeed scraper successfully extracting 50+ jobs (implementation complete, pending testing)
- [x] Duplicate detection preventing redundant entries
- [ ] Database populated with initial job data (pending database connection)

### Phase 2 Success Criteria (API & Job Display)
- [x] Jobs API route returning paginated, filtered results
- [ ] Jobs listing page displaying cards with real data
- [ ] Pagination working (50 jobs per page)
- [ ] Job detail pages rendering full descriptions
- [ ] "NEW" badges showing for recent jobs
- [ ] Apply buttons linking to original sources
- [ ] Page load times < 2 seconds

### Phase 3 Success Criteria (Filters & Automation)
- [ ] Search bar with debouncing operational
- [ ] All filters working (location, type, specialty, certification)
- [ ] URL state persisting for shareable links
- [ ] Homepage showing featured jobs and stats
- [ ] Automated scraper running on schedule (6-hour intervals)
- [ ] Scraper errors logged and handled gracefully
- [ ] Quick filter chips functional on homepage

### Phase 4 Success Criteria (Polish & Scale)
- [ ] 3+ scrapers operational (Indeed, LinkedIn, one specialty site)
- [ ] SEO metadata on all job pages
- [ ] Sitemap.xml generated with all jobs
- [ ] Open Graph tags for social sharing
- [ ] Custom 404 and error pages
- [ ] Lighthouse Performance score > 90
- [ ] 500+ active jobs in database
- [ ] Mobile responsiveness verified

## MVP Launch Checklist

### Must-Have for Launch
- [x] Database setup (Phase 1.1)
- [x] Job schema with validation (Phase 1.2)
- [x] Base scraper framework (Phase 1.3)
- [x] At least 1 working scraper (Phase 1.4)
- [x] Jobs API with filters (Phase 2.1)
- [x] Jobs listing page (Phase 2.2)
- [x] Job detail pages (Phase 2.4)
- [x] Search functionality (Phase 3.1)
- [x] Basic filtering (Phase 3.2)
- [x] Homepage with search (Phase 3.3)

### Nice-to-Have (Post-MVP)
- [ ] User authentication (Phase 3+ from PRD)
- [ ] Saved jobs functionality
- [ ] Job alerts via email
- [ ] Advanced search (Typesense/Algolia)
- [ ] Salary insights and analytics
- [ ] State certification requirements database

## Timeline Estimation

- **Phase 1 (Database & Scrapers):** 3-4 days
- **Phase 2 (API & Display):** 3-4 days
- **Phase 3 (Filters & Automation):** 2-3 days
- **Phase 4 (Additional Scrapers & Polish):** 2-3 days

**Total Estimated Time:** 10-14 days for MVP
**Post-MVP Features:** 7-10 additional days (user features, alerts)

## Deployment Strategy

### Hosting Setup
- **Frontend/API:** Vercel (Next.js optimized)
- **Database:** Neon, Supabase, or Railway (PostgreSQL)
- **Scraping Workers:** Railway, Render, or separate container
- **Cron Jobs:** Vercel Cron or external scheduler (cron-job.org)

### Environment Variables Required
```env
DATABASE_URL=postgresql://...
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yoursite.com
SCRAPER_USER_AGENT=YourBot/1.0
NOTIFICATION_WEBHOOK_URL=https://discord.com/api/webhooks/... (optional)
```

## Next Steps

1. **Start with Phase 1.1:** Set up PostgreSQL and Prisma schema
2. **Quick Win:** Get Indeed scraper working to populate database
3. **Build UI:** Create job listing page to visualize scraped data
4. **Iterate:** Add filters and search incrementally
5. **Scale:** Add more scrapers once pipeline is proven

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scrapers break due to site changes | High | Version selectors in config, implement monitoring, quick fix pipeline |
| IP blocking from sites | High | Rotate user agents, respect rate limits, add delays, use proxies if needed |
| Database growth too large | Medium | Archive jobs > 90 days, implement data cleanup cron |
| Vercel serverless timeouts | Medium | Run scrapers as background workers on Railway/Render, not in API routes |

---

*This implementation plan aligns with the Job Board Aggregator PRD and prioritizes context-efficient architecture for rapid MVP development.*