<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PortfolioGrid from '@/components/PortfolioGrid.vue'
import { getRecentItems, portfolioItems } from '@/data/portfolio'

const { t } = useI18n()

const allItems = getRecentItems(portfolioItems, portfolioItems.length)
</script>

<template>
  <section aria-labelledby="work-heading" class="space-y-8">
    <header class="max-w-2xl space-y-3">
      <h1 id="work-heading" class="text-4xl font-bold tracking-tight">{{ t('work.title') }}</h1>
      <p class="text-lg text-ink-muted">{{ t('work.intro', { count: allItems.length }) }}</p>
    </header>
    <PortfolioGrid :items="allItems" />
  </section>
</template>
