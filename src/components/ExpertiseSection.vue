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
  <section aria-labelledby="expertise-heading" class="expertise">
    <h2 id="expertise-heading" class="heading heading--section">
      {{ t('home.expertise.heading') }}
    </h2>
    <ul class="expertise__list">
      <li v-for="area in areas" :key="area.key" class="expertise__item">
        <div class="expertise__item-header">
          <span class="expertise__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="expertise__icon-svg"
              aria-hidden="true"
            >
              <path v-for="d in area.icon" :key="d" :d="d" />
            </svg>
          </span>
          <h3 class="expertise__title">{{ t(`home.expertise.${area.key}.title`) }}</h3>
        </div>
        <p class="expertise__text">{{ t(`home.expertise.${area.key}.text`) }}</p>
      </li>
    </ul>
  </section>
</template>

<style>
.expertise > * + * {
  margin-top: 1.5rem;
}

.expertise__list {
  display: grid;
  gap: 1.5rem;
}

@media (width >= 48rem) {
  .expertise__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.expertise__item {
  padding: 1.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background-color: var(--surface-muted);
}

.expertise__item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.expertise__item > * + * {
  margin-top: 0.75rem;
}

.expertise__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  background-color: var(--badge-bg);
  color: var(--badge-ink);
}

.expertise__icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}

.expertise__title {
  font-size: var(--text-lg);
  line-height: var(--text-lg-lh);
  font-weight: 600;
}

.expertise__text {
  color: var(--ink-muted);
}
</style>
