<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stack = [
  ['Vue 3', 'Composition API + <script setup>'],
  ['Vite', 'Dev server and build'],
  ['TypeScript', 'Strict, checked with vue-tsc'],
  ['Vue Router', 'Lazy-loaded routes'],
  ['Pinia', 'Setup-style stores'],
  ['BEM CSS', 'Design tokens in styles/tokens.css'],
  ['vue-i18n', 'Precompiled JSON locales'],
  ['vite-plugin-pwa', 'Manifest + auto-updating service worker'],
  ['Vitest + Playwright', 'Unit and end-to-end tests'],
  ['ESLint + Prettier', 'Including Vue a11y rules'],
] as const
</script>

<template>
  <section class="about">
    <h1 class="about__title heading">{{ t('about.title') }}</h1>
    <p class="about__intro">{{ t('about.intro') }}</p>
    <dl class="about__stack">
      <template v-for="[name, detail] in stack" :key="name">
        <dt class="about__name">{{ name }}</dt>
        <dd class="about__detail">{{ detail }}</dd>
      </template>
    </dl>
  </section>
</template>

<style>
.about > * + * {
  margin-top: 1.5rem;
}

.about__title {
  font-size: var(--text-3xl);
  line-height: var(--text-3xl-lh);
  font-weight: 700;
}

.about__intro {
  max-width: 42rem;
  color: var(--ink-muted);
}

.about__stack {
  display: grid;
  gap: 0.75rem 1.5rem;
}

@media (width >= 40rem) {
  .about__stack {
    grid-template-columns: max-content 1fr;
  }
}

.about__name {
  font-weight: 500;
}

.about__detail {
  color: var(--ink-muted);
}
</style>
