import { randomUUID } from 'node:crypto'
import jobs from '../jobs.json' with { type: 'json' }

/* Modelo: SOLO maneja los datos (no sabe nada de HTTP) */

export class JobModel {
  // Devuelve los jobs filtrados, ya paginados, y el total sin paginar
  static getAll ({ text, title, level, technology, limit, offset }) {
    let filteredJobs = jobs

    // Filtro por título (case insensitive)
    if (title) {
      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(title.toLowerCase())
      )
    }

    // Filtro por texto: busca en título y descripción (case insensitive)
    if (text) {
      const search = text.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(search) ||
        job.descripcion.toLowerCase().includes(search)
      )
    }

    // Filtro por nivel (junior, mid, senior...)
    if (level) {
      filteredJobs = filteredJobs.filter(job =>
        job.data.nivel.toLowerCase() === level.toLowerCase()
      )
    }

    // Filtro por tecnología: comprobamos si está en el array data.technology
    if (technology) {
      filteredJobs = filteredJobs.filter(job =>
        job.data.technology.some(tech => tech.toLowerCase() === technology.toLowerCase())
      )
    }

    // Paginación: desde offset hasta offset + limit
    const data = filteredJobs.slice(offset, offset + limit)

    // total = cuántos jobs cumplen los filtros (antes de paginar)
    return { data, total: filteredJobs.length }
  }

  // Busca job por id (undefined si no existe)
  static getById (id) {
    return jobs.find(job => job.id === id)
  }

  // Crea un job y lo añade al array
  static create ({ titulo, empresa, ubicacion, descripcion, data, content }) {
    const newJob = {
      id: randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }

    jobs.push(newJob)

    return newJob
  }
}
