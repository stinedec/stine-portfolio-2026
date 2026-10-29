import { expect, test } from '@playwright/test'

test('home page renders and the counter increments', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio')

  const count = page.getByTestId('count')
  await expect(count).toContainText('Count: 0')
  await page.getByRole('button', { name: 'Increment' }).click()
  await expect(count).toContainText('Count: 1')
})

test('navigates to About and updates the document title', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page).toHaveTitle(/^About ·/)
})

test('unknown routes show the 404 page', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('switching language translates the page', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Language').selectOption('es')
  await expect(page.getByRole('button', { name: 'Incrementar' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})
