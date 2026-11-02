<script setup lang="ts">
const { tags, size = 'small' } = defineProps<{
  tags: string[]
  /** `small` for cards, `large` for an item's page. */
  size?: 'small' | 'large'
}>()
</script>

<template>
  <ul :class="['tag-list', `tag-list--${size}`]">
    <li v-for="tag in tags" :key="tag" class="tag-list__tag">{{ tag }}</li>
  </ul>
</template>

<style>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag-list__tag {
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.tag-list--large {
  gap: 0.5rem;
  font-size: var(--text-xs);
  line-height: var(--text-xs-lh);
  color: var(--ink-muted);
}

.tag-list--large .tag-list__tag {
  padding: 0.25rem 0.625rem;
}
</style>
