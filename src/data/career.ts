/**
 * The career highlights on the About page, most recent first.
 * The text for each one lives in the locale files under `about.highlights.<key>`
 * (title and text), so it can be translated. `projects` are slugs from
 * portfolio.json: they're linked under the highlight, and their dates set the
 * years shown next to it.
 */
export interface CareerHighlight {
  key: string
  projects: string[]
  /** Show the year range from the projects' dates. Defaults to true. */
  showYears?: boolean
}

export const careerHighlights: CareerHighlight[] = [
  {
    key: 'stem',
    projects: [
      'orbit-simulator',
      'earthquake-response-simulation',
      'protecting-permafrost',
      'sound-wave-visualizer',
    ],
  },
  { key: 'sparkfun', projects: ['sparkfun-alc'] },
  {
    key: 'agency',
    projects: [
      'nrg-advocacy',
      'ending-pandemics-map',
      'toyota-quizzes',
      'gwp-regional-mobility',
      'aireon-style-guide',
      'tracfone-html5-banners',
      'straight-talk-leasing',
      'net10-leasing',
    ],
  },
  // The project date is the thesis, not necessarily the graduation year, so no years here.
  { key: 'education', projects: ['social-explorer'], showYears: false },
]

/** "2016–2022" from a list of YYYY-MM-DD dates, or a single year if they're all the same. */
export function yearRange(dates: string[]): string {
  const years = dates.map((date) => Number(date.slice(0, 4))).filter(Boolean)
  if (!years.length) return ''
  const first = Math.min(...years)
  const last = Math.max(...years)
  return first === last ? String(first) : `${first}–${last}`
}
