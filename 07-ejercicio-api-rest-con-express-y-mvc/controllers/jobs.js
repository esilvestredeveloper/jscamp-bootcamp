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
}
