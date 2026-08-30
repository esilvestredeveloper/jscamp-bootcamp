import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173'
]

// Si no está en la lista, no se envía cabecera y navegador bloquea respuesta
export const corsMiddleware = () => cors({ origin: ACCEPTED_ORIGINS })
