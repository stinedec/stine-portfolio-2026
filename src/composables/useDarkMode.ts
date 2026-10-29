import { readonly, ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

function initialPreference(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved === 'dark'
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

// Module-level state so every caller shares one source of truth.
const isDark = ref(initialPreference())

watch(
  isDark,
  (dark) => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    } catch {
      /* storage unavailable */
    }
  },
  { immediate: true },
)

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark: readonly(isDark), toggle }
}
