<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TitleComponent',
})
</script>
<!--
  Decorative: hidden from screen readers, which read the page's real (visually
  hidden) h1 instead. Otherwise they'd hear "chri stinedec arteret" as a
  second main heading.
-->
<template>
  <p class="title-component" aria-hidden="true"><sup>(chri)</sup>stinedec<sub>(arteret)</sub></p>
</template>
<style lang="css">
.title-component {
  /* Same font and spacing as real headings (see h1–h6 in base.css). */
  font-family: var(--font-heading);
  letter-spacing: var(--tracking-loose);
  font-size: 5em;
  font-weight: 700;

  sub,
  sup {
    font-size: 0.5em;
    opacity: 0.2;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
