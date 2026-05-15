<script setup>
import { ref } from 'vue'

const emit = defineEmits(['course-added'])

// Local state
// only this component cares about these values.
const name = ref('')
const sks = ref(3)
const grade = ref('A')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (!name.value.trim()) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Emit the payload up to the parent.
    // The parent (GradesPage) will call the store action to POST and push.
    await emit('course-added', {
      name: name.value.trim(),
      sks: Number(sks.value),
      grade: grade.value,
    })

    // Reset form on success
    name.value = ''
    sks.value = 3
    grade.value = 'A'
  } catch (err) {
    errorMessage.value = 'Gagal menyimpan. Coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors"
    @submit.prevent="handleSubmit"
  >
    <!-- Course name -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[160px]">
      <label for="input-name" class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Nama Mata Kuliah
      </label>
      <input
        id="input-name"
        v-model="name"
        type="text"
        placeholder="contoh: Ekonometrika"
        required
        class="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm focus:border-brand focus:outline-none transition-colors"
      />
    </div>

    <!-- SKS -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[100px]">
      <label for="input-sks" class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Jumlah SKS
      </label>
      <input
        id="input-sks"
        v-model.number="sks"
        type="number"
        min="1"
        max="6"
        required
        class="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm focus:border-brand focus:outline-none transition-colors"
      />
    </div>

    <!-- Grade -->
    <div class="flex flex-col gap-1.5 flex-1 min-w-[100px]">
      <label for="input-grade" class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Nilai
      </label>
      <select
        id="input-grade"
        v-model="grade"
        required
        class="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm focus:border-brand focus:outline-none transition-colors"
      >
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
      </select>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {{ isSubmitting ? 'Menyimpan...' : 'Tambahkan' }}
    </button>

    <!-- Error message -->
    <p v-if="errorMessage" class="w-full text-sm text-red-500">{{ errorMessage }}</p>
  </form>
</template>
