<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import PortfolioGrid from '@/components/PortfolioGrid.vue'
import PortfolioVideo from '@/components/PortfolioVideo.vue'
import TagList from '@/components/TagList.vue'
import {
  assetUrl,
  formatItemDate,
  getItemBySlug,
  getRelatedItems,
  localizeItem,
  portfolioItems,
} from '@/data/portfolio'

const { slug } = defineProps<{ slug: string }>()

const { t, locale } = useI18n()

// The route guard sends unknown slugs to the 404 page, so this is normally set.
const item = computed(() => {
  const found = getItemBySlug(slug)
  return found && localizeItem(found, locale.value)
})
// Up to three other projects that share the most tags with this one.
const relatedItems = computed(() => {
  const found = getItemBySlug(slug)
  if (!found) return []
  return getRelatedItems(found, portfolioItems, 3).map((other) => localizeItem(other, locale.value))
})

const isExternal = computed(() => !!item.value?.url && /^https?:\/\//.test(item.value.url))
</script>

<template>
  <article v-if="item" class="project">
    <RouterLink :to="{ name: 'work' }" class="project__back">
      <span aria-hidden="true">←</span> {{ t('portfolio.backToWork') }}
    </RouterLink>

    <header class="project__header">
      <h1 class="heading heading--page" :lang="item.lang">{{ item.title }}</h1>
      <p class="lead" :lang="item.lang">{{ item.summary }}</p>

      <dl class="project__facts">
        <div>
          <dt class="project__fact-label">{{ t('portfolio.date') }}</dt>
          <dd class="project__fact-value">
            <time :datetime="item.date">{{ formatItemDate(item.date, locale) }}</time>
          </dd>
        </div>
        <div v-if="item.role">
          <dt class="project__fact-label">{{ t('portfolio.role') }}</dt>
          <dd class="project__fact-value" :lang="item.lang">{{ item.role }}</dd>
        </div>
      </dl>

      <TagList v-if="item.tags?.length" :tags="item.tags" size="large" />
    </header>

    <img
      :src="assetUrl(item.image)"
      :alt="item.imageAlt"
      :lang="item.lang"
      width="1200"
      height="900"
      class="project__hero"
    />

    <div v-if="item.description?.length || item.url" class="project__body">
      <p
        v-for="(paragraph, index) in item.description"
        :key="index"
        :lang="item.lang"
        class="project__paragraph"
      >
        {{ paragraph }}
      </p>
      <a
        v-if="item.url"
        :href="item.url"
        :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener noreferrer' : undefined"
        class="project__visit"
      >
        {{ t('portfolio.visit') }}
        <span aria-hidden="true">↗</span>
        <span v-if="isExternal" class="sr-only">{{ t('a11y.opensInNewTab') }}</span>
      </a>
    </div>
    <div v-if="item.technologies?.length" class="project__technologies">
      <h2 class="heading heading--section">{{ t('portfolio.technologies') }}</h2>
      <ul>
        <li v-for="tech in item.technologies" :key="tech">{{ tech }}</li>
      </ul>
    </div>

    <section v-if="item.videos?.length" aria-labelledby="videos-heading" class="project__videos">
      <h2 id="videos-heading" class="heading heading--section">
        {{ t('portfolio.videos') }}
      </h2>
      <PortfolioVideo
        v-for="video in item.videos"
        :key="video.src ?? video.youtubeId ?? video.vimeoId"
        :video="video"
        :content-lang="item.lang"
        class="project__video"
      />
    </section>

    <section v-if="item.gallery?.length" aria-labelledby="gallery-heading" class="project__gallery">
      <h2 id="gallery-heading" class="heading heading--section">
        {{ t('portfolio.gallery') }}
      </h2>
      <ul class="project__gallery-list">
        <li v-for="shot in item.gallery" :key="shot.image">
          <img
            :src="assetUrl(shot.image)"
            :alt="shot.alt"
            :lang="item.lang"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            class="project__gallery-image"
          />
        </li>
      </ul>
    </section>

    <section v-if="relatedItems.length" aria-labelledby="related-heading" class="project__related">
      <h2 id="related-heading" class="heading heading--section">
        {{ t('portfolio.related') }}
      </h2>
      <PortfolioGrid :items="relatedItems" />
    </section>
  </article>
</template>

<style>
/* Space below each child (not above) so the inline back link keeps its line height. */
.project > :not(:last-child) {
  margin-bottom: 2.5rem;
}

.project__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  color: var(--ink-muted);
}

.project__back:hover {
  color: var(--ink);
}

.project__header {
  max-width: 48rem;
}

.project__header > * + * {
  margin-top: 1rem;
}

.project__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
}

.project__fact-label {
  color: var(--ink-muted);
}

.project__fact-value {
  font-weight: 500;
}

.project__hero,
.project__gallery-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background-color: var(--surface-muted);
}

.project__body {
  max-width: 48rem;
}

.project__body > * + * {
  margin-top: 1rem;
}

.project__paragraph {
  line-height: 1.625;
}

.project__visit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--brand-600);
  color: white;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: 500;
}

.project__visit:hover {
  background-color: var(--brand-700);
}

.project__videos > * + * {
  margin-top: 1.5rem;
}

.project__video {
  max-width: 56rem;
}

.project__related {
  padding-top: 2.5rem;
  border-top: 1px solid var(--line);
}

.project__related > * + * {
  margin-top: 1.5rem;
}

.project__gallery > * + * {
  margin-top: 1rem;
}

.project__gallery-list {
  display: grid;
  gap: 1.5rem;
}

@media (width >= 40rem) {
  .project__gallery-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
