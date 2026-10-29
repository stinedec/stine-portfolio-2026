<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/BaseButton.vue'
import { useCounterStore } from '@/stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
const { count, doubleCount } = storeToRefs(counter)
</script>

<template>
  <section class="space-y-8">
    <header class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight">{{ t('home.title') }}</h1>
      <p class="max-w-2xl text-lg text-ink-muted">{{ t('home.intro') }}</p>
    </header>

    <div class="max-w-md space-y-4 rounded-xl border border-line bg-surface-muted p-6">
      <h2 class="font-semibold">{{ t('home.counter.heading') }}</h2>
      <p data-testid="count" aria-live="polite">
        {{ t('home.counter.value', { count, double: doubleCount }) }}
      </p>
      <div class="flex gap-3">
        <BaseButton @click="counter.increment()">{{ t('home.counter.increment') }}</BaseButton>
        <BaseButton variant="secondary" @click="counter.reset()">
          {{ t('home.counter.reset') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
