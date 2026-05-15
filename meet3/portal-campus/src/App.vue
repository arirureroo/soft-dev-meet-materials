<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors duration-300">
    <SiteHeader />
    <main class="mx-auto max-w-4xl px-4 py-8">
      <RouterView />
    </main>
    <footer class="border-t border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-400">
      <p>© 2026 Sistem Informasi Kampus &nbsp;|&nbsp; <a href="#" class="hover:text-brand">Bantuan</a> &nbsp;|&nbsp; <a href="#" class="hover:text-brand">Ketentuan Akademik</a></p>
    </footer>
  </div>
</template>
