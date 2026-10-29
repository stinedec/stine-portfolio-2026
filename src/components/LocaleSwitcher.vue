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
  <label for="locale-switcher" class="text-sm">
    <span class="sr-only">{{ t('a11y.language') }}</span>
    <select
      id="locale-switcher"
      v-model="current"
      class="h-9 rounded-md border border-line bg-surface px-2 hover:bg-surface-muted"
    >
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code" :lang="code">
        {{ labels[code] }}
      </option>
    </select>
  </label>
</template>
