import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { SUPPORTED_LOCALES } from '@/i18n'

import {
  formatItemDate,
  getItemBySlug,
  getRecentItems,
  assetUrl,
  filterByTag,
  getAllTags,
  getRelatedItems,
  localizeItem,
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

describe('getAllTags', () => {
  it('lists each tag once, A to Z, with how many items use it', () => {
    const items = [{ tags: ['Vue', 'Animation'] }, { tags: ['Animation'] }, {}]
    expect(getAllTags(items)).toEqual([
      { tag: 'Animation', count: 2 },
      { tag: 'Vue', count: 1 },
    ])
  })

  it('counts a tag listed twice on one item only once', () => {
    expect(getAllTags([{ tags: ['Vue', 'Vue'] }])).toEqual([{ tag: 'Vue', count: 1 }])
  })
})

describe('getRelatedItems', () => {
  const items = [
    { slug: 'current', date: '2026-01-01', tags: ['Vue', 'Animation', 'D3'] },
    { slug: 'one-shared-new', date: '2025-06-01', tags: ['Vue'] },
    { slug: 'one-shared-old', date: '2020-01-01', tags: ['Animation'] },
    { slug: 'two-shared', date: '2019-01-01', tags: ['Vue', 'D3', 'Other'] },
    { slug: 'none-shared', date: '2026-02-01', tags: ['Other'] },
    { slug: 'no-tags', date: '2026-03-01' },
  ]
  const current = items[0]!

  it('orders by most shared tags, then newest', () => {
    expect(getRelatedItems(current, items, 9).map((i) => i.slug)).toEqual([
      'two-shared',
      'one-shared-new',
      'one-shared-old',
    ])
  })

  it('leaves out the item itself and items with no tags in common', () => {
    const slugs = getRelatedItems(current, items, 9).map((i) => i.slug)
    expect(slugs).not.toContain('current')
    expect(slugs).not.toContain('none-shared')
    expect(slugs).not.toContain('no-tags')
  })

  it('keeps only the limit', () => {
    expect(getRelatedItems(current, items, 2)).toHaveLength(2)
  })

  it('returns nothing for an item without tags', () => {
    expect(getRelatedItems(items[5]!, items, 3)).toEqual([])
  })
})

describe('filterByTag', () => {
  const items = [{ slug: 'a', tags: ['Vue'] }, { slug: 'b', tags: ['Animation'] }, { slug: 'c' }]

  it('keeps only items with the tag', () => {
    expect(filterByTag(items, 'Vue').map((i) => i.slug)).toEqual(['a'])
  })

  it('returns every item when no tag is given', () => {
    expect(filterByTag(items, undefined)).toHaveLength(3)
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

describe('localizeItem', () => {
  const base: PortfolioItem = {
    ...item('demo', '2026-01-01'),
    title: 'Demo',
    summary: 'English summary',
    role: 'Developer',
    gallery: [
      { image: 'a.jpg', alt: 'First' },
      { image: 'b.jpg', alt: 'Second' },
    ],
    videos: [
      { title: 'Walkthrough', src: 'demo.mp4', captions: 'demo.en.vtt', transcript: ['Hello'] },
    ],
    translations: {
      es: {
        title: 'Demostración',
        gallery: [{}, { alt: 'Segunda' }],
        videos: [{ title: 'Recorrido', captions: 'demo.es.vtt' }],
      },
    },
  }

  it('uses translated fields and falls back to English for the rest', () => {
    const es = localizeItem(base, 'es')
    expect(es.title).toBe('Demostración')
    expect(es.summary).toBe('English summary')
    expect(es.role).toBe('Developer')
    expect(es.lang).toBe('es')
    expect(es).not.toHaveProperty('translations')
  })

  it('matches gallery and video translations by position', () => {
    const es = localizeItem(base, 'es')
    expect(es.gallery?.map((shot) => shot.alt)).toEqual(['First', 'Segunda'])
    expect(es.gallery?.[1]?.image).toBe('b.jpg')
    expect(es.videos?.[0]).toMatchObject({
      title: 'Recorrido',
      src: 'demo.mp4',
      transcript: ['Hello'],
      captions: 'demo.es.vtt',
      captionsLang: 'es',
      captionsLabel: 'Español',
    })
  })

  it('returns the English text, marked "en", when there is no translation', () => {
    const fr = localizeItem(base, 'fr')
    expect(fr.title).toBe('Demo')
    expect(fr.lang).toBe('en')
    expect(localizeItem(base, 'en').lang).toBe('en')
  })

  it('does not change the original item', () => {
    localizeItem(base, 'es')
    expect(base.title).toBe('Demo')
    expect(base.gallery?.[1]?.alt).toBe('Second')
  })
})

describe('formatItemDate', () => {
  it('shows month and year without shifting the day across time zones', () => {
    expect(formatItemDate('2026-03-01', 'en')).toBe('March 2026')
    expect(formatItemDate('2026-03-01', 'es')).toBe('marzo de 2026')
  })
})

describe('assetUrl', () => {
  it('prefixes local paths with the base URL', () => {
    expect(assetUrl('portfolio/a.jpg')).toBe('/portfolio/a.jpg')
    expect(assetUrl('/portfolio/a.jpg')).toBe('/portfolio/a.jpg')
  })

  it('leaves full URLs alone', () => {
    expect(assetUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg')
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

  const translations = portfolioItems.flatMap((entry) =>
    Object.entries(entry.translations ?? {}).map(([locale, tr]) => ({ entry, locale, tr })),
  )

  it.each(translations)(
    '$entry.slug has a valid "$locale" translation',
    ({ entry, locale, tr }) => {
      expect(SUPPORTED_LOCALES).toContain(locale)
      expect(locale).not.toBe('en')
      // Position-matched lists can't be longer than the lists they translate.
      expect(tr.gallery?.length ?? 0).toBeLessThanOrEqual(entry.gallery?.length ?? 0)
      expect(tr.videos?.length ?? 0).toBeLessThanOrEqual(entry.videos?.length ?? 0)
      // Captions only work on self-hosted videos.
      const captionedWithoutSrc = (tr.videos ?? []).filter(
        (video, i) => video.captions && !entry.videos?.[i]?.src,
      )
      expect(captionedWithoutSrc).toEqual([])
    },
  )

  const videos = portfolioItems.flatMap((entry) =>
    (entry.videos ?? []).map((video) => ({ ...video, item: entry.slug })),
  )

  it.each(videos)('$item video "$title" has one source and captions or a transcript', (video) => {
    const sources = [video.src, video.youtubeId, video.vimeoId].filter(Boolean)
    expect(sources).toHaveLength(1)
    expect(video.title.trim()).not.toBe('')
    expect(Boolean(video.captions) || Boolean(video.transcript?.length)).toBe(true)
    expect(Boolean(video.captions) && !video.src).toBe(false)
  })

  const localFiles = portfolioItems
    .flatMap((entry) => [
      entry.image,
      ...(entry.gallery ?? []).map((shot) => shot.image),
      ...(entry.videos ?? []).flatMap((video) => [video.src, video.poster, video.captions]),
      ...Object.values(entry.translations ?? {}).flatMap((tr) =>
        (tr.videos ?? []).map((video) => video.captions),
      ),
    ])
    .filter((path): path is string => !!path && !isRemote(path))

  it.each(localFiles)('%s exists in public/', (path) => {
    expect(existsSync(resolve(publicDir, path.replace(/^\//, '')))).toBe(true)
  })
})
