import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import es from '@/locales/es.json'

/** `en` is the source of truth; other locales are type-checked against it. */
export type MessageSchema = typeof en

export const SUPPORTED_LOCALES = ['en', 'es'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'locale'

function isSupported(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
}

function detectLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isSupported(saved)) return saved
  } catch {
    /* storage unavailable */
  }
  const browser = navigator.language.split('-')[0]
  return isSupported(browser) ? browser : 'en'
}

export const i18n = createI18n<[MessageSchema], AppLocale, false>({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* storage unavailable */
  }
}

document.documentElement.lang = i18n.global.locale.value
