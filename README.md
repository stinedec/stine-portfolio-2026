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

| Area      | Choice                                                                                     |
| --------- | ------------------------------------------------------------------------------------------ |
| Framework | Vue 3 (Composition API, `<script setup>`), Vite 7                                          |
| Language  | TypeScript (strict), type-checked with `vue-tsc`                                           |
| Routing   | Vue Router with lazy-loaded routes and i18n'd document titles                              |
| State     | Pinia (setup-style stores)                                                                 |
| Styling   | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `src/assets/main.css`                   |
| i18n      | vue-i18n (Composition mode), JSON locales precompiled by `@intlify/unplugin-vue-i18n`      |
| PWA       | `vite-plugin-pwa`: manifest and an auto-updating service worker                            |
| Testing   | Vitest + Vue Test Utils (unit), Playwright (e2e)                                           |
| Quality   | ESLint flat config (Vue, TS, a11y, Vitest, Playwright) + Prettier with the Tailwind plugin |

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
  assets/        # global CSS + Tailwind theme tokens
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
- **Styling:** Tailwind utilities first. Add brand colors in `@theme`; add theme-aware colors as CSS variables under `:root`/`.dark` and map them in `@theme inline`. That gives you `bg-surface`, `text-ink`, `text-ink-muted`, `border-line` and so on, which switch with dark mode automatically.
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

## Hosting

The site uses HTML5 history routing (`/work/my-project`, not `/#/work/my-project`), so the static host must serve `index.html` for any path it doesn't have a file for. Netlify, Vercel and Cloudflare Pages do this with a one-line rewrite rule. Without it, refreshing an item page returns the host's 404.

## PWA

The service worker is only generated for production builds. To test it, run `npm run build && npm run preview`. Update the manifest (name, colors, icons) in `vite.config.ts`. The icons in `public/` are placeholders.

## Customizing

- Rename the app by changing `name` in `package.json`, `VITE_APP_TITLE` in `.env`, the `<title>` in `index.html`, and the PWA `manifest` in `vite.config.ts`.
- Not included on purpose (add when you need them): auth, a component library, SSR, Husky and lint-staged, CI workflows.
