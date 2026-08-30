import { JobModel } from '../models/jobs.js'
import { DEFAULTS } from '../config.js'

/* Controlador: recibe petición, llama al modelo y devuelve respuesta */

export class JobController {
  // GET /jobs
  static getAll (req, res) {
    const { text, title, level, technology } = req.query

    // Los query params llegan como string, los pasamos a número.
    // Si no vienen, no son números o son negativos, usamos los valores por defecto
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : DEFAULTS.LIMIT_PAGINATION
    const offset = Number(req.query.offset) >= 0 ? Number(req.query.offset) : DEFAULTS.LIMIT_OFFSET

    const { data, total } = JobModel.getAll({ text, title, level, technology, limit, offset })

    // Respondemos con 200 por defecto
    return res.json({ data, total, limit, offset })
  }

  // GET /jobs/:id
  static getId (req, res) {
    const { id } = req.params
    const job = JobModel.getById(id)

    // Si no existe respondemos 404
    if (!job) return res.status(404).json({ error: 'Job not found' })

    return res.json(job)
  }

  // POST /jobs
  static create (req, res) {
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body

    // Campos obligatorios, si falta alguno respondemos 400
    if (!titulo || !empresa || !ubicacion || !descripcion) {
      return res.status(400).json({ error: 'titulo, empresa, ubicacion y descripcion son obligatorios' })
    }

    const newJob = JobModel.create({ titulo, empresa, ubicacion, descripcion, data, content })

    // Respondemos 201 Created con el job creado
    return res.status(201).json(newJob)
  }
}
