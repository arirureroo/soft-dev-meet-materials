// Dark mode is the classic example of global state:
// - The toggle button lives in SiteHeader.
// - The body background, cards, and text all react to it.
// - Threading it as a prop through every component would be prop drilling.
import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  // State
  const darkMode = ref(false)

  // Actions
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  // Side effect
  // Sync the `dark` class on <html> so Tailwind's `dark:` variant works.
  watch(darkMode, (isDark) => {
    document.documentElement.classList.toggle('dark', isDark)
  })

  return { darkMode, toggleDarkMode }
})
