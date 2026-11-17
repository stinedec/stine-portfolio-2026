// The site's real content, so tests check what's actually there instead of
// hard-coded names that break whenever a project is added or renamed.
import { readFileSync } from 'node:fs'

interface Video {
  title: string
  src?: string
  captions?: string
  transcript?: string[]
}

interface Item {
  slug: string
  title: string
  date: string
  videos?: Video[]
  translations?: Record<string, { title?: string }>
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8')) as T
}

/** Every portfolio item, newest first (the order the site shows them in). */
export const items = readJson<Item[]>('../src/data/portfolio.json').sort((a, b) =>
  b.date.localeCompare(a.date),
)

/** The site name from .env (VITE_APP_TITLE), shown after each page's title in the browser tab. */
export const appTitle =
  /^VITE_APP_TITLE=(.*)$/m
    .exec(readFileSync(new URL('../.env', import.meta.url), 'utf8'))?.[1]
    ?.trim() || 'Portfolio'

export const en = readJson<{ home: { greeting: string } }>('../src/locales/en.json')

/** The first item with a self-hosted video, and that video. */
export const selfHostedVideo = items
  .flatMap((item) => (item.videos ?? []).map((video) => ({ item, video })))
  .find(({ video }) => video.src)

/** The first self-hosted video that has a captions file. */
export const captionedVideo = items
  .flatMap((item) => (item.videos ?? []).map((video) => ({ item, video })))
  .find(({ video }) => video.src && video.captions)

/** The first item with a Spanish title, and the first item with no Spanish translation. */
export const translatedItem = items.find((item) => item.translations?.es?.title)
export const untranslatedItem = items.find((item) => !item.translations?.es)
