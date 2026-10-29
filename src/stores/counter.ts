import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Setup-style store: state = refs, getters = computed, actions = functions.
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment(by = 1) {
    count.value += by
  }

  function reset() {
    count.value = 0
  }

  return { count, doubleCount, increment, reset }
})
