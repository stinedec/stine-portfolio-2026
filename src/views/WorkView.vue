<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import PortfolioGrid from '@/components/PortfolioGrid.vue'
import {
  filterByTag,
  getAllTags,
  getRecentItems,
  localizeItem,
  portfolioItems,
} from '@/data/portfolio'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const tags = getAllTags(portfolioItems)

// The selected tag lives in the URL (?tag=Animation) so a filtered view can be shared.
// An unknown tag shows everything.
const activeTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' && tags.some((entry) => entry.tag === tag) ? tag : undefined
})

const items = computed(() =>
  getRecentItems(filterByTag(portfolioItems, activeTag.value), portfolioItems.length).map((item) =>
    localizeItem(item, locale.value),
  ),
)

function selectTag(tag: string | undefined) {
  // replace, not push: picking filters shouldn't fill up the back button's history.
  router.replace({ query: { ...route.query, tag } })
}
</script>

<template>
  <section aria-labelledby="work-heading" class="work">
    <header class="work__header">
      <h1 id="work-heading" class="heading heading--page">{{ t('work.title') }}</h1>

      <div
        v-if="tags.length"
        role="group"
        :aria-label="t('work.filterLabel')"
        class="work__filters"
      >
        <button
          type="button"
          :aria-pressed="!activeTag"
          :class="['filter-chip', { 'filter-chip--active': !activeTag }]"
          @click="selectTag(undefined)"
        >
          {{ t('work.allTags') }}
        </button>
        <button
          v-for="{ tag, count } in tags"
          :key="tag"
          type="button"
          :aria-pressed="activeTag === tag"
          :class="['filter-chip', { 'filter-chip--active': activeTag === tag }]"
          @click="selectTag(activeTag === tag ? undefined : tag)"
        >
          {{ tag }}
          <span class="filter-chip__count" aria-hidden="true">{{ count }}</span>
        </button>
      </div>

      <!-- Announced to screen readers when the filter changes. -->
      <p class="work__intro lead" aria-live="polite">
        {{
          activeTag
            ? t('work.filteredIntro', { count: items.length, tag: activeTag }, items.length)
            : t('work.intro', { count: items.length })
        }}
      </p>
    </header>

    <PortfolioGrid :items="items" />
  </section>
</template>

<style>
.work > * + * {
  margin-top: 2rem;
}

.work__header > * + * {
  margin-top: 1.25rem;
}

.work__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.work__intro {
  max-width: 42rem;
}

.filter-chip {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  background-color: var(--surface);
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  cursor: pointer;
  transition-property: color, background-color, border-color;
  transition-timing-function: var(--ease);
  transition-duration: var(--duration);
}

.filter-chip:hover {
  background-color: var(--surface-muted);
}

.filter-chip--active,
.filter-chip--active:hover {
  border-color: var(--brand-600);
  background-color: var(--brand-600);
  color: white;
}

.filter-chip__count {
  opacity: 0.7;
}
</style>
