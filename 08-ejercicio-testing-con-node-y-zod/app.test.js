import assert from 'node:assert/strict'
import test, { after, before, describe } from 'node:test'
import app from './app.js'
import jobs from './jobs.json' with { type: 'json' }

// Puerto distinto al de desarrollo para no chocar
const PORT = 5678
const BASE_URL = `http://localhost:${PORT}/jobs`

let server

// IDs que existen en jobs.json
const ID_SEGUNDO_JOB = jobs[1].id // Podemos usar jobs[1] porque siempre tener el job de la segunda posición aunque modifiquemos la tabla
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

// Normalizamos el path para que el dev pueda enviarlo con o sin `/`
const buildUrl = (path = '/jobs') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return cleanPath.startsWith('?') ? `${BASE_URL}${cleanPath}` : `${BASE_URL}/${cleanPath}`
}

// Este helper lo hicimos para enviar el body a los metodos POST, PUT y PATCH
const sendJSON = (method, path, body) =>
  fetch(buildUrl(path), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const getJobs = async (query = '', expectedStatus = 200) => {
  const response = await fetch(buildUrl(query))
  assert.strictEqual(response.status, expectedStatus)
  return response.json()
}

const getJob = async (id, expectedStatus = 200) => {
  const response = await fetch(buildUrl(id))
  assert.strictEqual(response.status, expectedStatus)
  return response.json()
}

const createJob = async (body, expectedStatus = 201) => {
  const response = await sendJSON('POST', '', body)
  assert.strictEqual(response.status, expectedStatus)
  return response.json()
}

const updateJob = async (id, body, expectedStatus = 204) => {
  const response = await sendJSON('PUT', id, body)
  assert.strictEqual(response.status, expectedStatus)
}

const patchJob = async (id, body, expectedStatus = 204) => {
  const response = await sendJSON('PATCH', id, body)
  assert.strictEqual(response.status, expectedStatus)
}

const deleteJob = async (id, expectedStatus = 204) => {
  const response = await fetch(buildUrl(id), { method: 'DELETE' })
  assert.strictEqual(response.status, expectedStatus)
}

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
    const json = await getJobs()

    assert.ok(Array.isArray(json.data), 'La respuesta debe ser un array en json.data')
  })

  test('debe filtrar trabajos por tecnología', async () => {
    const json = await getJobs('?technology=react')

    // Comprobamos que hay resultados, si no every() pasaría con el array vacío
    assert.ok(json.data.length > 0, 'El filtro debe devolver al menos un trabajo')

    const allIncludeReact = json.data.every((job) => job.data.technology.includes('react'))
    assert.ok(allIncludeReact, 'Todos los trabajos deben incluir react en data.technology')
  })

  test('debe respetar el límite de resultados', async () => {
    const json = await getJobs('?limit=2')

    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('debe aplicar offset correctamente', async () => {
    const json = await getJobs('?offset=1')

    // Con offset 1 nos saltamos el primer job, el primer resultado es el segundo del JSON
    assert.strictEqual(json.data[0].id, ID_SEGUNDO_JOB)
  })
})

describe('POST /jobs', () => {
  test('el nuevo trabajo se añade correctamente con buen formato', async () => {
    const json = await createJob(validJob)

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
    await createJob({ ...validJob, titulo: 'ab' }, 400)
  })

  test('debe devolver 400 con un título de más de 100 caracteres', async () => {
    await createJob({ ...validJob, titulo: 'a'.repeat(101) }, 400)
  })

  test('debe devolver 400 sin el campo titulo', async () => {
    // Quitamos título del job y enviamos el resto
    const { titulo, ...jobSinTitulo } = validJob

    await createJob(jobSinTitulo, 400)
  })

  test('debe devolver 400 cuando el título no es un string', async () => {
    await createJob({ ...validJob, titulo: 123 }, 400)
  })

  test('debe devolver 201 sin el campo descripcion porque es opcional', async () => {
    const { descripcion, ...jobSinDescripcion } = validJob

    await createJob(jobSinDescripcion)
  })
})

describe('GET /jobs/:id', () => {
  test('debe devolver el trabajo con ID especificado', async () => {
    const json = await getJob(ID_SEGUNDO_JOB)

    assert.strictEqual(json.id, ID_SEGUNDO_JOB)
  })

  test('debe enviar 404 cuando el ID no existe', async () => {
    const json = await getJob(ID_INEXISTENTE, 404)

    assert.ok(json.error, 'La respuesta debe contener un campo error')
  })
})

describe('PUT /jobs/:id', () => {
  test('debe recibir 204 y actualizar el trabajo', async () => {
    // El test crea su propio job para no depender del estado que dejan otros tests
    const createdJob = await createJob(validJob)

    // PUT reemplaza todos los campos, enviamos el job completo
    const updatedJob = { ...validJob, titulo: 'Desarrollador Backend Senior', empresa: 'Node Corp' }

    await updateJob(createdJob.id, updatedJob)

    // Hacemos un GET del mismo job para verificar que se actualizó
    const json = await getJob(createdJob.id)

    assert.strictEqual(json.titulo, updatedJob.titulo)
    assert.strictEqual(json.empresa, updatedJob.empresa)
    assert.strictEqual(json.ubicacion, updatedJob.ubicacion)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await updateJob(ID_INEXISTENTE, validJob, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  test('debe recibir 204 y actualizar solo los campos enviados', async () => {
    // El test crea su propio job
    const originalJob = await createJob(validJob)

    const partialUpdate = { titulo: 'DevOps Lead', ubicacion: 'Madrid' }

    await patchJob(originalJob.id, partialUpdate)

    // Hacemos un GET y verificamos que solo cambiaron titulo y ubicacion
    const json = await getJob(originalJob.id)

    assert.strictEqual(json.titulo, partialUpdate.titulo)
    assert.strictEqual(json.ubicacion, partialUpdate.ubicacion)

    // El resto de campos se mantienen sin cambios
    assert.strictEqual(json.empresa, originalJob.empresa)
    assert.strictEqual(json.descripcion, originalJob.descripcion)
    assert.deepStrictEqual(json.data, originalJob.data)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await patchJob(ID_INEXISTENTE, { titulo: 'Nuevo título' }, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  test('debe recibir 204 y eliminar el trabajo', async () => {
    // El test crea su propio job para no depender del estado que dejan otros tests
    const createdJob = await createJob(validJob)

    await deleteJob(createdJob.id)

    // Hacemos un GET del mismo job y verificamos que se ha eliminado
    await getJob(createdJob.id, 404)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    await deleteJob(ID_INEXISTENTE, 404)
  })
})
