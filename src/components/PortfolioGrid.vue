<script setup lang="ts">
import PortfolioCard from '@/components/PortfolioCard.vue'
import type { LocalizedPortfolioItem } from '@/data/portfolio'

const { headingLevel = 3 } = defineProps<{
  items: LocalizedPortfolioItem[]
  /** Heading level for the card titles. Use 2 when the grid sits right under the page's h1. */
  headingLevel?: 2 | 3
}>()
</script>

<template>
  <ul class="portfolio-grid">
    <li v-for="item in items" :key="item.slug" class="portfolio-grid__item">
      <PortfolioCard :item="item" :heading-level="headingLevel" class="portfolio-grid__card" />
    </li>
  </ul>
</template>

<style>
.portfolio-grid {
  display: grid;
  gap: 1.5rem;
}

@media (width >= 40rem) {
  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width >= 64rem) {
  .portfolio-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.portfolio-grid__item {
  display: flex;
}

.portfolio-grid__card {
  width: 100%;
}
</style>
