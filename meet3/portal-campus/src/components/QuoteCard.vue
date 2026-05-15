<!-- Fetches and displays a random motivational quote -->
<script setup>
import { ref } from 'vue'
import { fetchRandomQuote } from '@/services/api'

const quoteText = ref('Klik tombol di bawah untuk memuat kutipan motivasi.')
const quoteAuthor = ref('')
const isLoading = ref(false)

async function loadQuote() {
  isLoading.value = true
  quoteText.value = 'Memuat kutipan...'
  quoteAuthor.value = ''

  try {
    const quote = await fetchRandomQuote()
    quoteText.value = `"${quote.text}"`
    quoteAuthor.value = `— ${quote.author}`
  } catch (err) {
    console.error('Failed to load quote:', err)
    quoteText.value = 'Gagal memuat kutipan. Periksa koneksi internetmu dan coba lagi.'
    quoteAuthor.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors">
    <p :class="['text-base leading-relaxed', isLoading ? 'text-slate-400' : 'italic text-slate-700 dark:text-slate-200']">
      {{ quoteText }}
    </p>
    <p v-if="quoteAuthor" class="text-sm font-semibold text-brand dark:text-blue-300">
      {{ quoteAuthor }}
    </p>
    <button
      :disabled="isLoading"
      class="self-start rounded-lg border-2 border-brand text-brand px-4 py-2 text-sm font-semibold hover:bg-brand hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-400 dark:hover:text-slate-900"
      @click="loadQuote"
    >
      {{ isLoading ? 'Memuat...' : 'Muat Kutipan' }}
    </button>
  </div>
</template>
