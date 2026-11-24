<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { t } = useI18n()
const { isDark, toggle } = useDarkMode()

const appTitle = import.meta.env.VITE_APP_TITLE || 'stinedec'

const links = [
  { to: { name: 'work' }, label: 'nav.work' },
  { to: { name: 'about' }, label: 'nav.about' },
] as const
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <RouterLink to="/" class="site-header__brand">{{ appTitle }}</RouterLink>

      <nav :aria-label="t('a11y.mainNav')" class="site-header__nav">
        <ul class="site-header__nav-list">
          <li v-for="link in links" :key="link.label">
            <!-- RouterLink sets aria-current="page" on the exact-active link -->
            <RouterLink :to="link.to" class="site-header__nav-link">
              {{ t(link.label) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <LocaleSwitcher />
        <button
          type="button"
          class="site-header__theme-toggle"
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

<style>
.site-header {
  border-bottom: 1px solid var(--line);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.75rem;
}

.site-header__brand {
  font-weight: 600;
  letter-spacing: var(--tracking-tight);
}

.site-header__nav {
  margin-right: auto;
}

.site-header__nav-list {
  display: flex;
  gap: 1.25rem;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
}

.site-header__nav-link {
  color: var(--ink-muted);
}

.site-header__nav-link:hover {
  color: var(--ink);
}

.site-header__nav-link[aria-current='page'] {
  font-weight: 500;
  color: var(--accent-text);
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.site-header__theme-toggle {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.site-header__theme-toggle:hover {
  background-color: var(--surface-muted);
}
</style>
