import crypto from 'node:crypto'
import { db } from '../db/database'
import type { Job, JobContent, JobData, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  technologies: string | null
}

// LEFT JOIN para no perder los jobs sin tecnologías
const SELECT_JOBS = `
  SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
  FROM jobs j
  LEFT JOIN job_technologies jt ON j.id = jt.job_id
`

// SQLite devuelve columnas planas y la API espera modality, level y technology dentro de data
function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    data: {
      technology: row.technologies ? row.technologies.split(',') : [],
      modality: row.modality,
      level: row.level,
    },
  }
}

function insertTechnologies(jobId: string, technologies: string[]) {
  // OR IGNORE por si llega la misma tecnología repetida
  const insertTech = db.prepare('INSERT OR IGNORE INTO job_technologies (job_id, technology) VALUES (?, ?)')

  for (const technology of technologies) {
    insertTech.run(jobId, technology)
  }
}

function insertContent(jobId: string, content: JobContent) {
  db.prepare(`
    INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), jobId, content.description, content.responsibilities, content.requirements, content.about)
}

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    let query = SELECT_JOBS
    const conditions: string[] = []
    const params: string[] = []

    if (filters?.tech) {
      // Subconsulta para no recortar la lista de tecnologías de cada job
      conditions.push('j.id IN (SELECT job_id FROM job_technologies WHERE LOWER(technology) = LOWER(?))')
      params.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push('j.modality = ?')
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push('j.level = ?')
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id'

    const rows = db.prepare(query).all(...params) as JobRow[]
    return rows.map(toJob)
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    const row = db.prepare(`${SELECT_JOBS} WHERE j.id = ? GROUP BY j.id`).get(id) as JobRow | undefined
    if (!row) return undefined

    // El content solo lo traemos en el detalle, en el listado no hace falta
    const content = db
      .prepare('SELECT description, responsibilities, requirements, about FROM job_content WHERE job_id = ?')
      .get(id) as JobContent | undefined

    return { ...toJob(row), content }
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    const { id, title, company, location, description, data, content } = newJob

    // Job, tecnologías y content se guardan todos o ninguno
    const insert = db.transaction(() => {
      db.prepare(`
        INSERT INTO jobs (id, title, company, location, description, modality, level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, company, location, description, data.modality, data.level)

      insertTechnologies(id, data.technology)

      if (content) {
        insertContent(id, content)
      }
    })

    insert()

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // ON DELETE CASCADE borra también sus tecnologías y su content
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const currentJob = await JobModel.getById(id)
    if (!currentJob) return null

    // PATCH puede traer solo algunos campos, el resto los mantenemos
    const updatedJob: Job = { ...currentJob, ...input }
    const { title, company, location, description, data } = updatedJob
    const { content } = input

    const update = db.transaction(() => {
      db.prepare(`
        UPDATE jobs
        SET title = ?, company = ?, location = ?, description = ?, modality = ?, level = ?
        WHERE id = ?
      `).run(title, company, location, description, data.modality, data.level, id)

      if (input.data) {
        db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
        insertTechnologies(id, data.technology)
      }

      if (content) {
        const result = db.prepare(`
          UPDATE job_content
          SET description = ?, responsibilities = ?, requirements = ?, about = ?
          WHERE job_id = ?
        `).run(content.description, content.responsibilities, content.requirements, content.about, id)

        // Si el job no tenía content todavía, lo creamos
        if (result.changes === 0) {
          insertContent(id, content)
        }
      }
    })

    update()

    return updatedJob
  }
}
