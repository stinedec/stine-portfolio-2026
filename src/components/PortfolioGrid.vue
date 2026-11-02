<script setup lang="ts">
import PortfolioCard from '@/components/PortfolioCard.vue'
import type { LocalizedPortfolioItem } from '@/data/portfolio'

defineProps<{ items: LocalizedPortfolioItem[] }>()
</script>

<template>
  <ul class="portfolio-grid">
    <li v-for="item in items" :key="item.slug" class="portfolio-grid__item">
      <PortfolioCard :item="item" class="portfolio-grid__card" />
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
