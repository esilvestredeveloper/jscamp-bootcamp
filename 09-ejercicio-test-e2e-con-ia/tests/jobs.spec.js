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
