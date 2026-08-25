import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

// Si no existe .env, evitamos que haya errores por querer leer un archivo que no existe.
let port = 3000
try {
  port = process.loadEnvFile() ? process.env.PORT : port
} catch {}


const users = [
  { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', name: 'Miguel', age: 28 },
  { id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b', name: 'Mateo', age: 34 },
  { id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d', name: 'Pablo', age: 22 },
  { id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', name: 'Lucía', age: 31 },
  { id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e', name: 'Ana', age: 26 },
  { id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a', name: 'Juan', age: 29 },
  { id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d', name: 'Sofía', age: 25 },
  { id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', name: 'Carlos', age: 37 },
  { id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f', name: 'Elena', age: 23 },
  { id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b', name: 'Diego', age: 30 }
];

// Lee el body de una petición, ya que los va recibiendo por chunks y hay que esperar para que estén todos y entonces convertirlos a un objeto
const json = async (req) => {
  let body = ''

  for await (const chunk of req) {
    body += chunk
  }

  // Si body está vacío devolvemos {}; si el JSON es malformado devolvemos null en vez de lanzar un error
  if (!body) return {}

  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}

// Envía una respuesta en JSON
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })

  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {

  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`)

  // GET /users - Lista todos los usuarios y filtros (nombre, edad y paginación)
  if (req.method === 'GET' && pathname === '/users') {

    const name = searchParams.get('name')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const minAge = Number(searchParams.get('minAge'))
    const maxAge = Number(searchParams.get('maxAge'))
    let filteredUsers = users

    // Filtrado por nombre
    if (name) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    // con esta validación nos aseguramos de que el valor no sea Infinity, -Infinity, NaN ni decimal (por .isIneger()) y negativo
    if (Number.isInteger(minAge) && minAge > 0) {
      filteredUsers = filteredUsers.filter(user => user.age >= minAge)
    }

    if (Number.isInteger(maxAge) && maxAge > 0) {
      filteredUsers = filteredUsers.filter(user => user.age <= maxAge)
    }

    // Paginación usando limit y offset
    if (limit !== null || offset !== null) {
      const start = offset ? Number(offset) : 0
      const end = limit ? start + Number(limit) : undefined
      filteredUsers = filteredUsers.slice(start, end)
    }

    return sendJSON(res, 200, filteredUsers)
  }

  // POST /users - Crea nuevo usuario
  if (req.method === 'POST' && pathname === '/users') {

    const data = await json(req)

    // Respondemos 400 si el body es inválido o faltan campos, en vez de crear un usuario con undefined
    if (!data || !data.name || !Number.isInteger(data.age) || data.age <= 0) {
      return sendJSON(res, 400, { error: 'El body debe incluir name y un age entero positivo' })
    }

    // Creamos el usuario generando un ID único
    const newUser = {
      id: randomUUID(),
      name: data.name,
      age: data.age
    }

    // Guardamos en el array y devolvemos status 201 (creado)
    users.push(newUser)
    return sendJSON(res, 201, newUser)
  }

  // GET /health - Endpoint para comprobar estado de la API
  if (req.method === 'GET' && pathname === '/health') {
    return sendJSON(res, 200, {
      status: 'ok',
      uptime: process.uptime()
    })
  }

  // Si no ha coincidido ninguna ruta anterior, devolvemos 404
  sendJSON(res, 404, { error: 'Ruta no encontrada' })
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})
