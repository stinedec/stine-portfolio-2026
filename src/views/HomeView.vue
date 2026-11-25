<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import ExpertiseSection from '@/components/ExpertiseSection.vue'
import PortfolioGrid from '@/components/PortfolioGrid.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import { getRecentItems, localizeItem, portfolioItems } from '@/data/portfolio'

const { t, locale } = useI18n()

const recentItems = computed(() =>
  getRecentItems(portfolioItems, 6).map((item) => localizeItem(item, locale.value)),
)
</script>

<template>
  <div class="home">
    <section aria-labelledby="intro-heading" class="home__intro">
      <h1 id="intro-heading" class="sr-only heading heading--page">{{ t('home.greeting') }}</h1>
      <TitleComponent>(chri)stinedec(arteret)</TitleComponent>
      <p class="home__role">{{ t('home.role') }}</p>
      <p class="lead">{{ t('home.blurb') }}</p>
    </section>

    <ExpertiseSection />

    <section aria-labelledby="recent-work-heading" class="home__recent">
      <h2 id="recent-work-heading" class="heading heading--section">
        {{ t('home.recentWork') }}
      </h2>
      <PortfolioGrid :items="recentItems" />
      <div class="home__more">
        <RouterLink :to="{ name: 'work' }" class="home__more-link">
          {{ t('home.seeAll') }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style>
.home > * + * {
  margin-top: 4rem;
}

.home__intro {
  /* max-width: 42rem; */
  text-align: center;
}

.home__intro > * + * {
  margin-top: 1rem;
}

.home__role {
  font-size: var(--text-xl);
  line-height: var(--text-xl-lh);
  font-weight: 500;
  color: var(--accent-text-large);
}

.home__recent > * + * {
  margin-top: 1.5rem;
}

.home__more {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.home__more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: 500;
}

.home__more-link:hover {
  background-color: var(--surface-muted);
}
</style>
