import portfolioData from './portfolio.json'

/** One entry in `portfolio.json`. */
export interface PortfolioItem {
  /** Unique, URL-safe id, e.g. "my-project". */
  slug: string
  title: string
  /** Completion or publish date as YYYY-MM-DD. Used for sorting. */
  date: string
  /** Preview image path inside `public/`, e.g. "portfolio/my-project.jpg". */
  image: string
  /** Describes the image for screen readers. */
  imageAlt: string
  /** Short text for the homepage card. Also the intro on the item's page. */
  summary: string
  /** Optional longer write-up for the item's page, one string per paragraph. */
  description?: string[]
  /** Optional: your role on the project, e.g. "Sole front-end developer". */
  role?: string
  /** Optional extra images for the item's page. */
  gallery?: { image: string; alt: string }[]
  /** Optional link to the live project or repo, shown as a button on the item's page. */
  url?: string
  tags?: string[]
}

// Typing the JSON here means a missing or misspelled field is a type error.
export const portfolioItems: PortfolioItem[] = portfolioData

/** The item with this slug, or undefined if there isn't one. */
export function getItemBySlug(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.slug === slug)
}

/** Newest first, by `date`. */
export function getRecentItems(items: PortfolioItem[], limit: number): PortfolioItem[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

/** Formats a YYYY-MM-DD date as month and year, e.g. "March 2026". */
export function formatItemDate(date: string, locale: string): string {
  // Format in UTC so a YYYY-MM-DD date never shows as the previous day.
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))
}

/** Turns an image path from the JSON into a URL that works under any base path. */
export function imageUrl(image: string): string {
  if (/^(https?:)?\/\//.test(image)) return image
  return import.meta.env.BASE_URL + image.replace(/^\//, '')
}
