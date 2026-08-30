import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import { corsMiddleware } from './middlewares/cors.js'
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

// Middleware CORS
app.use(corsMiddleware())

// Middleware parsea body JSON de las peticiones y lo deja en req.body
app.use(express.json())

// Delegamos las rutas que empiezan por /jobs al router de jobs
app.use('/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
