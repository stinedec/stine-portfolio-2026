<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TitleComponent',
})
</script>
<template>
  <h1 class="title-component"><sup>(chri)</sup>stinedec<sub>(arteret)</sub></h1>
</template>
<style lang="css">
.title-component {
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
