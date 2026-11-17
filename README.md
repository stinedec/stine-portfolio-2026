# Portfolio

My portfolio site, built from my Vue 3 + Vite starter.

## Editing portfolio items

Portfolio items live in [`src/data/portfolio.json`](src/data/portfolio.json). The homepage shows the nine most recent, sorted by `date`, with a "See all work" link to `/work`, which shows every item.

1. Put the preview image in `public/portfolio/`. A 4:3 image around 1200×900 works best.
2. Add an entry to `portfolio.json`:

```json
{
  "slug": "my-project",
  "title": "My Project",
  "date": "2026-10-01",
  "image": "portfolio/my-project.jpg",
  "imageAlt": "Screenshot of the My Project dashboard",
  "summary": "One or two sentences about the project and your role.",
  "url": "https://example.com",
  "tags": ["Vue", "UI/UX"]
}
```

Each item also gets its own page at `/work/<slug>`, which the homepage card links to. That page uses the same entry, plus these optional fields:

```json
{
  "role": "Sole front-end developer",
  "description": ["First paragraph.", "Second paragraph."],
  "gallery": [{ "image": "portfolio/my-project-2.jpg", "alt": "Mobile layout" }]
}
```

`url`, `tags`, `role`, `description` and `gallery` are all optional. `url` shows as a "Visit project" button on the item's page. `image` can also be a full `https://` URL. Field types are defined in [`src/data/portfolio.ts`](src/data/portfolio.ts), and `npm test` checks that every slug is unique, every date is valid and every local image (including gallery images) exists.

The intro blurb is in `src/locales/en.json` (and `es.json`) under `home`.

| Area      | Choice                                                                                |
| --------- | ------------------------------------------------------------------------------------- |
| Framework | Vue 3 (Composition API, `<script setup>`), Vite 7                                     |
| Language  | TypeScript (strict), type-checked with `vue-tsc`                                      |
| Routing   | Vue Router with lazy-loaded routes and i18n'd document titles                         |
| State     | Pinia (setup-style stores)                                                            |
| Styling   | Plain CSS with BEM class names, design tokens in `src/assets/styles/tokens.css`       |
| i18n      | vue-i18n (Composition mode), JSON locales precompiled by `@intlify/unplugin-vue-i18n` |
| PWA       | `vite-plugin-pwa`: manifest and an auto-updating service worker                       |
| Testing   | Vitest + Vue Test Utils (unit), Playwright (e2e)                                      |
| Quality   | ESLint flat config (Vue, TS, a11y, Vitest, Playwright) + Prettier                     |

## Getting started

Requires Node `^20.19` or `>=22.12` (`nvm use` picks up `.nvmrc`).

```sh
npm install
npx playwright install chromium   # one-time, for e2e tests
npm run dev
```

## Scripts

| Script                  | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Vite dev server at http://localhost:5173              |
| `npm run build`         | Type-check and production build (in parallel)         |
| `npm run preview`       | Serve the production build at http://localhost:4173   |
| `npm run type-check`    | `vue-tsc --build` across app, node and test configs   |
| `npm test`              | Run unit tests once                                   |
| `npm run test:unit`     | Vitest in watch mode                                  |
| `npm run test:coverage` | Unit tests with V8 coverage                           |
| `npm run test:e2e`      | Playwright (starts the dev server automatically)      |
| `npm run lint`          | ESLint with `--fix` (`lint:check` for CI)             |
| `npm run format`        | Prettier on `src/` and `e2e/` (`format:check` for CI) |

## Project structure

```
src/
  assets/        # global CSS: tokens, reset, base and shared blocks
  components/    # shared UI (BaseButton, AppHeader, LocaleSwitcher, PortfolioCard, PortfolioGrid)
  composables/   # reusable useX() logic (useDarkMode)
  data/          # portfolio.json and its types
  i18n/          # vue-i18n instance, setLocale(), supported locales
  layouts/       # app shells (DefaultLayout: skip link, header, main, footer)
  locales/       # en.json (source of truth), es.json
  router/        # routes + typed RouteMeta
  services/      # API layer (typed fetch wrapper + HttpError)
  stores/        # Pinia stores (none yet)
  views/         # route-level pages
  App.vue
  main.ts
e2e/             # Playwright specs
public/          # static files, PWA icons, portfolio/ preview images
```

Unit tests live next to the code they cover in `__tests__/` folders.

## Conventions

- **Imports:** use the `@/` alias for anything under `src/`.
- **Components:** multi-word PascalCase names; `Base*` for generic UI primitives, `App*` for single-instance app chrome.
- **Props:** type-only `defineProps<{…}>()` with reactive destructuring for defaults.
- **Stores:** setup-style (`ref` = state, `computed` = getters, functions = actions). Use `storeToRefs` when destructuring state.
- **Styling:** plain CSS with [BEM](https://getbem.com/) names. Each component styles itself in its own unscoped `<style>` block: `.portfolio-card` (block), `.portfolio-card__title` (element), `.filter-chip--active` (modifier). Shared CSS lives in `src/assets/styles/`:
  - `tokens.css`: colors, type scale, radii and shadows as CSS variables. Theme colors (`--surface`, `--ink`, `--ink-muted`, `--line`, `--accent-text`…) switch with dark mode automatically, so use them instead of raw colors.
  - `reset.css` and `base.css`: browser reset and page defaults, in cascade layers so component styles always win.
  - `shared.css`: small blocks to mix in: `.container` (page width), `.heading--page`, `.heading--section`, `.lead` and `.sr-only`.
- **Dark mode:** class-based (`.dark` on `<html>`). An inline script in `index.html` applies it before first paint.
- **API calls:** go through `api` in `src/services/http.ts`; set `VITE_API_BASE_URL` in `.env.local`.
- **Env vars:** declare new `VITE_*` variables in `env.d.ts` so they're typed.

## i18n

- Add keys to `src/locales/en.json` first. Other locales are type-checked against it, so a missing key is a type error.
- To add a locale: create `src/locales/<code>.json`, import it in `src/i18n/index.ts`, and add the code to `SUPPORTED_LOCALES` and the labels in `LocaleSwitcher.vue`.
- The chosen locale is saved to `localStorage` and sets `<html lang>`.

## Accessibility

- `eslint-plugin-vuejs-accessibility` runs as part of `npm run lint`.
- The layout includes a skip link and a focusable `<main id="main">`. Nav links get `aria-current="page"`, and focus rings use `:focus-visible`.

## Videos

Add a `videos` list to any item in `portfolio.json`. They show in a "Videos" section on that item's page.

```json
"videos": [
  {
    "title": "Project walkthrough",
    "description": "Optional sentence shown under the title.",
    "src": "portfolio/my-project.mp4",
    "poster": "portfolio/my-project-poster.jpg",
    "captions": "portfolio/my-project.en.vtt",
    "transcript": ["Optional transcript, one string per paragraph."]
  },
  { "title": "Conference talk", "youtubeId": "VIDEO_ID", "transcript": ["..."] },
  { "title": "Demo reel", "vimeoId": "123456789", "transcript": ["..."] }
]
```

- **Sources:** use exactly one of `src` (an MP4 in `public/portfolio/` or a full URL), `youtubeId` or `vimeoId`. YouTube uses youtube-nocookie.com and Vimeo uses `dnt=1`, so visitors aren't tracked until they press play.
- **Accessibility:** every video needs `captions` (a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) `.vtt` file, self-hosted videos only) or a `transcript`, and `npm test` fails if one is missing. Captions are on by default and can be turned off from the player. Videos never autoplay, use the browser's keyboard-accessible controls, and are named by their visible title. For a non-English captions file, set `captionsLang` (e.g. `"es"`) and `captionsLabel` (e.g. `"Español"`).
- **File size:** keep self-hosted videos short and compressed (H.264 MP4, 720p is plenty). For anything long, YouTube or Vimeo will load faster.

## Translating portfolio items

The site's own text (navigation, labels, buttons) lives in `src/locales/`. Project text stays in `portfolio.json`. To translate a project, add a `translations` object to it, keyed by locale:

```json
"translations": {
  "es": {
    "title": "Mi proyecto",
    "summary": "Una o dos frases sobre el proyecto.",
    "description": ["Primer párrafo.", "Segundo párrafo."],
    "role": "Desarrollador front-end",
    "technologies": ["HTML y CSS", "Vue 3"],
    "imageAlt": "Captura de la página de inicio",
    "gallery": [{ "alt": "Primera imagen" }, {}],
    "videos": [{ "title": "Recorrido", "captions": "portfolio/my-project.es.vtt", "transcript": ["..."] }]
  }
}
```

- Every field is optional. Anything you leave out shows in English, so you can translate a little at a time.
- `gallery` and `videos` match the item's own lists by position. Use `{}` to skip one.
- A translated `captions` file replaces the English one for that language. `captionsLang` and `captionsLabel` default to the locale (e.g. `es`, "Español").
- Untranslated text is marked `lang="en"` so screen readers pronounce it in English on the Spanish site.
- `npm test` checks that each locale is supported, that the lists aren't longer than the ones they translate and that caption files exist.

The site uses HTML5 history routing (`/work/my-project`, not `/#/work/my-project`), so the static host must serve `index.html` for any path it doesn't have a file for. Netlify, Vercel and Cloudflare Pages do this with a one-line rewrite rule. Without it, refreshing an item page returns the host's 404.

## Fonts

The site uses the system font until you add your own. To use [Google Fonts](https://fonts.google.com):

1. Pick your fonts and click **Get embed code**. Copy the stylesheet URL (it starts with `https://fonts.googleapis.com/css2?family=`). Only include the weights you use (this site uses 400, 500, 600 and 700), and keep `&display=swap` at the end.
2. In `index.html`, uncomment the "Google Fonts" `<link>` tags and paste your URL into the stylesheet link.
3. In `src/assets/styles/tokens.css`, put the font's name first in the font list, keeping the fallbacks after it:

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-heading: 'Fraunces', Georgia, serif; /* optional: a different font for headings */
```

`--font-sans` is for body text and `--font-heading` is for all headings. Headings use the body font unless you set `--font-heading`. The offline app caches the font files after the first visit.

Loading from Google sends each visitor's IP address to Google. If that matters (for example, under GDPR), self-host the fonts instead: install a package from [Fontsource](https://fontsource.org) (e.g. `npm install @fontsource-variable/inter`), import it at the top of `src/main.ts`, and skip step 2.

## PWA

The service worker is only generated for production builds. To test it, run `npm run build && npm run preview`. Update the manifest (name, colors, icons) in `vite.config.ts`. The icons in `public/` are placeholders.

## Customizing

- Rename the app by changing `name` in `package.json`, `VITE_APP_TITLE` in `.env`, the `<title>` in `index.html`, and the PWA `manifest` in `vite.config.ts`.
- Not included on purpose (add when you need them): auth, a component library, SSR, Husky and lint-staged, CI workflows.
