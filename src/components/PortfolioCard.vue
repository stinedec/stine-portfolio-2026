<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { formatItemDate, assetUrl, type LocalizedPortfolioItem } from '@/data/portfolio'

const { item } = defineProps<{ item: LocalizedPortfolioItem }>()

const { locale } = useI18n()
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow focus-within:shadow-lg hover:shadow-lg"
  >
    <div class="aspect-[4/3] overflow-hidden bg-surface-muted">
      <img
        :src="assetUrl(item.image)"
        :alt="item.imageAlt"
        :lang="item.lang"
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <h3 class="font-semibold" :lang="item.lang">
        <!-- The link's ::after covers the whole card, so the card is one click target. -->
        <RouterLink
          :to="{ name: 'portfolio-item', params: { slug: item.slug } }"
          class="group-hover:text-brand-600 after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-500 dark:group-hover:text-brand-500"
        >
          {{ item.title }}
        </RouterLink>
      </h3>
      <p class="text-sm text-ink-muted" :lang="item.lang">{{ item.summary }}</p>

      <div class="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-ink-muted">
        <time :datetime="item.date">{{ formatItemDate(item.date, locale) }}</time>
        <ul v-if="item.tags?.length" class="flex flex-wrap gap-1.5">
          <li
            v-for="tag in item.tags"
            :key="tag"
            class="rounded-full border border-line px-2 py-0.5"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>
