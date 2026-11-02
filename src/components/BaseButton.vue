<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'

const { variant = 'primary', type = 'button' } = defineProps<{
  variant?: Variant
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button :type="type" :class="['button', `button--${variant}`]">
    <slot />
  </button>
</template>

<style>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: 500;
  cursor: pointer;
  transition-property: color, background-color, border-color;
  transition-timing-function: var(--ease);
  transition-duration: var(--duration);
}

.button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.button--primary {
  background-color: var(--brand-600);
  color: white;
}

.button--primary:hover {
  background-color: var(--brand-700);
}

.button--secondary {
  border: 1px solid var(--line);
  background-color: var(--surface);
}

.button--secondary:hover,
.button--ghost:hover {
  background-color: var(--surface-muted);
}
</style>
