# Product Requirements Document: Job Board Aggregator

## 1. Executive Summary

### 1.1 Product Overview
A Next.js-based job board that automatically aggregates job postings from multiple sources, providing users with a centralized platform to discover opportunities without visiting multiple websites.

### 1.2 Target Audience
- Primary: Certified Recovery Peer Advocates, Recovery Coaches, Peer Specialists seeking employment in healthcare
- Secondary: Healthcare organizations and recovery centers seeking peer support professionals (future phase)

### 1.3 Business Goals
- Aggregate 500+ peer support job postings within first month
- Serve as the premier job board for recovery peer professionals
- Achieve sub-2 second page load times
- Provide centralized access to opportunities across all major healthcare and recovery job boards

---

## 2. Core Features & Requirements

### 2.1 Web Scraping Engine

#### 2.1.1 Functional Requirements
- **FR-1**: System shall scrape job postings from minimum 3 target websites
- **FR-2**: System shall run automated scrapes every 6 hours
- **FR-3**: System shall detect and skip duplicate job postings based on URL and title similarity
- **FR-4**: System shall extract: job title, company name, location, salary (if available), description, posting date, application URL
- **FR-5**: System shall handle pagination to scrape multiple pages per site
- **FR-6**: System shall respect robots.txt and implement rate limiting

#### 2.1.2 Target Sources (Initial Phase)
Focus on healthcare and behavioral health job boards:
- [ ] Indeed (filter: "peer specialist" OR "recovery coach" OR "peer advocate")
- [ ] LinkedIn Jobs (healthcare peer support roles)
- [ ] HealthcareJobSite.com
- [ ] Behavioral Health Jobs
- [ ] SAMHSA's Behavioral Health Treatment Services Locator (if job postings available)
- [ ] State-specific behavioral health job boards
- [ ] Recovery-focused organization career pages (e.g., Hazelden Betty Ford, Phoenix Houses, etc.)

**Search Keywords to Target:**
- "Certified Recovery Peer Advocate"
- "Recovery Coach"
- "Peer Specialist"
- "Peer Support Specialist"
- "Certified Peer Recovery Specialist"
- "Peer Recovery Specialist"
- "Behavioral Health Peer Specialist"
- "Mental Health Peer Specialist"
- "Substance Use Peer Specialist"
- "Recovery Support Specialist"
- "Peer Navigator"
- "Peer Advocate"
- "Certified Peer Counselor"
- "CRPA" / "CPS" / "CPRS" (common abbreviations)

#### 2.1.3 Technical Requirements
- **TR-1**: Use headless browser (Puppeteer/Playwright) for JS-rendered content
- **TR-2**: Implement exponential backoff retry logic (3 attempts)
- **TR-3**: Log all scraping errors with context for debugging
- **TR-4**: Implement proxy rotation if IP blocking occurs
- **TR-5**: Maximum scrape time per site: 5 minutes

### 2.2 Job Listing Display

#### 2.2.1 Functional Requirements
- **FR-7**: Display job listings in card/list format
- **FR-8**: Show: title, company, location, salary, snippet (first 150 chars), source, time posted, certification requirements (if mentioned)
- **FR-9**: Click on job card opens detail view or redirects to source
- **FR-10**: Implement infinite scroll or pagination (50 jobs per page)
- **FR-11**: Display "NEW" badge for jobs posted within 48 hours

#### 2.2.2 Job Detail Page
- **FR-12**: Full job description with formatted text
- **FR-13**: Apply button linking to original posting
- **FR-14**: Company information section
- **FR-15**: Related jobs section (same company or similar title)

### 2.3 Search & Filtering

#### 2.3.1 Search Functionality
- **FR-16**: Full-text search across job title, company, description
- **FR-17**: Search results update in real-time (debounced)
- **FR-18**: Search highlighting in results

#### 2.3.2 Filter Options
- **FR-19**: Filter by location (city, state, remote, hybrid, on-site)
- **FR-20**: Filter by job type (full-time, part-time, contract, per-diem)
- **FR-21**: Filter by salary range (if available)
- **FR-22**: Filter by posting date (24h, 7 days, 30 days)
- **FR-23**: Filter by source website
- **FR-24**: Filter by certification required (CRPA, CPS, CPRS, or "No certification required")
- **FR-25**: Filter by specialty (substance use, mental health, general recovery, veterans, youth)
- **FR-26**: Multiple filters can be applied simultaneously
- **FR-27**: Clear all filters option
- **FR-28**: Filter state persists in URL for sharing

### 2.4 User Features (Optional - Phase 2)

#### 2.4.1 Accounts & Authentication
- **FR-29**: User registration with email/password
- **FR-30**: Social login (Google, LinkedIn)
- **FR-31**: Email verification

#### 2.4.2 Saved Jobs
- **FR-32**: Bookmark/save jobs for later viewing
- **FR-33**: View all saved jobs in dedicated page
- **FR-34**: Remove saved jobs

#### 2.4.3 Job Alerts
- **FR-35**: Create custom alert with search criteria
- **FR-36**: Receive email notifications for new matching jobs
- **FR-37**: Manage/delete alerts

---

## 3. Technical Architecture

### 3.1 Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma or Drizzle
- **Scraping**: Puppeteer/Playwright, Cheerio
- **Job Queue**: BullMQ or Inngest (for scheduled scraping)
- **Hosting**: Vercel (frontend), Railway/Render (scraping workers)
- **Search**: PostgreSQL Full-Text Search or Typesense (optional)

### 3.2 Database Schema

```prisma
model Job {
  id                String   @id @default(cuid())
  title             String
  company           String
  location          String
  salary            String?
  description       String   @db.Text
  url               String   @unique
  source            String   // 'indeed', 'linkedin', 'healthcarejobsite', etc.
  jobType           String?  // 'full-time', 'part-time', 'contract', 'per-diem'
  certificationsReq String?  // 'CRPA', 'CPS', 'CPRS', 'None', etc.
  specialty         String?  // 'substance-use', 'mental-health', 'general', 'veterans', 'youth'
  postedDate        DateTime?
  scrapedAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  isActive          Boolean  @default(true)
  
  @@index([title, company])
  @@index([location])
  @@index([scrapedAt])
  @@index([source])
  @@index([specialty])
  @@index([certificationsReq])
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  savedJobs     SavedJob[]
  alerts        JobAlert[]
}

model SavedJob {
  id        String   @id @default(cuid())
  userId    String
  jobId     String
  savedAt   DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, jobId])
}

model JobAlert {
  id          String   @id @default(cuid())
  userId      String
  query       String
  location    String?
  jobType     String?
  specialty   String?
  frequency   String   // 'daily', 'weekly'
  isActive    Boolean  @default(true)
  lastSent    DateTime?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

### 3.3 API Routes

```
POST   /api/scrape              - Trigger manual scrape (admin)
GET    /api/jobs                - Get paginated jobs with filters
GET    /api/jobs/[id]           - Get single job details
GET    /api/jobs/search         - Search jobs
POST   /api/jobs/save           - Save a job (auth required)
DELETE /api/jobs/save/[id]      - Remove saved job
POST   /api/alerts              - Create job alert
GET    /api/alerts              - Get user's alerts
DELETE /api/alerts/[id]         - Delete alert
```

### 3.4 Scraper Architecture

```
/src/lib/scrapers/
  ├── base-scraper.ts       - Abstract base class
  ├── indeed-scraper.ts     - Indeed implementation
  ├── linkedin-scraper.ts   - LinkedIn implementation
  ├── scheduler.ts          - Cron job orchestration
  └── utils/
      ├── rate-limiter.ts
      ├── proxy-manager.ts
      └── duplicate-detector.ts
```

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-1**: Homepage loads in < 2 seconds (LCP)
- **NFR-2**: Search results return in < 500ms
- **NFR-3**: Support 1,000 concurrent users
- **NFR-4**: Database queries optimized with proper indexes

### 4.2 Scalability
- **NFR-5**: System handles 10,000+ job postings
- **NFR-6**: Scraping jobs run in separate workers/containers
- **NFR-7**: Database supports horizontal scaling

### 4.3 Reliability
- **NFR-8**: 99.5% uptime for frontend
- **NFR-9**: Failed scrapes automatically retry
- **NFR-10**: Graceful degradation if source site is down
- **NFR-11**: Data backup daily

### 4.4 Security
- **NFR-12**: All API routes protected with rate limiting
- **NFR-13**: User passwords hashed with bcrypt (12+ rounds)
- **NFR-14**: SQL injection prevention via parameterized queries
- **NFR-15**: HTTPS only in production
- **NFR-16**: Environment variables for all secrets

### 4.5 Compliance
- **NFR-17**: Respect robots.txt on all scraped sites
- **NFR-18**: GDPR-compliant data handling (if applicable)
- **NFR-19**: Clear attribution to original job source
- **NFR-20**: Terms of Service and Privacy Policy

---

## 5. User Interface Requirements

### 5.1 Pages/Routes

#### Homepage `/`
- Hero section with search bar
- Tagline focused on peer support professionals
- Featured/recent jobs grid
- Quick filter chips (Remote, CRPA Required, Mental Health, Substance Use, etc.)
- Site statistics (X peer support jobs from Y sources)
- Educational resources section (optional: certification info, state requirements)

#### Jobs Listing `/jobs`
- Search bar (sticky on scroll)
- Sidebar filters (collapsible on mobile)
- Job cards grid/list toggle
- Pagination/infinite scroll

#### Job Detail `/jobs/[id]`
- Full job description
- Certification requirements highlighted
- Company/organization info sidebar
- Apply button (CTA)
- Share buttons
- Related jobs (same specialty or nearby location)

#### Saved Jobs `/saved` (Auth required)
- Saved jobs list
- Same filtering as main page

#### Alerts `/alerts` (Auth required)
- Create new alert form
- List of active alerts
- Toggle active/inactive

#### Auth Pages
- `/login`
- `/register`
- `/forgot-password`

### 5.2 Design Requirements
- **UI-1**: Mobile-first responsive design
- **UI-2**: Dark mode toggle
- **UI-3**: Accessible (WCAG 2.1 AA compliance)
- **UI-4**: Loading states for all async operations
- **UI-5**: Toast notifications for user actions
- **UI-6**: Empty states for zero results

---

## 6. Development Phases

### Phase 1: MVP (Weeks 1-4)
- [ ] Database schema setup
- [ ] Base scraper framework
- [ ] 3-4 site scrapers implemented (Indeed, LinkedIn, HealthcareJobSite, one specialty board)
- [ ] Keyword filtering for peer support roles
- [ ] Basic job listing page with search
- [ ] Job detail page
- [ ] Basic filters (location, date, specialty, certification)
- [ ] Scheduled scraping (cron - every 6 hours)

### Phase 2: Enhancement (Weeks 5-6)
- [ ] Add 2-3 more job sources
- [ ] Advanced filtering (multiple simultaneous filters)
- [ ] Search optimization with keyword highlighting
- [ ] UI polish and animations
- [ ] Performance optimization
- [ ] SEO (metadata, sitemap, structured data)
- [ ] Educational resources page (certification info by state)

### Phase 3: User Features (Weeks 7-8) - OPTIONAL
- [ ] User authentication
- [ ] Saved jobs functionality
- [ ] Job alerts with email notifications
- [ ] User dashboard

### Phase 4: Scale & Optimize (Ongoing)
- [ ] Add more niche recovery/behavioral health job sources
- [ ] Advanced search (Typesense/Algolia)
- [ ] Analytics dashboard (admin)
- [ ] State-by-state certification requirements database
- [ ] Salary insights for peer support roles

---

## 7. Success Metrics

### 7.1 Technical Metrics
- Jobs scraped per day
- Scraping success rate (%)
- API response times
- Error rates

### 7.2 User Metrics
- Daily active users (DAU)
- Jobs viewed per session
- Click-through rate to source sites
- Saved jobs per user
- Alert subscriptions

### 7.3 Business Metrics
- Total peer support jobs in database
- Number of sources scraped
- User retention rate (if auth implemented)
- Geographic coverage (states represented)
- Most in-demand certifications (CRPA vs CPS vs CPRS)
- Average salary ranges by specialty

---

## 8. Risks & Mitigations

### 8.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Source sites change HTML structure | High | Version scraper logic, implement monitoring, quick fix pipeline |
| IP blocking from excessive scraping | High | Rotate proxies, respect rate limits, implement delays |
| Database growth exceeds capacity | Medium | Archive old jobs (90+ days), implement pagination |
| Scraping worker crashes | Medium | Health checks, auto-restart, error alerting |

### 8.2 Legal Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Copyright/ToS violation | High | Legal review, only scrape public data, attribute sources, respect robots.txt |
| DMCA takedown | High | Implement takedown process, maintain contact form |

---

## 9. Future Enhancements (Out of Scope for MVP)

- State-by-state certification requirements database
- Interactive map showing peer support job density by state
- Salary benchmarking tools for peer specialists
- Training program directory (where to get certified)
- Organization profiles (recovery centers, behavioral health clinics)
- Peer community forum or resources section
- Direct application through platform (if legally allowed)
- Resume builder tailored for peer support professionals
- Interview preparation resources specific to peer roles
- Mobile app (React Native)
- Browser extension
- Continuing education tracking for certification renewals

---

## 10. Appendix

### 10.1 Glossary
- **Scraping**: Automated extraction of data from websites
- **Job Posting**: A single job opportunity listing
- **Source**: The original website where job was scraped from
- **Alert**: Automated notification based on search criteria

### 10.2 Reference Documents
- Next.js Documentation: https://nextjs.org/docs
- Puppeteer Documentation: https://pptr.dev
- Prisma Documentation: https://www.prisma.io/docs

### 10.3 Stakeholder Contacts
- Product Owner: [Your Name]
- Technical Lead: [If applicable]
- Designer: [If applicable]

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Current Date] | [Your Name] | Initial draft |

