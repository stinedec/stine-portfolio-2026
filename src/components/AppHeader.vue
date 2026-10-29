<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { t } = useI18n()
const { isDark, toggle } = useDarkMode()

const appTitle = import.meta.env.VITE_APP_TITLE || 'Portfolio'

const links = [
  { to: { name: 'home' }, label: 'nav.home' },
  { to: { name: 'work' }, label: 'nav.work' },
  { to: { name: 'about' }, label: 'nav.about' },
] as const
</script>

<template>
  <header class="border-b border-line">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <RouterLink to="/" class="font-semibold tracking-tight">{{ appTitle }}</RouterLink>

      <nav :aria-label="t('a11y.mainNav')" class="mr-auto">
        <ul class="flex gap-5 text-sm">
          <li v-for="link in links" :key="link.label">
            <!-- RouterLink sets aria-current="page" on the exact-active link -->
            <RouterLink
              :to="link.to"
              class="text-ink-muted hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-brand-600 dark:aria-[current=page]:text-brand-500"
            >
              {{ t(link.label) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <LocaleSwitcher />
        <button
          type="button"
          class="grid size-9 place-items-center rounded-md border border-line hover:bg-surface-muted"
          :aria-label="t('a11y.toggleDark')"
          :aria-pressed="isDark"
          @click="toggle"
        >
          <span aria-hidden="true">{{ isDark ? '☾' : '☀' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
