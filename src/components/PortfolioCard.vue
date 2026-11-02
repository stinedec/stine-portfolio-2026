<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import TagList from '@/components/TagList.vue'
import { formatItemDate, assetUrl, type LocalizedPortfolioItem } from '@/data/portfolio'

const { item } = defineProps<{ item: LocalizedPortfolioItem }>()

const { locale } = useI18n()
</script>

<template>
  <article class="portfolio-card">
    <div class="portfolio-card__media">
      <img
        :src="assetUrl(item.image)"
        :alt="item.imageAlt"
        :lang="item.lang"
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
        class="portfolio-card__image"
      />
    </div>

    <div class="portfolio-card__body">
      <h3 class="portfolio-card__title" :lang="item.lang">
        <!-- The link's ::after covers the whole card, so the card is one click target. -->
        <RouterLink
          :to="{ name: 'portfolio-item', params: { slug: item.slug } }"
          class="portfolio-card__link"
        >
          {{ item.title }}
        </RouterLink>
      </h3>
      <p class="portfolio-card__summary" :lang="item.lang">{{ item.summary }}</p>

      <div class="portfolio-card__meta">
        <time :datetime="item.date">{{ formatItemDate(item.date, locale) }}</time>
        <TagList v-if="item.tags?.length" :tags="item.tags" />
      </div>
    </div>
  </article>
</template>

<style>
.portfolio-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background-color: var(--surface);
  transition: box-shadow var(--duration) var(--ease);
}

.portfolio-card:hover,
.portfolio-card:focus-within {
  box-shadow: var(--shadow-lg);
}

.portfolio-card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: var(--surface-muted);
}

.portfolio-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms var(--ease);
}

.portfolio-card:hover .portfolio-card__image {
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-card__image {
    transition: none;
  }

  .portfolio-card:hover .portfolio-card__image {
    transform: none;
  }
}

.portfolio-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.portfolio-card__title {
  font-weight: 600;
}

.portfolio-card:hover .portfolio-card__link {
  color: var(--accent-text);
}

/* Stretches the link over the whole card. */
.portfolio-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
}

.portfolio-card__link:focus-visible {
  outline: none;
}

.portfolio-card__link:focus-visible::after {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.portfolio-card__summary {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  color: var(--ink-muted);
}

.portfolio-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  color: var(--ink-muted);
}
</style>
