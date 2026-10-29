<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <section class="space-y-4 py-12 text-center">
    <p class="text-sm font-semibold text-brand-600">404</p>
    <h1 class="text-3xl font-bold tracking-tight">{{ t('notFound.title') }}</h1>
    <p class="text-ink-muted">{{ t('notFound.message') }}</p>
    <RouterLink to="/" class="inline-block font-medium text-brand-600 underline underline-offset-4">
      {{ t('notFound.back') }}
    </RouterLink>
  </section>
</template>
