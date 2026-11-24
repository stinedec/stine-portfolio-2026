import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { items } from './content'

/**
 * Scans every page with axe (https://github.com/dequelabs/axe-core) for WCAG 2.1 A and AA
 * problems, in light and dark mode and in both languages.
 *
 * axe can't measure contrast on text over the striped background image, so it skips that
 * text rather than failing it. Check those colors by eye when you change the background.
 */
const pages = [
  '/',
  '/work',
  '/about',
  '/this-page-does-not-exist',
  ...items.map((i) => `/work/${i.slug}`),
]

const variants = [
  { name: 'light', theme: 'light', locale: 'en' },
  { name: 'dark', theme: 'dark', locale: 'en' },
  { name: 'Spanish', theme: 'light', locale: 'es' },
]

for (const { name, theme, locale } of variants) {
  test.describe(`accessibility (${name})`, () => {
    // Keep the background still so the scan sees the same colors every time.
    test.use({ reducedMotion: 'reduce' })

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(
        ([theme, locale]) => {
          localStorage.setItem('theme', theme!)
          localStorage.setItem('locale', locale!)
        },
        [theme, locale],
      )
    })

    for (const path of pages) {
      test(`${path} has no axe violations`, async ({ page }) => {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toBeAttached()

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()

        // A readable summary instead of axe's full output.
        const violations = results.violations.map((v) => ({
          rule: v.id,
          impact: v.impact,
          help: v.help,
          elements: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        }))
        expect(violations).toEqual([])
      })
    }
  })
}
