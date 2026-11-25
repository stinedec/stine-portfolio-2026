import { expect, test } from '@playwright/test'

import {
  appTitle,
  captionedVideo,
  en,
  items,
  selfHostedVideo,
  translatedItem,
  untranslatedItem,
} from './content'

const oldest = items.at(-1)!

test('home page shows the intro and the six most recent portfolio items', async ({ page }) => {
  await page.goto('/')
  // One main heading for screen readers. It's visually hidden; the styled
  // title shown instead is hidden from screen readers.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.home.greeting)

  const recentWork = page.getByRole('region', { name: 'Recent work' })
  await expect(recentWork.getByRole('article')).toHaveCount(Math.min(6, items.length))
  await expect(recentWork.getByRole('article').first().getByRole('heading')).toHaveText(
    items[0]!.title,
  )
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
  await expect(page).toHaveTitle(`${title} · ${appTitle}`)

  await page.getByRole('link', { name: 'All work' }).click()
  await expect(page).toHaveURL(/\/work$/)
})

test('See all work opens the full portfolio page with every item', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'See all work' }).click()
  await expect(page).toHaveURL(/\/work$/)
  await expect(page).toHaveTitle(/^Work ·/)

  const grid = page.getByRole('region', { name: 'Work' })
  await expect(grid.getByRole('article')).toHaveCount(items.length)
  // The oldest item isn't on the homepage, but it is here.
  await grid.getByRole('link', { name: oldest.title, exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/work/${oldest.slug}$`))
})

test('item pages load directly and unknown items show the 404 page', async ({ page }) => {
  await page.goto(`/work/${oldest.slug}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(oldest.title)

  await page.goto('/work/does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await expect(page).toHaveURL(/\/work\/does-not-exist$/)
})

test('item pages play self-hosted videos, named by their title', async ({ page }) => {
  test.skip(!selfHostedVideo, 'No project has a self-hosted video yet.')
  const { item, video } = selfHostedVideo!
  await page.goto(`/work/${item.slug}`)

  const player = page.getByRole('region', { name: 'Videos' }).locator('video').first()
  await expect(player).toHaveAccessibleName(video.title)
  // The video file is found and its metadata loads.
  await expect.poll(() => player.evaluate((el: HTMLVideoElement) => el.readyState >= 1)).toBe(true)
})

test('video captions are on by default', async ({ page }) => {
  test.skip(!captionedVideo, 'No self-hosted video has a captions file yet.')
  const { item, video } = captionedVideo!
  await page.goto(`/work/${item.slug}`)

  const player = page
    .getByRole('region', { name: 'Videos' })
    .getByRole('figure', {
      name: video.title,
    })
    .locator('video')
  await expect
    .poll(() => player.evaluate((el: HTMLVideoElement) => el.textTracks[0]?.mode))
    .toBe('showing')
})

test('video transcripts open from their summary', async ({ page }) => {
  const withTranscript = items
    .flatMap((item) => (item.videos ?? []).map((video) => ({ item, video })))
    .find(({ video }) => video.transcript?.length)
  test.skip(!withTranscript, 'No video has a transcript yet.')
  const { item, video } = withTranscript!
  await page.goto(`/work/${item.slug}`)

  const figure = page.getByRole('figure', { name: video.title })
  await figure.getByText('Transcript').click()
  await expect(figure.getByText(video.transcript![0]!)).toBeVisible()
})

test('navigates to About and updates the document title', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page).toHaveTitle(/^About ·/)
})

test('the About page summarizes my career and links to projects', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')

  const highlights = page.getByRole('region', { name: 'Career highlights' })
  await expect(highlights.getByRole('listitem').first()).toBeVisible()

  // Project links under a highlight open that project.
  const link = highlights.getByRole('link').first()
  const title = (await link.innerText()).trim()
  await link.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
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

test('switching language translates portfolio items that have a translation', async ({ page }) => {
  test.skip(!translatedItem, 'No project has a Spanish translation yet.')
  const spanishTitle = translatedItem!.translations!.es!.title!
  await page.goto(`/work/${translatedItem!.slug}`)
  await page.getByLabel('Language').selectOption('es')

  const title = page.getByRole('heading', { level: 1, name: spanishTitle })
  await expect(title).toHaveAttribute('lang', 'es')
  await expect(page).toHaveTitle(`${spanishTitle} · ${appTitle}`)
})

test('untranslated projects keep their English text, marked as English', async ({ page }) => {
  test.skip(!untranslatedItem, 'Every project has a Spanish translation.')
  await page.goto('/work')
  await page.getByLabel('Language').selectOption('es')

  const title = page.getByRole('heading', { name: untranslatedItem!.title, exact: true })
  await expect(title).toHaveAttribute('lang', 'en')
})

test('the work page filters projects by tag', async ({ page }) => {
  await page.goto('/work')
  const grid = page.getByRole('region', { name: 'Work' })
  const filters = page.getByRole('group', { name: 'Filter by tag' })
  const all = filters.getByRole('button', { name: 'All' })
  const total = await grid.getByRole('article').count()
  await expect(all).toHaveAttribute('aria-pressed', 'true')

  // The first tag after "All". Its button shows how many projects use it.
  const tagButton = filters.getByRole('button').nth(1)
  const tag = (await tagButton.getAttribute('aria-label')) ?? (await tagButton.innerText())
  const tagName = tag.replace(/\s*\d+$/, '')
  const count = Number(await tagButton.locator('.filter-chip__count').innerText())

  await tagButton.click()
  await expect(tagButton).toHaveAttribute('aria-pressed', 'true')
  await expect(all).toHaveAttribute('aria-pressed', 'false')
  await expect(page).toHaveURL(
    new RegExp(`\\?tag=${encodeURIComponent(tagName).replace(/%20/g, '(%20|\\+)')}$`),
  )
  await expect(grid.getByRole('article')).toHaveCount(count)
  for (const card of await grid.getByRole('article').all()) {
    await expect(card.getByRole('listitem').filter({ hasText: tagName })).toHaveCount(1)
  }

  // A filtered link works when opened directly.
  await page.reload()
  await expect(grid.getByRole('article')).toHaveCount(count)

  await all.click()
  await expect(page).toHaveURL(/\/work$/)
  await expect(grid.getByRole('article')).toHaveCount(total)
})

test('project pages link to related projects that share a tag', async ({ page }) => {
  const item = items.find((i) =>
    items.some((o) => o !== i && o.tags?.some((t) => i.tags?.includes(t))),
  )
  test.skip(!item, 'No two projects share a tag.')
  await page.goto(`/work/${item!.slug}`)

  const related = page.getByRole('region', { name: 'Related projects' })
  const cards = related.getByRole('article')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeLessThanOrEqual(3)

  // Every related card shares at least one tag with this project, and isn't this project.
  for (const card of await cards.all()) {
    await expect(card.getByRole('heading')).not.toHaveText(item!.title)
    const cardTags = await card.getByRole('listitem').allInnerTexts()
    expect(cardTags.some((tag) => item!.tags!.includes(tag.trim()))).toBe(true)
  }

  // Clicking one opens that project.
  const title = (await cards.first().getByRole('heading').innerText()).trim()
  await cards.first().getByRole('link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
})

test('old project addresses redirect to the project that replaced them', async ({ page }) => {
  for (const oldSlug of ['net10-leasing', 'straight-talk-leasing']) {
    await page.goto(`/work/${oldSlug}`)
    await expect(page).toHaveURL(/\/work\/net10-straight-talk-leasing$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Net10 and Straight Talk Leasing',
    )
  }
})
