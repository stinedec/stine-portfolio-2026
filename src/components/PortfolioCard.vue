<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import TagList from '@/components/TagList.vue'
import { formatItemDate, assetUrl, type LocalizedPortfolioItem } from '@/data/portfolio'

const { item, headingLevel = 3 } = defineProps<{
  item: LocalizedPortfolioItem
  /** The title's heading level: one below the heading of the section the card is in. */
  headingLevel?: 2 | 3
}>()

const { locale } = useI18n()
</script>

<template>
  <article class="portfolio-card">
    <div class="portfolio-card__media">
      <img
        :src="assetUrl(item.cardImage)"
        :alt="item.cardImageAlt"
        :lang="item.lang"
        width="800"
        height="600"
        loading="lazy"
        decoding="async"
        class="portfolio-card__image"
      />
    </div>

    <div class="portfolio-card__body">
      <header class="portfolio-card__header">
        <component :is="`h${headingLevel}`" class="portfolio-card__title" :lang="item.lang">
          <!-- The link's ::after covers the whole card, so the card is one click target. -->
          <RouterLink
            :to="{ name: 'portfolio-item', params: { slug: item.slug } }"
            class="portfolio-card__link"
          >
            {{ item.title }}
          </RouterLink>
        </component>
        <time :datetime="item.date" class="portfolio-card__date">
          {{ formatItemDate(item.date, locale) }}
        </time>
      </header>
      <p class="portfolio-card__summary" :lang="item.lang">{{ item.summary }}</p>

      <!-- Tags aren't translated, so mark them English for screen readers on other-language pages. -->
      <TagList v-if="item.tags?.length" :tags="item.tags" lang="en" class="portfolio-card__tags" />
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

/* Title with the date right under it. */
.portfolio-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.portfolio-card__date {
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  color: var(--ink-muted);
}

.portfolio-card__title {
  font-size: var(--text-lg);
  line-height: var(--text-lg-lh);
  font-weight: 600;
  letter-spacing: var(--tracking-loose);
}

.portfolio-card:hover .portfolio-card__link {
  color: var(--accent-text-large);
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

/* Tags sit at the bottom of the card, however long the summary is. */
.portfolio-card__tags {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  color: var(--ink-muted);
}
</style>
