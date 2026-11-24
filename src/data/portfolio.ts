import portfolioData from './portfolio.json'

/** One entry in `portfolio.json`. */
export interface PortfolioItem {
  /** Unique, URL-safe id, e.g. "my-project". */
  slug: string
  title: string
  /** Completion or publish date as YYYY-MM-DD. Used for sorting. */
  date: string
  /** Image on the project's card, a path inside `public/`, e.g. "portfolio/my-project-card.jpg". Shown at 4:3. */
  cardImage: string
  /** Describes the card image for screen readers. */
  cardImageAlt: string
  /** Image at the top of the project's page, a path inside `public/`, e.g. "portfolio/my-project.jpg". */
  headerImage: string
  /** Describes the header image for screen readers. */
  headerImageAlt: string
  /** Short text for the homepage card. Also the intro on the item's page. */
  summary: string
  /** Optional longer write-up for the item's page, one string per paragraph. */
  description?: string[]
  /** Optional list of technologies used in the project. */
  technologies?: string[]
  /** Optional: your role on the project, e.g. "Sole front-end developer". */
  role?: string
  /** Optional company associated with the project. */
  company?: string
  /** Optional client associated with the project. */
  client?: string
  /** Optional extra images for the item's page. */
  gallery?: { image: string; alt: string }[]
  /** Optional videos for the item's page. */
  videos?: PortfolioVideo[]
  /** Optional link to the live project or repo, shown as a button on the item's page. */
  url?: string
  tags?: string[]
  /**
   * Optional translations, keyed by locale, e.g. `{ "es": { "title": "…" } }`.
   * Any field left out falls back to the English value above.
   */
  translations?: Record<string, PortfolioItemTranslation>
}

/**
 * The text of an item in another language. Every field is optional.
 * `gallery` and `videos` match the item's own lists by position: the first entry
 * here translates the first image or video, and so on. Use `{}` to skip one.
 */
export interface PortfolioItemTranslation {
  title?: string
  cardImageAlt?: string
  headerImageAlt?: string
  summary?: string
  description?: string[]
  technologies?: string[]
  role?: string
  gallery?: { alt?: string }[]
  videos?: PortfolioVideoTranslation[]
}

/** The text of a video in another language, plus an optional captions file in that language. */
export type PortfolioVideoTranslation = Partial<
  Pick<
    PortfolioVideo,
    'title' | 'description' | 'transcript' | 'captions' | 'captionsLang' | 'captionsLabel'
  >
>

/** An item with its text in one language, ready to show. */
export type LocalizedPortfolioItem = Omit<PortfolioItem, 'translations'> & {
  /**
   * Language of the item's text: the requested locale if the item has a translation
   * for it, otherwise "en". Set it as the `lang` attribute so screen readers
   * pronounce the text correctly.
   */
  lang: string
}

/**
 * A video on an item's page. Set exactly one of `src`, `youtubeId` or `vimeoId`.
 * Every video needs `captions` or a `transcript` so people who can't hear it can follow along.
 */
export interface PortfolioVideo {
  /** Shown above the video and used as its accessible name. */
  title: string
  /** Optional sentence shown under the title. */
  description?: string
  /** Self-hosted video: a path inside `public/` (e.g. "portfolio/demo.mp4") or a full URL. */
  src?: string
  /** Image shown before the video plays. Self-hosted videos only. */
  poster?: string
  /** WebVTT captions file (.vtt) for a self-hosted video. */
  captions?: string
  /** Language of the captions file. Defaults to "en". */
  captionsLang?: string
  /** Name of the captions track in the player menu. Defaults to "English". */
  captionsLabel?: string
  /** YouTube video id, e.g. "dQw4w9WgXcQ". Embedded with youtube-nocookie.com. */
  youtubeId?: string
  /** Vimeo video id, e.g. "76979871". */
  vimeoId?: string
  /** Optional text transcript, one string per paragraph. Shown in an expandable section. */
  transcript?: string[]
}

// Typing the JSON here means a missing or misspelled field is a type error.
export const portfolioItems: PortfolioItem[] = portfolioData

/** The item with this slug, or undefined if there isn't one. */
export function getItemBySlug(slug: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.slug === slug)
}

/**
 * The item with its text in `locale`. Fields without a translation keep their
 * English value, so a partial translation never leaves anything blank.
 */
export function localizeItem(item: PortfolioItem, locale: string): LocalizedPortfolioItem {
  const { translations, ...base } = item
  const tr = translations?.[locale]
  if (!tr) return { ...base, lang: 'en' }

  return {
    ...base,
    title: tr.title ?? base.title,
    cardImageAlt: tr.cardImageAlt ?? base.cardImageAlt,
    headerImageAlt: tr.headerImageAlt ?? base.headerImageAlt,
    summary: tr.summary ?? base.summary,
    description: tr.description ?? base.description,
    technologies: tr.technologies ?? base.technologies,
    role: tr.role ?? base.role,
    gallery: base.gallery?.map((shot, i) => ({ ...shot, alt: tr.gallery?.[i]?.alt ?? shot.alt })),
    videos: base.videos?.map((video, i) => {
      const vt = tr.videos?.[i]
      if (!vt) return video
      // A translated captions file replaces the English one, so its language and
      // label must not default to the English track's.
      const captions = vt.captions
        ? {
            captions: vt.captions,
            captionsLang: vt.captionsLang ?? locale,
            captionsLabel: vt.captionsLabel ?? languageName(locale),
          }
        : {}
      return {
        ...video,
        title: vt.title ?? video.title,
        description: vt.description ?? video.description,
        transcript: vt.transcript ?? video.transcript,
        ...captions,
      }
    }),
    lang: locale,
  }
}

/** A language's name in that language, e.g. "español" for "es". */
function languageName(locale: string): string {
  const name = new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1)
}

/** Every tag used by these items, A to Z, with how many items use it. */
export function getAllTags(items: { tags?: string[] }[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tag of new Set(item.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag))
}

/** Every technology used across these items, most used first, then A to Z. */
export function getAllTechnologies(items: { technologies?: string[] }[]): string[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tech of new Set(item.technologies)) counts.set(tech, (counts.get(tech) ?? 0) + 1)
  }
  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .map(([tech]) => tech)
}

/**
 * Other items that share tags with `item`, best match first: the most shared
 * tags, then the newest. Items with no tags in common are left out.
 */
export function getRelatedItems<T extends { slug: string; date: string; tags?: string[] }>(
  item: T,
  items: T[],
  limit: number,
): T[] {
  const tags = new Set(item.tags)
  return items
    .filter((other) => other.slug !== item.slug)
    .map((other) => ({
      other,
      shared: new Set(other.tags?.filter((tag) => tags.has(tag))).size,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || b.other.date.localeCompare(a.other.date))
    .slice(0, limit)
    .map(({ other }) => other)
}

/** Items with this tag, or all items when `tag` is undefined. */
export function filterByTag<T extends { tags?: string[] }>(
  items: T[],
  tag: string | undefined,
): T[] {
  return tag ? items.filter((item) => item.tags?.includes(tag)) : items
}

/** Newest first, by `date`. */
export function getRecentItems<T extends { date: string }>(items: T[], limit: number): T[] {
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

/** Turns a file path from the JSON (image, video, captions) into a URL that works under any base path. */
export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

/**
 * Player URL for a YouTube or Vimeo video, or undefined for a self-hosted one.
 * Uses each site's privacy-friendly mode so visitors aren't tracked until they press play.
 */
export function videoEmbedUrl(video: PortfolioVideo): string | undefined {
  if (video.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?rel=0`
  }
  if (video.vimeoId) {
    return `https://player.vimeo.com/video/${encodeURIComponent(video.vimeoId)}?dnt=1`
  }
  return undefined
}
