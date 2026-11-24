import { describe, expect, it } from 'vitest'

import en from '@/locales/en.json'
import es from '@/locales/es.json'

import { careerHighlights, yearRange } from '../career'
import { getItemBySlug } from '../portfolio'

describe('yearRange', () => {
  it('shows first and last year', () => {
    expect(yearRange(['2022-09-27', '2016-08-10', '2019-02-27'])).toBe('2016–2022')
  })

  it('shows one year when they are all the same', () => {
    expect(yearRange(['2020-11-27', '2020-01-01'])).toBe('2020')
  })

  it('is empty with no dates', () => {
    expect(yearRange([])).toBe('')
  })
})

// Catches a renamed project or a missing translation before it reaches the About page.
describe('careerHighlights', () => {
  it.each(careerHighlights)('$key links only to projects that exist', ({ projects }) => {
    const missing = projects.filter((slug) => !getItemBySlug(slug))
    expect(missing).toEqual([])
  })

  it.each(careerHighlights)('$key has a title and text in every language', ({ key }) => {
    for (const messages of [en, es]) {
      const highlight = (
        messages.about.highlights as Record<string, { title: string; text: string }>
      )[key]
      expect(highlight?.title).toBeTruthy()
      expect(highlight?.text).toBeTruthy()
    }
  })
})
