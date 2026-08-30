import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router()

// GET /jobs -> obtén todos los jobs
jobsRouter.get('/', JobController.getAll)

// GET /jobs/:id -> obtén un job por id
jobsRouter.get('/:id', JobController.getId)

// POST /jobs -> crea un job
jobsRouter.post('/', JobController.create)

// PUT /jobs/:id -> actualiza un job completo
jobsRouter.put('/:id', JobController.update)

// PATCH /jobs/:id -> actualiza parcialmente un job
jobsRouter.patch('/:id', JobController.partialUpdate)

// DELETE /jobs/:id -> elimina un job
jobsRouter.delete('/:id', JobController.delete)
