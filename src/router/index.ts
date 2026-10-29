import { createRouter, createWebHistory } from 'vue-router'

import { i18n } from '@/i18n'
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** i18n key used for the document title. */
    titleKey?: string
  }
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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { titleKey: 'notFound.title' },
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

router.afterEach((to) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Portfolio'
  const pageTitle = to.meta.titleKey ? i18n.global.t(to.meta.titleKey) : ''
  document.title = pageTitle ? `${pageTitle} · ${appTitle}` : appTitle
})

export default router
