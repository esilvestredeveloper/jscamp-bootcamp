import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

export const jobsRouter = Router()

// GET /jobs -> obtén todos los jobs
jobsRouter.get('/', JobController.getAll)
