import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateJob, validatePartialJob } from '../schemas/jobs.js'

export const jobsRouter = Router()

// Middleware de validación completa: si los datos no pasan el schema, cortamos con 400
function validateCreate(req, res, next) {
  const result = validateJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

// Middleware de validación parcial: solo válida los campos que vengan en el body
function validatePartialUpdate(req, res, next) {
  const result = validatePartialJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)

// POST y PUT esperan el job completo, validamos con el schema entero
jobsRouter.post('/', validateCreate, JobController.create)

jobsRouter.put('/:id', validateCreate, JobController.update)

// PATCH actualiza solo algunos campos, validamos con el schema parcial
jobsRouter.patch('/:id', validatePartialUpdate, JobController.partialUpdate)

jobsRouter.delete('/:id', JobController.delete)
