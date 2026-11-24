import { watch } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

import { getItemBySlug, localizeItem } from '@/data/portfolio'
import { i18n } from '@/i18n'
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** i18n key used for the document title. */
    titleKey?: string
    /** Builds the document title from the route. Takes priority over titleKey. */
    title?: (route: RouteLocationNormalized) => string | undefined
  }
}

/**
 * Old project slugs and the slug that replaced them, so links to a renamed or
 * merged project still work. Add an entry whenever you change or remove a slug.
 */
const movedProjects: Record<string, string> = {
  'net10-leasing': 'net10-straight-talk-leasing',
  'straight-talk-leasing': 'net10-straight-talk-leasing',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { titleKey: 'nav.home' },
    },
    {
      path: '/about',
      name: 'about',
      // Lazy-loaded: emitted as a separate chunk and fetched on first visit.
      component: () => import('@/views/AboutView.vue'),
      meta: { titleKey: 'nav.about' },
    },
    {
      path: '/work',
      name: 'work',
      component: () => import('@/views/WorkView.vue'),
      meta: { titleKey: 'nav.work' },
    },
    ...Object.entries(movedProjects).map(([from, to]) => ({
      path: `/work/${from}`,
      redirect: { name: 'portfolio-item', params: { slug: to } },
    })),
    {
      path: '/work/:slug',
      name: 'portfolio-item',
      component: () => import('@/views/PortfolioItemView.vue'),
      props: true,
      meta: {
        title: (route) => {
          const item = getItemBySlug(String(route.params.slug))
          return item && localizeItem(item, i18n.global.locale.value).title
        },
      },
      // Unknown slugs show the 404 page, keeping the URL the visitor typed.
      beforeEnter: (to) => {
        if (getItemBySlug(String(to.params.slug))) return true
        return {
          name: 'not-found',
          params: { pathMatch: to.path.slice(1).split('/') },
          query: to.query,
          hash: to.hash,
          replace: true,
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { titleKey: 'notFound.title' },
    },
  ],
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 16 }
    return { top: 0 }
  },
})

function updateTitle(to: RouteLocationNormalized) {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Portfolio'
  const pageTitle = to.meta.title?.(to) ?? (to.meta.titleKey ? i18n.global.t(to.meta.titleKey) : '')
  document.title = pageTitle ? `${pageTitle} · ${appTitle}` : appTitle
}

router.afterEach(updateTitle)
// Switching language doesn't navigate, so refresh the title here too.
watch(i18n.global.locale, () => updateTitle(router.currentRoute.value))

export default router
