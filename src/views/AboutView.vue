<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stack = [
  ['Vue 3', 'Composition API + <script setup>'],
  ['Vite', 'Dev server and build'],
  ['TypeScript', 'Strict, checked with vue-tsc'],
  ['Vue Router', 'Lazy-loaded routes'],
  ['Pinia', 'Setup-style stores'],
  ['Tailwind CSS v4', 'Design tokens in main.css'],
  ['vue-i18n', 'Precompiled JSON locales'],
  ['vite-plugin-pwa', 'Manifest + auto-updating service worker'],
  ['Vitest + Playwright', 'Unit and end-to-end tests'],
  ['ESLint + Prettier', 'Including Vue a11y rules'],
] as const
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('about.title') }}</h1>
    <p class="max-w-2xl text-ink-muted">{{ t('about.intro') }}</p>
    <dl class="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
      <template v-for="[name, detail] in stack" :key="name">
        <dt class="font-medium">{{ name }}</dt>
        <dd class="text-ink-muted">{{ detail }}</dd>
      </template>
    </dl>
  </section>
</template>
