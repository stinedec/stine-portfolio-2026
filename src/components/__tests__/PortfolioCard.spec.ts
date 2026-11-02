import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { LocalizedPortfolioItem } from '@/data/portfolio'

import PortfolioCard from '../PortfolioCard.vue'

const item: LocalizedPortfolioItem = {
  slug: 'demo',
  title: 'Demo Project',
  date: '2026-03-01',
  image: 'portfolio/demo.jpg',
  imageAlt: 'Demo screenshot',
  summary: 'A short summary.',
  url: 'https://example.com',
  tags: ['Vue'],
  lang: 'en',
}

function mountCard() {
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/work/:slug', name: 'portfolio-item', component: { template: '<div />' } }],
  })
  return mount(PortfolioCard, { props: { item }, global: { plugins: [i18n, router] } })
}

describe('PortfolioCard', () => {
  it('shows the image, title, date and tags', () => {
    const wrapper = mountCard()
    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe('/portfolio/demo.jpg')
    expect(img.attributes('alt')).toBe('Demo screenshot')
    expect(wrapper.text()).toContain('Demo Project')
    expect(wrapper.get('time').text()).toBe('March 2026')
    expect(wrapper.text()).toContain('Vue')
  })

  it("links to the item's own page, not the external url", () => {
    const links = mountCard().findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]!.attributes('href')).toBe('/work/demo')
  })

  it("marks the item's text with its language", () => {
    const wrapper = mountCard()
    expect(wrapper.get('h3').attributes('lang')).toBe('en')
    expect(wrapper.get('img').attributes('lang')).toBe('en')
  })
})
