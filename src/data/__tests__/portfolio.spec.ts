import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  formatItemDate,
  getItemBySlug,
  getRecentItems,
  imageUrl,
  portfolioItems,
  type PortfolioItem,
} from '../portfolio'

// Vitest runs from the project root (see vitest.config.ts).
const publicDir = resolve(process.cwd(), 'public')
const isRemote = (image: string) => /^(https?:)?\/\//.test(image)

function item(slug: string, date: string): PortfolioItem {
  return { slug, title: slug, date, image: `${slug}.jpg`, imageAlt: slug, summary: '' }
}

describe('getRecentItems', () => {
  it('sorts newest first and keeps only the limit', () => {
    const items = [item('b', '2025-06-01'), item('c', '2026-01-01'), item('a', '2024-01-01')]
    expect(getRecentItems(items, 2).map((i) => i.slug)).toEqual(['c', 'b'])
  })

  it('does not reorder the original array', () => {
    const items = [item('a', '2024-01-01'), item('b', '2025-01-01')]
    getRecentItems(items, 9)
    expect(items.map((i) => i.slug)).toEqual(['a', 'b'])
  })
})

describe('getItemBySlug', () => {
  it('finds an item from portfolio.json', () => {
    const first = portfolioItems[0]!
    expect(getItemBySlug(first.slug)).toBe(first)
  })

  it('returns undefined for an unknown slug', () => {
    expect(getItemBySlug('no-such-project')).toBeUndefined()
  })
})

describe('formatItemDate', () => {
  it('shows month and year without shifting the day across time zones', () => {
    expect(formatItemDate('2026-03-01', 'en')).toBe('March 2026')
    expect(formatItemDate('2026-03-01', 'es')).toBe('marzo de 2026')
  })
})

describe('imageUrl', () => {
  it('prefixes local paths with the base URL', () => {
    expect(imageUrl('portfolio/a.jpg')).toBe('/portfolio/a.jpg')
    expect(imageUrl('/portfolio/a.jpg')).toBe('/portfolio/a.jpg')
  })

  it('leaves full URLs alone', () => {
    expect(imageUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg')
  })
})

// Catches typos in portfolio.json before they reach the site.
describe('portfolio.json', () => {
  it('has unique slugs', () => {
    const slugs = portfolioItems.map((i) => i.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(portfolioItems)('$slug has a valid date and alt text', (entry) => {
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(entry.date))).toBe(false)
    expect(entry.imageAlt.trim()).not.toBe('')
  })

  it('has slugs that are safe to use in URLs', () => {
    for (const entry of portfolioItems) expect(entry.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  const localImages = portfolioItems
    .flatMap((entry) => [entry.image, ...(entry.gallery ?? []).map((shot) => shot.image)])
    .filter((image) => !isRemote(image))

  it.each(localImages)('%s exists in public/', (image) => {
    expect(existsSync(resolve(publicDir, image.replace(/^\//, '')))).toBe(true)
  })
})
