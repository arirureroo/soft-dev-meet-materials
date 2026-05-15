<!--
  This is the simplest page,
  just static content.
  Navigating here from /nilai does NOT reload the browser.
-->
<template>
  <section class="flex flex-col items-center gap-6 py-16 text-center">
    <h1 class="text-3xl font-bold">Selamat Datang di Portal Kampus</h1>
    <p class="max-w-md text-slate-500 dark:text-slate-400">
      Lihat nilai, jadwal, dan informasi akademik kamu di satu tempat.
    </p>
    <RouterLink
      to="/nilai"
      class="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-light transition-colors"
    >
      Lihat Nilai →
    </RouterLink>
  </section>
</template>
