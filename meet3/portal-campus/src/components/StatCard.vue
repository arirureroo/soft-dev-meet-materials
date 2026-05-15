<!--
  This is a "dumb" component.
  It receives data through props and renders it.
  No logic, no fetch, no store.
  The parent decides what value and label to show.
-->
<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-5 shadow-sm flex-1 min-w-[120px] transition-colors">
    <span class="text-3xl font-bold text-brand dark:text-blue-300">{{ value }}</span>
    <span class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ label }}</span>
  </div>
</template>
