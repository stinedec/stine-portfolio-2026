<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { formatItemDate, getItemBySlug, imageUrl } from '@/data/portfolio'

const { slug } = defineProps<{ slug: string }>()

const { t, locale } = useI18n()

// The route guard sends unknown slugs to the 404 page, so this is normally set.
const item = computed(() => getItemBySlug(slug))
const isExternal = computed(() => !!item.value?.url && /^https?:\/\//.test(item.value.url))
</script>

<template>
  <article v-if="item" class="space-y-10">
    <RouterLink
      :to="{ name: 'work' }"
      class="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
    >
      <span aria-hidden="true">←</span> {{ t('portfolio.backToWork') }}
    </RouterLink>

    <header class="max-w-3xl space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">{{ item.title }}</h1>
      <p class="text-lg text-ink-muted">{{ item.summary }}</p>

      <dl class="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt class="text-ink-muted">{{ t('portfolio.date') }}</dt>
          <dd class="font-medium">
            <time :datetime="item.date">{{ formatItemDate(item.date, locale) }}</time>
          </dd>
        </div>
        <div v-if="item.role">
          <dt class="text-ink-muted">{{ t('portfolio.role') }}</dt>
          <dd class="font-medium">{{ item.role }}</dd>
        </div>
      </dl>

      <ul v-if="item.tags?.length" class="flex flex-wrap gap-2 text-xs text-ink-muted">
        <li v-for="tag in item.tags" :key="tag" class="rounded-full border border-line px-2.5 py-1">
          {{ tag }}
        </li>
      </ul>
    </header>

    <img
      :src="imageUrl(item.image)"
      :alt="item.imageAlt"
      width="1200"
      height="900"
      class="aspect-[4/3] w-full rounded-xl border border-line bg-surface-muted object-cover"
    />

    <div v-if="item.description?.length || item.url" class="max-w-3xl space-y-4">
      <p v-for="(paragraph, index) in item.description" :key="index" class="leading-relaxed">
        {{ paragraph }}
      </p>
      <a
        v-if="item.url"
        :href="item.url"
        :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener noreferrer' : undefined"
        class="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        {{ t('portfolio.visit') }}
        <span aria-hidden="true">↗</span>
        <span v-if="isExternal" class="sr-only">{{ t('a11y.opensInNewTab') }}</span>
      </a>
    </div>

    <section v-if="item.gallery?.length" aria-labelledby="gallery-heading" class="space-y-4">
      <h2 id="gallery-heading" class="text-2xl font-semibold tracking-tight">
        {{ t('portfolio.gallery') }}
      </h2>
      <ul class="grid gap-6 sm:grid-cols-2">
        <li v-for="shot in item.gallery" :key="shot.image">
          <img
            :src="imageUrl(shot.image)"
            :alt="shot.alt"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            class="aspect-[4/3] w-full rounded-xl border border-line bg-surface-muted object-cover"
          />
        </li>
      </ul>
    </section>
  </article>
</template>
