import { z } from 'zod'

// Enums and constants
export const JOB_SOURCES = ['Indeed', 'LinkedIn', 'HealthcareJobSite', 'BehavioralHealthJobs'] as const
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Remote'] as const
export const CERTIFICATIONS = ['CRPA', 'CPS', 'CPRS', 'CRS', 'CASAC', 'None Required'] as const
export const SPECIALTIES = [
  'Substance Use',
  'Mental Health',
  'Dual Diagnosis',
  'Youth Services',
  'Veterans Services',
  'LGBTQ+ Services',
  'General Peer Support'
] as const

// Zod schema for job validation
export const JobSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Must be a valid URL'),
  source: z.enum(JOB_SOURCES),
  jobType: z.enum(JOB_TYPES).nullable().optional(),
  certificationsReq: z.array(z.string()).default([]),
  specialty: z.string().nullable().optional(),
  postedDate: z.date().nullable().optional(),
  scrapedAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isActive: z.boolean().default(true),
})

// Job creation schema (for scraping)
export const JobCreateSchema = JobSchema.omit({
  id: true,
  scrapedAt: true,
  updatedAt: true,
})

// Job filter schema (for API queries)
export const JobFilterSchema = z.object({
  location: z.string().optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  specialty: z.string().optional(),
  certification: z.string().optional(),
  source: z.enum(JOB_SOURCES).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
})

// TypeScript types inferred from Zod schemas
export type Job = z.infer<typeof JobSchema>
export type JobCreate = z.infer<typeof JobCreateSchema>
export type JobFilter = z.infer<typeof JobFilterSchema>
export type JobSource = typeof JOB_SOURCES[number]
export type JobType = typeof JOB_TYPES[number]
export type Certification = typeof CERTIFICATIONS[number]
export type Specialty = typeof SPECIALTIES[number]

// Validation helpers
export function validateJob(data: unknown): Job {
  return JobSchema.parse(data)
}

export function validateJobCreate(data: unknown): JobCreate {
  return JobCreateSchema.parse(data)
}

export function validateJobFilter(data: unknown): JobFilter {
  return JobFilterSchema.parse(data)
}

// Keywords for peer support job filtering
export const PEER_SUPPORT_KEYWORDS = [
  'peer specialist',
  'peer advocate',
  'peer counselor',
  'peer support',
  'recovery coach',
  'crpa',
  'certified recovery peer advocate',
  'certified peer specialist',
  'peer recovery specialist',
  'behavioral health peer',
  'mental health peer',
  'substance use peer',
  'addiction peer',
]
