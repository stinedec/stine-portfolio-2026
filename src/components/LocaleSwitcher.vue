<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { type AppLocale, setLocale, SUPPORTED_LOCALES } from '@/i18n'

const { t, locale } = useI18n()

const labels: Record<AppLocale, string> = {
  en: 'English',
  es: 'Español',
}

const current = computed({
  get: () => locale.value as AppLocale,
  set: (value: AppLocale) => setLocale(value),
})
</script>

<template>
  <label for="locale-switcher" class="locale-switcher">
    <span class="sr-only">{{ t('a11y.language') }}</span>
    <select id="locale-switcher" v-model="current" class="locale-switcher__select">
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code" :lang="code">
        {{ labels[code] }}
      </option>
    </select>
  </label>
</template>

<style>
.locale-switcher {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
}

.locale-switcher__select {
  height: 2.25rem;
  padding-inline: 0.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background-color: var(--surface);
}

.locale-switcher__select:hover {
  background-color: var(--surface-muted);
}
</style>
