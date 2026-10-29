<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Each key matches `home.expertise.<key>` in the locale files.
// Icons are 24×24 stroke paths so they pick up the current text color.
const areas = [
  {
    key: 'design',
    icon: [
      'M3 4.5A1.5 1.5 0 0 1 4.5 3h5A1.5 1.5 0 0 1 11 4.5v5A1.5 1.5 0 0 1 9.5 11h-5A1.5 1.5 0 0 1 3 9.5z',
      'M21 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      'M7 13.5l4 7H3z',
      'M14 14h7v7h-7z',
    ],
  },
  {
    key: 'accessibility',
    icon: [
      'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
      'M13.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z',
      'M7 10l5 1 5-1',
      'M12 11v4l-3 4',
      'M12 15l3 4',
    ],
  },
  {
    key: 'interactive',
    icon: ['M9 9l11 4-5 2-2 5z', 'M5 2.5v3', 'M2.5 5h3', 'M12 3.5l-1.5 2', 'M3.5 12l2-1.5'],
  },
] as const
</script>

<template>
  <section aria-labelledby="expertise-heading" class="space-y-6">
    <h2 id="expertise-heading" class="text-2xl font-semibold tracking-tight">
      {{ t('home.expertise.heading') }}
    </h2>
    <ul class="grid gap-6 md:grid-cols-3">
      <li
        v-for="area in areas"
        :key="area.key"
        class="space-y-3 rounded-xl border border-line bg-surface-muted p-6"
      >
        <span
          class="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-700/25 dark:text-brand-500"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-6"
            aria-hidden="true"
          >
            <path v-for="d in area.icon" :key="d" :d="d" />
          </svg>
        </span>
        <h3 class="text-lg font-semibold">{{ t(`home.expertise.${area.key}.title`) }}</h3>
        <p class="text-ink-muted">{{ t(`home.expertise.${area.key}.text`) }}</p>
      </li>
    </ul>
  </section>
</template>
