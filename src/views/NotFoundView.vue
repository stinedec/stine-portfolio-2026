<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title heading">{{ t('notFound.title') }}</h1>
    <p class="not-found__message">{{ t('notFound.message') }}</p>
    <RouterLink to="/" class="not-found__link">
      {{ t('notFound.back') }}
    </RouterLink>
  </section>
</template>

<style>
.not-found {
  padding-block: 3rem;
  text-align: center;
}

.not-found > * + * {
  margin-top: 1rem;
}

.not-found__code {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: 600;
  color: var(--accent-text);
}

.not-found__title {
  font-size: var(--text-3xl);
  line-height: var(--text-3xl-lh);
  font-weight: 700;
}

.not-found__message {
  color: var(--ink-muted);
}

.not-found__link {
  display: inline-block;
  font-weight: 500;
  color: var(--accent-text);
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
