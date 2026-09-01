import test, { describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import app from './app.js'

// Puerto distinto al de desarrollo para no chocar
const PORT = 5678
const BASE_URL = `http://localhost:${PORT}/jobs`

let server

// IDs que existen en jobs.json
const ID_SEGUNDO_JOB = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
const ID_JOB_PUT = 'e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d'
const ID_JOB_PATCH_DELETE = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
const ID_INEXISTENTE = 'id-que-no-existe'

// Job válido
const validJob = {
  titulo: 'Desarrollador Frontend Junior',
  empresa: 'JSCamp Studios',
  ubicacion: 'Remoto',
  descripcion: 'Puesto para practicar testing con Node y Zod',
  data: {
    technology: ['react', 'javascript'],
    modalidad: 'remoto',
    nivel: 'junior',
  },
}

// Helper para las peticiones con body JSON
const sendJSON = (url, method, body) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

// Levantamos el servidor una vez
before(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(PORT, (err) => (err ? reject(err) : resolve()))
  })
})

// Cerramos el servidor al terminar
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
})

describe('GET /jobs', () => {
  test('debe responder con 200 y un array de trabajos', async () => {
    const response = await fetch(BASE_URL)

    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.ok(Array.isArray(json.data), 'La respuesta debe ser un array en json.data')
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const response = await fetch(`${BASE_URL}?technology=react`)

    assert.strictEqual(response.status, 200)

    const json = await response.json()

    // Comprobamos que hay resultados, si no every() pasaría con el array vacío
    assert.ok(json.data.length > 0, 'El filtro debe devolver al menos un trabajo')

    const allIncludeReact = json.data.every((job) => job.data.technology.includes('react'))
    assert.ok(allIncludeReact, 'Todos los trabajos deben incluir react en data.technology')
  })

  test('debe respetar el límite de resultados', async () => {
    const response = await fetch(`${BASE_URL}?limit=2`)

    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('debe aplicar offset correctamente', async () => {
    const response = await fetch(`${BASE_URL}?offset=1`)

    assert.strictEqual(response.status, 200)

    // Con offset 1 nos saltamos el primer job, el primer resultado es el segundo del JSON
    const json = await response.json()
    assert.strictEqual(json.data[0].id, ID_SEGUNDO_JOB)
  })
})

describe('POST /jobs', () => {
  test('el nuevo trabajo se añade correctamente con buen formato', async () => {
    const response = await sendJSON(BASE_URL, 'POST', validJob)

    assert.strictEqual(response.status, 201)

    const json = await response.json()

    // El servidor genera id, no lo enviamos nosotros
    assert.ok(json.id, 'El job creado debe tener un id generado')

    // Los datos devueltos deben coincidir con lo enviado
    assert.strictEqual(json.titulo, validJob.titulo)
    assert.strictEqual(json.empresa, validJob.empresa)
    assert.strictEqual(json.ubicacion, validJob.ubicacion)
    assert.strictEqual(json.descripcion, validJob.descripcion)
    assert.deepStrictEqual(json.data, validJob.data)
  })

  test('debe devolver 400 con un título de menos de 3 caracteres', async () => {
    const response = await sendJSON(BASE_URL, 'POST', { ...validJob, titulo: 'ab' })

    assert.strictEqual(response.status, 400)
  })

  test('debe devolver 400 con un título de más de 100 caracteres', async () => {
    const response = await sendJSON(BASE_URL, 'POST', { ...validJob, titulo: 'a'.repeat(101) })

    assert.strictEqual(response.status, 400)
  })

  test('debe devolver 400 sin el campo titulo', async () => {
    // Quitamos título del job y enviamos el resto
    const { titulo, ...jobSinTitulo } = validJob
    const response = await sendJSON(BASE_URL, 'POST', jobSinTitulo)

    assert.strictEqual(response.status, 400)
  })

  test('debe devolver 400 cuando el título no es un string', async () => {
    const response = await sendJSON(BASE_URL, 'POST', { ...validJob, titulo: 123 })

    assert.strictEqual(response.status, 400)
  })

  test('debe devolver 201 sin el campo descripcion porque es opcional', async () => {
    const { descripcion, ...jobSinDescripcion } = validJob
    const response = await sendJSON(BASE_URL, 'POST', jobSinDescripcion)

    assert.strictEqual(response.status, 201)
  })
})

describe('GET /jobs/:id', () => {
  test('debe devolver el trabajo con ID especificado', async () => {
    const response = await fetch(`${BASE_URL}/${ID_SEGUNDO_JOB}`)

    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.strictEqual(json.id, ID_SEGUNDO_JOB)
  })

  test('debe enviar 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/${ID_INEXISTENTE}`)

    assert.strictEqual(response.status, 404)

    const json = await response.json()
    assert.ok(json.error, 'La respuesta debe contener un campo error')
  })
})

describe('PUT /jobs/:id', () => {
  test('debe recibir 204 y actualizar el trabajo', async () => {
    // PUT reemplaza todos los campos, enviamos el job completo
    const updatedJob = { ...validJob, titulo: 'Desarrollador Backend Senior', empresa: 'Node Corp' }

    const response = await sendJSON(`${BASE_URL}/${ID_JOB_PUT}`, 'PUT', updatedJob)

    assert.strictEqual(response.status, 204)

    // Hacemos un GET del mismo job para verificar que se actualizó
    const getResponse = await fetch(`${BASE_URL}/${ID_JOB_PUT}`)
    const json = await getResponse.json()

    assert.strictEqual(json.titulo, updatedJob.titulo)
    assert.strictEqual(json.empresa, updatedJob.empresa)
    assert.strictEqual(json.ubicacion, updatedJob.ubicacion)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await sendJSON(`${BASE_URL}/${ID_INEXISTENTE}`, 'PUT', validJob)

    assert.strictEqual(response.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  test('debe recibir 204 y actualizar solo los campos enviados', async () => {
    // Guardamos el job original para comparar
    const originalResponse = await fetch(`${BASE_URL}/${ID_JOB_PATCH_DELETE}`)
    const originalJob = await originalResponse.json()

    const partialUpdate = { titulo: 'DevOps Lead', ubicacion: 'Madrid' }

    const response = await sendJSON(`${BASE_URL}/${ID_JOB_PATCH_DELETE}`, 'PATCH', partialUpdate)

    assert.strictEqual(response.status, 204)

    // Hacemos un GET y verificamos que solo cambiaron titulo y ubicacion
    const getResponse = await fetch(`${BASE_URL}/${ID_JOB_PATCH_DELETE}`)
    const json = await getResponse.json()

    assert.strictEqual(json.titulo, partialUpdate.titulo)
    assert.strictEqual(json.ubicacion, partialUpdate.ubicacion)

    // El resto de campos se mantienen sin cambios
    assert.strictEqual(json.empresa, originalJob.empresa)
    assert.strictEqual(json.descripcion, originalJob.descripcion)
    assert.deepStrictEqual(json.data, originalJob.data)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await sendJSON(`${BASE_URL}/${ID_INEXISTENTE}`, 'PATCH', { titulo: 'Nuevo título' })

    assert.strictEqual(response.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  test('debe recibir 204 y eliminar el trabajo', async () => {
    const response = await fetch(`${BASE_URL}/${ID_JOB_PATCH_DELETE}`, { method: 'DELETE' })

    assert.strictEqual(response.status, 204)

    // Hacemos un GET del mismo job y verificamos que se ha eliminado
    const getResponse = await fetch(`${BASE_URL}/${ID_JOB_PATCH_DELETE}`)

    assert.strictEqual(getResponse.status, 404)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await fetch(`${BASE_URL}/${ID_INEXISTENTE}`, { method: 'DELETE' })

    assert.strictEqual(response.status, 404)
  })
})
