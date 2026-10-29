import { expect, test } from '@playwright/test'

test('home page shows the intro and the nine most recent portfolio items', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Christine.")

  const recentWork = page.getByRole('region', { name: 'Recent work' })
  await expect(recentWork.getByRole('article')).toHaveCount(9)
  await expect(recentWork.getByRole('img').first()).toBeVisible()

  const expertise = page.getByRole('region', { name: 'What I bring' })
  await expect(expertise.getByRole('heading', { level: 3 })).toHaveText([
    'Design',
    'Accessibility',
    'Interactive development',
  ])
})

test('a portfolio card opens that item’s page', async ({ page }) => {
  await page.goto('/')
  const card = page.getByRole('region', { name: 'Recent work' }).getByRole('article').first()
  const title = (await card.getByRole('heading').textContent())!.trim()

  await card.click()
  await expect(page).toHaveURL(/\/work\/[a-z0-9-]+$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  await expect(page).toHaveTitle(`${title} · Portfolio`)

  await page.getByRole('link', { name: 'All work' }).click()
  await expect(page).toHaveURL(/\/work$/)
})

test('See all work opens the full portfolio page with every item', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'See all work' }).click()
  await expect(page).toHaveURL(/\/work$/)
  await expect(page).toHaveTitle(/^Work ·/)

  const grid = page.getByRole('region', { name: 'Work' })
  await expect(grid.getByRole('article')).toHaveCount(10)
  // The oldest item isn't on the homepage, but it is here.
  await grid.getByRole('link', { name: 'Sample Project 1', exact: true }).click()
  await expect(page).toHaveURL(/\/work\/sample-project-01$/)
})

test('item pages load directly and unknown items show the 404 page', async ({ page }) => {
  await page.goto('/work/sample-project-01')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sample Project 1')

  await page.goto('/work/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await expect(page).toHaveURL(/\/work\/does-not-exist$/)
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
  await expect(page.getByRole('heading', { name: 'Trabajo reciente' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})
