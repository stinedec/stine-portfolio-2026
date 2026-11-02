import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Save' } })
    expect(wrapper.text()).toBe('Save')
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies the variant classes', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('button--secondary')
  })

  it('forwards click listeners to the native button', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, { attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })
})
