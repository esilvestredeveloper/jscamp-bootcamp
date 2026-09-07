// @ts-check
import { expect, test } from '@playwright/test'

const APP_URL = 'http://localhost:5173'

test('la página principal carga con el buscador visible', async ({ page }) => {
  await page.goto(APP_URL)

  // Pedimos el rol antes que el CSS, cambia mucho menos con los refactors
  await expect(page.getByRole('searchbox')).toBeVisible()
})
