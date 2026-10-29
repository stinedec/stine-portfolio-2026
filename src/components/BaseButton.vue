<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'

const { variant = 'primary', type = 'button' } = defineProps<{
  variant?: Variant
  type?: 'button' | 'submit' | 'reset'
}>()

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border border-line bg-surface hover:bg-surface-muted',
  ghost: 'hover:bg-surface-muted',
}
</script>

<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
    ]"
  >
    <slot />
  </button>
</template>
