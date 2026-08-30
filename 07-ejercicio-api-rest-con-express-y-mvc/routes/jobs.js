import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router()

// GET /jobs -> obtén todos los jobs
jobsRouter.get('/', JobController.getAll)

// GET /jobs/:id -> obtén un job por id
jobsRouter.get('/:id', JobController.getId)
