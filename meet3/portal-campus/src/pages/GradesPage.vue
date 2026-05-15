<script setup>
import { onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import StatCard from '@/components/StatCard.vue'
import GradeCard from '@/components/GradeCard.vue'
import AddCourseForm from '@/components/AddCourseForm.vue'
import QuoteCard from '@/components/QuoteCard.vue'

const coursesStore = useCoursesStore()

// fetch courses when this page mounts.
onMounted(() => {
  coursesStore.loadCourses()
})

// Handle the event emitted by AddCourseForm.
async function handleCourseAdded(payload) {
  await coursesStore.addCourse(payload)
}
</script>

<template>
  <!-- Summary Section -->
  <section class="mb-10">
    <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      Ringkasan Akademik
    </h2>
    <div class="flex flex-wrap gap-4">
      <StatCard :value="coursesStore.ipk" label="IPK" />
      <StatCard :value="coursesStore.totalSks" label="Total SKS" />
      <StatCard value="Ganjil 2025" label="Semester Berjalan" />
    </div>
  </section>

  <!-- Grades Section -->
  <section class="mb-10">
    <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      Nilai Semester Ini
    </h2>

    <!-- Loading state -->
    <p v-if="coursesStore.isLoading" class="text-sm text-slate-400">Memuat...</p>

    <!-- Error state -->
    <p v-else-if="coursesStore.error" class="text-sm text-red-500">{{ coursesStore.error }}</p>

    <!-- Course list -->
    <div v-else class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <GradeCard
        v-for="course in coursesStore.courses"
        :key="course.id"
        :course="course"
        class="sm:flex-1 sm:min-w-62.5"
      />
      <p v-if="coursesStore.courses.length === 0" class="text-sm text-slate-400">
        Belum ada mata kuliah.
      </p>
    </div>
  </section>

  <!-- Add Course Section -->
  <section class="mb-10">
    <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      Tambah Mata Kuliah
    </h2>
    <AddCourseForm @course-added="handleCourseAdded" />
  </section>

  <!-- Quote Section -->
  <section>
    <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      Motivasi Hari Ini
    </h2>
    <QuoteCard />
  </section>
</template>
