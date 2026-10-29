<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppHeader from '@/components/AppHeader.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:shadow"
    >
      {{ t('a11y.skipToContent') }}
    </a>

    <AppHeader />

    <main id="main" tabindex="-1" class="mx-auto w-full max-w-5xl flex-1 px-4 py-12 outline-none">
      <slot />
    </main>

    <footer class="border-t border-line">
      <p class="mx-auto max-w-5xl px-4 py-6 text-sm text-ink-muted">{{ t('footer.builtWith') }}</p>
    </footer>
  </div>
</template>
