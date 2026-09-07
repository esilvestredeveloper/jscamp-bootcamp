// @ts-check
import { expect, test } from '@playwright/test'

const APP_URL = 'http://localhost:5173'

test('la página principal carga con el buscador visible', async ({ page }) => {
  await page.goto(APP_URL)

  // Pedimos el rol antes que el CSS, cambia mucho menos con los refactors
  await expect(page.getByRole('searchbox')).toBeVisible()
})

test('buscar por tecnología devuelve resultados', async ({ page }) => {
  await page.goto(APP_URL)

  await page.getByRole('searchbox').fill('React')
  await page.getByRole('button', { name: 'Buscar' }).click()

  // Buscamos la tarjeta de oferta
  const jobCards = page.locator('.job-listing-card')

  // Las ofertas vienen de una API, la aserción reintenta hasta que se pintan
  await expect(jobCards).not.toHaveCount(0)
  await expect(jobCards.first()).toBeVisible()
})

test('un usuario puede entrar en una oferta y aplicar', async ({ page }) => {
  await page.goto(APP_URL)

  await page.getByRole('searchbox').fill('JavaScript')
  await page.getByRole('button', { name: 'Buscar' }).click()

  const firstJob = page.locator('.job-listing-card').first()
  await expect(firstJob).toBeVisible()

  // Guardamos el título para reconocer la oferta
  const jobTitle = await firstJob.getByRole('heading', { level: 3 }).innerText()

  await firstJob.getByRole('link').click()

  // En el detalle el mismo título pasa de h3 a h1
  await expect(page.getByRole('heading', { level: 1, name: jobTitle })).toBeVisible()

  // Sin sesión iniciada la app no deja aplicar
  await expect(page.getByRole('button', { name: 'Inicia sesión para aplicar' }).first()).toBeDisabled()

  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  // El detalle repite el botón arriba y abajo, nos quedamos con el primero
  await page.getByRole('button', { name: 'Aplicar ahora' }).first().click()

  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible()
})

test.describe('filtros', () => {
  test('filtrar por ubicación deja solo ofertas remotas', async ({ page }) => {
    await page.goto(`${APP_URL}/search`)

    const jobCards = page.locator('.job-listing-card')
    await expect(jobCards.first()).toBeVisible()

    // Los select no tienen label, así que los pedimos por id
    await page.locator('#filter-location').selectOption('remoto')

    await expect(page).toHaveURL(/type=remoto/)
    await expect(jobCards).not.toHaveCount(0)

    // Cada tarjeta pinta "Empresa | Ubicación", no debe quedar ninguna sin Remoto
    await expect(jobCards.filter({ hasNotText: 'Remoto' })).toHaveCount(0)
  })

  test('filtrar por nivel deja solo ofertas senior', async ({ page }) => {
    await page.goto(`${APP_URL}/search`)

    const jobCards = page.locator('.job-listing-card')
    await expect(jobCards.first()).toBeVisible()

    await page.locator('#filter-experience-level').selectOption('senior')

    await expect(page).toHaveURL(/level=senior/)
    await expect(jobCards).not.toHaveCount(0)

    // El nivel no sale en el texto de la tarjeta, lo lleva en un data attribute
    await expect(page.locator('.job-listing-card:not([data-nivel="senior"])')).toHaveCount(0)
  })
})

test.describe('paginación', () => {
  // La app tiene otro nav en la cabecera, cogemos el que lleva los números de página
  const pagination = (page) =>
    page.locator('nav').filter({ has: page.getByRole('link', { name: '1', exact: true }) })

  const segundaPagina = (page) => pagination(page).getByRole('link', { name: '2', exact: true })

  test('aparece la paginación cuando hay más ofertas de las que caben', async ({ page }) => {
    await page.goto(`${APP_URL}/search`)

    await expect(page.locator('.job-listing-card').first()).toBeVisible()

    // Si hay enlace a la segunda es que no caben todas en la primera
    await expect(segundaPagina(page)).toBeVisible()
  })

  test('con una sola oferta no hay más páginas', async ({ page }) => {
    // Búsqueda estrecha a propósito, de esta solo hay una oferta
    await page.goto(`${APP_URL}/search?text=ciberseguridad`)

    await expect(page.locator('.job-listing-card')).toHaveCount(1)

    // El bloque se sigue pintando aunque sobre, por eso lo damos por visible
    await expect(pagination(page)).toBeVisible()
    await expect(segundaPagina(page)).toHaveCount(0)
  })

  test('pasar a la siguiente página cambia los resultados', async ({ page }) => {
    await page.goto(`${APP_URL}/search`)

    const primerTitulo = page.locator('.job-listing-card').first().getByRole('heading', { level: 3 })
    await expect(primerTitulo).toBeVisible()

    const tituloPagina1 = await primerTitulo.innerText()

    // La flecha de siguiente es el último enlace
    await pagination(page).locator('a').last().click()

    await expect(page).toHaveURL(/page=2/)

    // Reintenta hasta que se repinta la lista con las ofertas de la otra página
    await expect(primerTitulo).not.toHaveText(tituloPagina1)
  })
})
