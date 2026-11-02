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
  <figure :aria-labelledby="titleId" class="video">
    <figcaption class="video__caption">
      <span :id="titleId" :lang="contentLang" class="video__title">{{ video.title }}</span>
      <span v-if="video.description" :lang="contentLang" class="video__description">
        {{ video.description }}
      </span>
    </figcaption>

    <div class="video__frame">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="video.title"
        :lang="contentLang"
        loading="lazy"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
        class="video__player"
      />
      <video
        v-else-if="video.src"
        :src="assetUrl(video.src)"
        :poster="video.poster ? assetUrl(video.poster) : undefined"
        :aria-labelledby="titleId"
        controls
        preload="metadata"
        playsinline
        class="video__player"
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
        <p class="video__fallback">
          {{ t('portfolio.videoFallback') }}
          <a :href="assetUrl(video.src)" class="video__fallback-link" download>
            {{ t('portfolio.downloadVideo') }}
          </a>
        </p>
      </video>
    </div>

    <details v-if="video.transcript?.length" class="video__transcript">
      <summary class="video__transcript-toggle">
        {{ t('portfolio.transcript') }}
        <span class="sr-only">: {{ video.title }}</span>
      </summary>
      <div :lang="contentLang" class="video__transcript-body">
        <p v-for="(paragraph, index) in video.transcript" :key="index">{{ paragraph }}</p>
      </div>
    </details>
  </figure>
</template>

<style>
.video > * + * {
  margin-top: 0.75rem;
}

.video__caption > * + * {
  margin-top: 0.25rem;
}

.video__title,
.video__description {
  display: block;
}

.video__title {
  font-size: var(--text-lg);
  line-height: var(--text-lg-lh);
  font-weight: 600;
}

.video__description {
  color: var(--ink-muted);
}

.video__frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background-color: black;
}

.video__player {
  width: 100%;
  height: 100%;
}

.video__fallback {
  padding: 1rem;
  color: white;
}

.video__fallback-link {
  text-decoration: underline;
}

.video__transcript {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.video__transcript-toggle {
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

.video__transcript-body {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--line);
  color: var(--ink-muted);
}

.video__transcript-body > * + * {
  margin-top: 0.75rem;
}
</style>
