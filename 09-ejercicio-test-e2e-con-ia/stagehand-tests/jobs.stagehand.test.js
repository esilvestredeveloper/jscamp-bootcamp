import 'dotenv/config'

import assert from 'node:assert/strict'
import test, { after, before } from 'node:test'

import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

const APP_URL = 'http://localhost:5173'

// Los prompts mejor en inglés, en español falla bastante
let stagehand
let page

before(async () => {
  stagehand = new Stagehand({
    env: 'LOCAL',
    verbose: 0,
    disablePino: true,
    // Apuntamos al modelo local de Ollama, que habla el mismo protocolo que OpenAI
    model: {
      modelName: 'openai/qwen2.5:7b',
      apiKey: process.env.OPENAI_API_KEY ?? 'ollama',
      baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
    },
  })

  await stagehand.init()
  page = stagehand.context.pages[0] ?? (await stagehand.context.newPage())
})

after(async () => {
  await stagehand?.close()
})

// Esperamos a que la app termine de pintar, si no el modelo recibe la página a medias
const abrir = async (ruta = '') => {
  await page.goto(`${APP_URL}${ruta}`, { waitUntil: 'networkidle' })
}

test('la IA encuentra el buscador de la home', async () => {
  await abrir()

  const elementos = await stagehand.observe('the search input')

  assert.ok(elementos.length > 0, 'Debe localizar el buscador sin darle ningún selector')
})

test('la IA lee cuántas ofertas hay en el listado', async () => {
  await abrir('/search')

  const { jobCount } = await stagehand.extract(
    'How many job offers are listed in the results?',
    z.object({ jobCount: z.number() }),
  )

  assert.ok(jobCount > 0, 'Debe leer las ofertas que hay en pantalla')
})

test('la IA lee el título de la primera oferta', async () => {
  await abrir('/search')

  const { title } = await stagehand.extract(
    'Extract the title of the first job offer in the list',
    z.object({ title: z.string() }),
  )

  // Comparamos con lo que hay de verdad en el DOM
  const real = await page.locator('.job-listing-card h3').first().innerText()

  assert.equal(title.trim(), real.trim())
})

// Omitimos porque con el modelo local no funciona
test('la IA busca ofertas de React', { skip: 'El modelo local devuelve el contenedor en vez del input, así que act no llega a ejecutarse' }, async () => {
  await abrir()

  await stagehand.act('Type "React" in the search input')
  await stagehand.act('Click the "Buscar" button')

  await page.waitForURL(/\/search/)

  assert.ok(await page.locator('.job-listing-card').count())
})

test('la IA inicia sesión y aplica a una oferta', { skip: 'El modelo local devuelve el contenedor en vez del input, así que act no llega a ejecutarse' }, async () => {
  await abrir('/search')

  await stagehand.act('Click the log in button in the page header')
  await stagehand.act('Open the first job offer of the list')
  await stagehand.act('Click the button to apply for this job')

  const { buttonText } = await stagehand.extract(
    'Extract the text shown on the apply button',
    z.object({ buttonText: z.string() }),
  )

  assert.match(buttonText, /aplicado/i)
})
