<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppHeader from '@/components/AppHeader.vue'

const { t } = useI18n()
</script>

<template>
  <div class="layout">
    <a href="#main" class="layout__skip-link">
      {{ t('a11y.skipToContent') }}
    </a>

    <AppHeader />

    <main id="main" tabindex="-1" class="layout__main container">
      <slot />
    </main>

    <footer class="layout__footer">
      <p class="layout__footer-text container">{{ t('footer.builtWith') }}</p>
    </footer>
  </div>
</template>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

/* Hidden until a keyboard user tabs to it. */
.layout__skip-link:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.layout__skip-link:focus {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 50;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--surface);
  box-shadow: var(--shadow-sm);
}

.layout__main {
  flex: 1;
  padding-block: 3rem;
  outline: none;
}

.layout__footer {
  border-top: 1px solid var(--line);
}

.layout__footer-text {
  padding-block: 1.5rem;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  color: var(--ink-muted);
}
</style>
