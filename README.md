# PeerMVP - NYC Peer Support Job Board Aggregator

A job board aggregator platform designed specifically for Recovery Peer Professionals in New York City. Automatically scrapes and aggregates peer support job opportunities from multiple sources including Indeed, LinkedIn, and healthcare-specific job boards.

## Project Status

**Current Phase:** Phase 1 Complete - Database & Scraper Foundation
**Last Updated:** October 3, 2025

### ✅ Completed (Phase 1)
- Database schema with Prisma ORM
- Zod validation and TypeScript types
- Base scraper framework with retry logic and duplicate detection
- Indeed scraper implementation
- Utility functions for data processing
- Frontend components (Header, Hero, Footer, Features)

### 🚧 Next Steps (Phase 2)
1. Set up PostgreSQL database connection
2. Run Prisma migrations
3. Build API routes for job listings
4. Create job listing and detail pages
5. Implement search and filter functionality

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod
- **Web Scraping:** Puppeteer
- **Deployment:** Vercel (planned)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

You need a PostgreSQL database. Choose one of these options:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create a database named 'peermvp'
createdb peermvp
```

**Option B: Cloud Database (Recommended)**
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/peermvp"
# Or use your cloud database URL
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create all necessary tables and indexes.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # Shared React components
│   ├── jobs/              # Jobs listing pages (to be built)
│   └── api/jobs/          # API routes (to be built)
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── utils.ts           # Utility functions
│   └── scrapers/          # Web scraper implementations
│       ├── base.ts        # Abstract base scraper class
│       ├── indeed.ts      # Indeed scraper
│       └── config.ts      # Scraper configurations
├── types/
│   └── job.ts             # Zod schemas and TypeScript types
└── prisma/
    └── schema.prisma      # Database schema
```

## Documentation

- [Implementation Plan](./WEBSITE_IMPLEMENTATION_PLAN.md) - Detailed implementation roadmap
- [Web Scraper PRD](./WEB_SCRAPER_PRD.md) - Product requirements
- [CLAUDE.md](./CLAUDE.md) - Instructions for Claude Code assistant

## Where to Pick Up

If you're resuming work on this project:

1. **If database not set up:** Follow steps 2-4 in Getting Started above
2. **If database is ready:** Start with Phase 2 (see WEBSITE_IMPLEMENTATION_PLAN.md)
3. **First task:** Create API route at `src/app/api/jobs/route.ts`

## Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Run database migrations
```

## Target Users

- Certified Recovery Peer Advocates (CRPA)
- Certified Peer Specialists (CPS)
- Recovery Coaches
- Peer Support Specialists in behavioral health

## License

Private project - All rights reserved
