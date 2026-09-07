// @ts-check
import { expect, test } from '@playwright/test'

const APP_URL = 'http://localhost:5173'

// Buscamos la tarjeta de oferta
const jobCards = (page) => page.locator('.job-listing-card')

// La app tiene otro nav en la cabecera, cogemos el que lleva los números de página
const pagination = (page) =>
  page.locator('nav').filter({ has: page.getByRole('link', { name: '1', exact: true }) })

const segundaPagina = (page) => pagination(page).getByRole('link', { name: '2', exact: true })

// Buscamos desde la home y esperamos a que lleguen las ofertas de la API
const buscar = async (page, texto) => {
  await page.goto(APP_URL)

  await page.getByRole('searchbox').fill(texto)
  await page.getByRole('button', { name: 'Buscar' }).click()

  await expect(jobCards(page).first()).toBeVisible()
}

// Entramos directos al listado cuando lo que probamos no es la búsqueda
const irAlListado = async (page, query = '') => {
  await page.goto(`${APP_URL}/search${query}`)

  await expect(jobCards(page).first()).toBeVisible()
}

// Apartado de login
const iniciarSesion = async (page) => {
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
}

// Abrimos la primera oferta y devolvemos su título
const abrirPrimeraOferta = async (page) => {
  const oferta = jobCards(page).first()
  const titulo = await oferta.getByRole('heading', { level: 3 }).innerText()

  await oferta.getByRole('link').click()

  // En el detalle el mismo título pasa de h3 a h1
  await expect(page.getByRole('heading', { level: 1, name: titulo })).toBeVisible()

  return titulo
}

// La ficha repite el botón arriba y abajo, pulsamos el primero
const aplicar = async (page) => {
  await page.getByRole('button', { name: 'Aplicar ahora' }).first().click()

  await expect(page.getByRole('button', { name: 'Aplicado' }).first()).toBeVisible()
}

test('la página principal carga con el buscador visible', async ({ page }) => {
  await page.goto(APP_URL)

  // Pedimos el rol antes que el CSS
  await expect(page.getByRole('searchbox')).toBeVisible()
})

test('buscar por tecnología devuelve resultados', async ({ page }) => {
  await buscar(page, 'React')

  await expect(jobCards(page)).not.toHaveCount(0)
})

test('un usuario puede entrar en una oferta y aplicar', async ({ page }) => {
  await buscar(page, 'JavaScript')
  await abrirPrimeraOferta(page)

  // Sin sesión iniciada la app no deja aplicar
  await expect(page.getByRole('button', { name: 'Inicia sesión para aplicar' }).first()).toBeDisabled()

  await iniciarSesion(page)
  await aplicar(page)
})

test.describe('filtros', () => {
  test('filtrar por ubicación deja solo ofertas remotas', async ({ page }) => {
    await irAlListado(page)

    // Los select no tienen label, así que los pedimos por id
    await page.locator('#filter-location').selectOption('remoto')

    await expect(page).toHaveURL(/type=remoto/)
    await expect(jobCards(page)).not.toHaveCount(0)

    // Cada tarjeta pinta "Empresa | Ubicación", no debe quedar ninguna sin Remoto
    await expect(jobCards(page).filter({ hasNotText: 'Remoto' })).toHaveCount(0)
  })

  test('filtrar por nivel deja solo ofertas senior', async ({ page }) => {
    await irAlListado(page)

    await page.locator('#filter-experience-level').selectOption('senior')

    await expect(page).toHaveURL(/level=senior/)
    await expect(jobCards(page)).not.toHaveCount(0)

    // El nivel no sale en el texto de la tarjeta, lo lleva en un data attribute
    await expect(page.locator('.job-listing-card:not([data-nivel="senior"])')).toHaveCount(0)
  })
})

test.describe('paginación', () => {
  test('aparece la paginación cuando hay más ofertas de las que caben', async ({ page }) => {
    await irAlListado(page)

    // Si hay enlace a la segunda es que no caben todas en la primera
    await expect(segundaPagina(page)).toBeVisible()
  })

  test('con una sola oferta no hay más páginas', async ({ page }) => {
    // Búsqueda estrecha a propósito, de esta solo hay una oferta
    await irAlListado(page, '?text=ciberseguridad')

    await expect(jobCards(page)).toHaveCount(1)

    // El bloque se sigue pintando aunque sobre, por eso lo damos por visible
    await expect(pagination(page)).toBeVisible()
    await expect(segundaPagina(page)).toHaveCount(0)
  })

  test('pasar a la siguiente página cambia los resultados', async ({ page }) => {
    await irAlListado(page)

    const primerTitulo = jobCards(page).first().getByRole('heading', { level: 3 })
    const tituloPagina1 = await primerTitulo.innerText()

    // La flecha de siguiente es el último enlace
    await pagination(page).locator('a').last().click()

    await expect(page).toHaveURL(/page=2/)

    // Reintenta hasta que se repinta la lista con las ofertas de la otra página
    await expect(primerTitulo).not.toHaveText(tituloPagina1)
  })
})

test.describe('detalle de la oferta', () => {
  test('el detalle muestra la información de la oferta', async ({ page }) => {
    await irAlListado(page)
    await abrirPrimeraOferta(page)

    await expect(page).toHaveURL(/\/job\//)

    // Las secciones que arma la ficha con el contenido que llega de la API
    await expect(page.getByRole('heading', { level: 2, name: 'Descripción del puesto' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Requisitos' })).toBeVisible()

    // Desde la ficha se puede volver al listado
    await expect(page.getByRole('navigation', { name: 'Migas de pan' })).toBeVisible()
  })

  test('aplicar desde el detalle deja los dos botones como aplicado', async ({ page }) => {
    await irAlListado(page)
    await iniciarSesion(page)
    await abrirPrimeraOferta(page)

    await expect(page.getByRole('button', { name: 'Aplicar ahora' }).first()).toBeVisible()

    await aplicar(page)

    // La ficha repite el botón arriba y abajo, los dos tienen que enterarse
    await expect(page.getByRole('button', { name: 'Aplicado' })).toHaveCount(2)
  })
})
