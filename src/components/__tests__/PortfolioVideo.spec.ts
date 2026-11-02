import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import type { PortfolioVideo as Video } from '@/data/portfolio'
import en from '@/locales/en.json'

import PortfolioVideo from '../PortfolioVideo.vue'

function mountVideo(video: Video) {
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(PortfolioVideo, { props: { video }, global: { plugins: [i18n] } })
}

describe('PortfolioVideo', () => {
  it('plays a self-hosted file with controls, captions on and no autoplay', () => {
    const wrapper = mountVideo({
      title: 'Walkthrough',
      src: 'portfolio/demo.mp4',
      poster: 'portfolio/demo.jpg',
      captions: 'portfolio/demo.en.vtt',
    })
    const video = wrapper.get('video')
    expect(video.attributes('src')).toBe('/portfolio/demo.mp4')
    expect(video.attributes('poster')).toBe('/portfolio/demo.jpg')
    expect(video.attributes()).toHaveProperty('controls')
    expect(video.attributes()).not.toHaveProperty('autoplay')

    const track = wrapper.get('track')
    expect(track.attributes('kind')).toBe('captions')
    expect(track.attributes('src')).toBe('/portfolio/demo.en.vtt')
    expect(track.attributes('srclang')).toBe('en')
    expect(track.attributes()).toHaveProperty('default')
  })

  it('names the video and its figure with the visible title', () => {
    const wrapper = mountVideo({ title: 'Walkthrough', src: 'portfolio/demo.mp4' })
    const titleId = wrapper.get('figcaption span').attributes('id')
    expect(wrapper.get('figcaption span').text()).toBe('Walkthrough')
    expect(wrapper.get('figure').attributes('aria-labelledby')).toBe(titleId)
    expect(wrapper.get('video').attributes('aria-labelledby')).toBe(titleId)
  })

  it('embeds YouTube in privacy-enhanced mode with a titled iframe', () => {
    const wrapper = mountVideo({ title: 'Talk', youtubeId: 'abc123', transcript: ['Hello.'] })
    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('src')).toBe('https://www.youtube-nocookie.com/embed/abc123?rel=0')
    expect(iframe.attributes('title')).toBe('Talk')
    expect(wrapper.find('video').exists()).toBe(false)
  })

  it('embeds Vimeo without tracking', () => {
    const iframe = mountVideo({ title: 'Reel', vimeoId: '42', transcript: ['Hi.'] }).get('iframe')
    expect(iframe.attributes('src')).toBe('https://player.vimeo.com/video/42?dnt=1')
  })

  it('puts the transcript in an expandable section named for the video', () => {
    const wrapper = mountVideo({
      title: 'Walkthrough',
      src: 'portfolio/demo.mp4',
      transcript: ['First paragraph.', 'Second paragraph.'],
    })
    expect(wrapper.get('summary').text()).toBe('Transcript : Walkthrough')
    expect(wrapper.findAll('details p').map((p) => p.text())).toEqual([
      'First paragraph.',
      'Second paragraph.',
    ])
  })
})
