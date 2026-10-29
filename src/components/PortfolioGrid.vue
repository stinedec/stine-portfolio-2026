<script setup lang="ts">
import PortfolioCard from '@/components/PortfolioCard.vue'
import type { PortfolioItem } from '@/data/portfolio'

defineProps<{ items: PortfolioItem[] }>()
</script>

<template>
  <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="item in items" :key="item.slug" class="flex">
      <PortfolioCard :item="item" class="w-full" />
    </li>
  </ul>
</template>
