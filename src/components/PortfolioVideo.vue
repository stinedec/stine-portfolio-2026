<script setup lang="ts">
import { computed, useId } from 'vue'
import { useI18n } from 'vue-i18n'

import { assetUrl, videoEmbedUrl, type PortfolioVideo } from '@/data/portfolio'

const { video, contentLang = undefined } = defineProps<{
  video: PortfolioVideo
  /** Language of the video's title, description and transcript, if not the page's. */
  contentLang?: string
}>()

const { t } = useI18n()

const titleId = useId()
const embedUrl = computed(() => videoEmbedUrl(video))
</script>

<!--
  Accessibility:
  - Never autoplays; native controls work with keyboard and screen readers.
  - Captions (WebVTT) are on by default; an optional transcript sits below.
  - The video or embed is named by its visible title.
-->
<template>
  <figure :aria-labelledby="titleId" class="space-y-3">
    <figcaption class="space-y-1">
      <span :id="titleId" :lang="contentLang" class="block text-lg font-semibold">{{
        video.title
      }}</span>
      <span v-if="video.description" :lang="contentLang" class="block text-ink-muted">{{
        video.description
      }}</span>
    </figcaption>

    <div class="aspect-video overflow-hidden rounded-xl border border-line bg-black">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="video.title"
        :lang="contentLang"
        loading="lazy"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
        class="size-full"
      />
      <video
        v-else-if="video.src"
        :src="assetUrl(video.src)"
        :poster="video.poster ? assetUrl(video.poster) : undefined"
        :aria-labelledby="titleId"
        controls
        preload="metadata"
        playsinline
        class="size-full"
      >
        <track
          v-if="video.captions"
          kind="captions"
          :src="assetUrl(video.captions)"
          :srclang="video.captionsLang ?? 'en'"
          :label="video.captionsLabel ?? 'English'"
          default
        />
        <!-- Only shown by browsers that can't play video at all. -->
        <p class="p-4 text-white">
          {{ t('portfolio.videoFallback') }}
          <a :href="assetUrl(video.src)" class="underline" download>
            {{ t('portfolio.downloadVideo') }}
          </a>
        </p>
      </video>
    </div>

    <details v-if="video.transcript?.length" class="rounded-lg border border-line">
      <summary class="cursor-pointer px-4 py-2 font-medium">
        {{ t('portfolio.transcript') }}
        <span class="sr-only">: {{ video.title }}</span>
      </summary>
      <div :lang="contentLang" class="space-y-3 border-t border-line px-4 py-3 text-ink-muted">
        <p v-for="(paragraph, index) in video.transcript" :key="index">{{ paragraph }}</p>
      </div>
    </details>
  </figure>
</template>
