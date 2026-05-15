<!--
  Any URL that doesn't match a defined route renders this page.
-->
<template>
  <section class="flex flex-col items-center gap-4 py-16 text-center">
    <h1 class="text-5xl font-bold text-slate-300 dark:text-slate-600">404</h1>
    <p class="text-lg text-slate-500 dark:text-slate-400">Halaman tidak ditemukan.</p>
    <RouterLink to="/" class="text-brand dark:text-blue-300 font-medium hover:underline">
      ← Kembali ke Beranda
    </RouterLink>
  </section>
</template>
