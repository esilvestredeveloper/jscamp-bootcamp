import crypto from 'node:crypto'
import { db } from './database'
import jobs from '../jobs.json'

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    PRIMARY KEY (job_id, technology),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

// OR IGNORE evita errores de clave repetida al relanzar el seed
const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTech = db.prepare(`
  INSERT OR IGNORE INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertContent = db.prepare(`
  INSERT OR IGNORE INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

// Si falla algún insert se deshace todo
const seed = db.transaction(() => {
  for (const job of jobs) {
    insertJob.run(job.id, job.title, job.company, job.location, job.description, job.modality, job.level)

    for (const technology of job.technologies) {
      insertTech.run(job.id, technology)
    }

    const { description, responsibilities, requirements, about } = job.content
    // UUID para la PRIMARY KEY, así el id no es predecible como con AUTOINCREMENT
    insertContent.run(crypto.randomUUID(), job.id, description, responsibilities, requirements, about)
  }
})

seed()
db.close()

console.log('Tablas creadas y datos insertados')
