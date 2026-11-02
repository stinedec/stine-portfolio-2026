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

const chipClasses =
  'rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500'
const activeClasses = 'border-brand-600 bg-brand-600 text-white'
const inactiveClasses = 'border-line bg-surface hover:bg-surface-muted'
</script>

<template>
  <section aria-labelledby="work-heading" class="space-y-8">
    <header class="space-y-5">
      <h1 id="work-heading" class="text-4xl font-bold tracking-tight">{{ t('work.title') }}</h1>

      <div
        v-if="tags.length"
        role="group"
        :aria-label="t('work.filterLabel')"
        class="flex flex-wrap gap-2"
      >
        <button
          type="button"
          :aria-pressed="!activeTag"
          :class="[chipClasses, !activeTag ? activeClasses : inactiveClasses]"
          @click="selectTag(undefined)"
        >
          {{ t('work.allTags') }}
        </button>
        <button
          v-for="{ tag, count } in tags"
          :key="tag"
          type="button"
          :aria-pressed="activeTag === tag"
          :class="[chipClasses, activeTag === tag ? activeClasses : inactiveClasses]"
          @click="selectTag(activeTag === tag ? undefined : tag)"
        >
          {{ tag }}
          <span class="opacity-70" aria-hidden="true">{{ count }}</span>
        </button>
      </div>

      <!-- Announced to screen readers when the filter changes. -->
      <p class="max-w-2xl text-lg text-ink-muted" aria-live="polite">
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
