<!--
  This is a "dumb" component.
  It receives a `course` object via props and renders the badge + info.
  The badge colour is computed from the grade letter.
-->
<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
})

// Maps a grade letter to Tailwind colour classes for the badge.
function badgeClasses(grade) {
  const map = {
    A: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'A-': 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
    'B+': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    B: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'C+': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    C: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  }
  return map[grade] || 'bg-slate-100 text-slate-800'
}
</script>

<template>
  <article class="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 shadow-sm transition-colors">
    <!-- Grade badge -->
    <div
      :class="['flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-bold', badgeClasses(course.grade)]"
    >
      {{ course.grade }}
    </div>
    <!-- Course info -->
    <div>
      <h3 class="font-medium">{{ course.name }}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">{{ course.sks }} SKS</p>
    </div>
  </article>
</template>
