<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import TagList from '@/components/TagList.vue'
import { careerHighlights, yearRange } from '@/data/career'
import { getAllTechnologies, getItemBySlug, localizeItem, portfolioItems } from '@/data/portfolio'

const { t, tm, rt, locale } = useI18n()

// The intro is a list of paragraphs in the locale files.
const intro = computed(() => (tm('about.intro') as unknown[]).map((p) => rt(p as string)))

const highlights = computed(() =>
  careerHighlights.map((highlight) => {
    const projects = highlight.projects
      .map((slug) => getItemBySlug(slug))
      .filter((item) => item !== undefined)
      .map((item) => localizeItem(item, locale.value))
    return {
      key: highlight.key,
      years: highlight.showYears === false ? '' : yearRange(projects.map((p) => p.date)),
      projects,
    }
  }),
)

const technologies = getAllTechnologies(portfolioItems)
</script>

<template>
  <article class="about">
    <header class="about__header">
      <h1 class="heading heading--page">{{ t('about.title') }}</h1>
      <p v-for="(paragraph, index) in intro" :key="index" :class="index ? 'about__text' : 'lead'">
        {{ paragraph }}
      </p>
    </header>

    <section aria-labelledby="highlights-heading" class="about__section">
      <h2 id="highlights-heading" class="heading heading--section">
        {{ t('about.highlightsHeading') }}
      </h2>
      <ol class="about__timeline">
        <li v-for="highlight in highlights" :key="highlight.key" class="about__highlight">
          <p v-if="highlight.years" class="about__years">{{ highlight.years }}</p>
          <h3 class="about__highlight-title">
            {{ t(`about.highlights.${highlight.key}.title`) }}
          </h3>
          <p class="about__text">{{ t(`about.highlights.${highlight.key}.text`) }}</p>
          <p v-if="highlight.projects.length" class="about__projects">
            <span class="about__projects-label">{{ t('about.projectsLabel') }}:</span>
            <template v-for="(project, index) in highlight.projects" :key="project.slug">
              <RouterLink
                :to="{ name: 'portfolio-item', params: { slug: project.slug } }"
                :lang="project.lang"
                class="about__project-link"
              >
                {{ project.title }}</RouterLink
              >{{ index < highlight.projects.length - 1 ? ', ' : '' }}
            </template>
          </p>
        </li>
      </ol>
    </section>

    <section v-if="technologies.length" aria-labelledby="tools-heading" class="about__section">
      <h2 id="tools-heading" class="heading heading--section">{{ t('about.toolsHeading') }}</h2>
      <p class="about__text">{{ t('about.toolsIntro') }}</p>
      <!-- Built from the untranslated (English) technology lists. -->
      <TagList :tags="technologies" size="large" lang="en" />
    </section>

    <RouterLink :to="{ name: 'work' }" class="about__cta">
      {{ t('about.seeWork') }} <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>

<style>
.about > * + * {
  margin-top: 3.5rem;
}

.about__header {
  max-width: 48rem;
}

.about__header > * + * {
  margin-top: 1rem;
}

.about__section > * + * {
  margin-top: 1.25rem;
}

.about__text {
  max-width: 48rem;
  line-height: 1.625;
  color: var(--ink-muted);
}

/* A vertical line down the left, with a dot for each highlight. */
.about__timeline {
  max-width: 48rem;
  border-left: 2px solid var(--line);
}

.about__highlight {
  position: relative;
  padding-left: 1.5rem;
}

.about__highlight + .about__highlight {
  margin-top: 2rem;
}

.about__highlight::before {
  content: '';
  position: absolute;
  top: 0.375rem;
  left: calc(-0.375rem - 1px);
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-full);
  background-color: var(--brand-600);
}

.about__highlight > * + * {
  margin-top: 0.5rem;
}

.about__years {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: 600;
  color: var(--accent-text);
}

.about__highlight-title {
  font-size: var(--text-xl);
  line-height: var(--text-xl-lh);
  font-weight: 600;
}

.about__projects {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  color: var(--ink-muted);
}

.about__projects-label {
  font-weight: 600;
  margin-right: 0.25rem;
}

.about__project-link {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--line);
  text-underline-offset: 3px;
}

.about__project-link:hover {
  color: var(--accent-text);
  text-decoration-color: currentColor;
}

.about__cta {
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

.about__cta:hover {
  background-color: var(--surface-muted);
}
</style>
