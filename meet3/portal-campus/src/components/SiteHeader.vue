<!-- The sticky navigation bar -->
<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <header class="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-brand text-white dark:bg-brand-dark transition-colors">
    <!-- Logo -->
    <RouterLink to="/" class="text-lg font-bold">Portal Kampus</RouterLink>

    <!-- Navigation -->
    <nav class="flex gap-6 text-sm">
      <RouterLink
        to="/"
        class="opacity-80 hover:opacity-100 transition-opacity"
        active-class="!opacity-100 font-semibold border-b-2 border-white pb-0.5"
      >
        Beranda
      </RouterLink>
      <RouterLink
        to="/nilai"
        class="opacity-80 hover:opacity-100 transition-opacity"
        active-class="!opacity-100 font-semibold border-b-2 border-white pb-0.5"
      >
        Nilai
      </RouterLink>
      <RouterLink
        to="/jadwal"
        class="opacity-80 hover:opacity-100 transition-opacity"
        active-class="!opacity-100 font-semibold border-b-2 border-white pb-0.5"
      >
        Jadwal
      </RouterLink>
    </nav>

    <!-- Dark mode toggle -->
    <button
      class="rounded-lg border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25 transition-colors cursor-pointer"
      @click="ui.toggleDarkMode()"
    >
      {{ ui.darkMode ? 'Light' : 'Dark' }}
    </button>
  </header>
</template>
