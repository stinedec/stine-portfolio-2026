import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCounterStore } from '../counter'

describe('counter store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts at zero', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
  })

  it('increments and derives doubleCount', () => {
    const store = useCounterStore()
    store.increment()
    store.increment(2)
    expect(store.count).toBe(3)
    expect(store.doubleCount).toBe(6)
  })

  it('resets', () => {
    const store = useCounterStore()
    store.increment(5)
    store.reset()
    expect(store.count).toBe(0)
  })
})
