import type { Job } from './objects.ts'

// Partial hace opcionales todas las propiedades
export function updateJob(job: Job, updates: Partial<Job>): Job {
  return { ...job, ...updates }
}

// Con Pick el resumen hereda los tipos de Job, así no se desincronizan si Job cambia
export type JobSummary = Pick<Job, 'id' | 'title' | 'company' | 'location'>

export function getJobSummaries(jobs: Job[]): JobSummary[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
  }))
}

export type ReadonlyJob = Readonly<Job>

export function displayJob(job: ReadonlyJob): void {
  // Quitamos la reasignación del título porque con Readonly las propiedades son inmutables
  console.log(`${job.title} - ${job.company}`)
}
