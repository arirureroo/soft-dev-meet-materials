// The courses list is needed by:
// - GradesPage (renders the list)
// - AddCourseForm (appends to the list after POST)
// - SummarySection (computes IPK and total SKS from the list)
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchCourses, createCourse } from '@/services/api'

export const useCoursesStore = defineStore('courses', () => {
  // State
  const courses = ref([])
  const isLoading = ref(false)
  const error = ref('')

  // Getters
  const totalSks = computed(() => courses.value.reduce((sum, c) => sum + Number(c.sks), 0))

  const ipk = computed(() => {
    if (courses.value.length === 0) return '0.00'
    const gradePoints = {
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'C+': 2.3,
      C: 2.0,
    }
    let totalWeight = 0
    let totalCredits = 0
    courses.value.forEach((c) => {
      const point = gradePoints[c.grade] ?? 0
      totalWeight += point * Number(c.sks)
      totalCredits += Number(c.sks)
    })
    return totalCredits === 0 ? '0.00' : (totalWeight / totalCredits).toFixed(2)
  })

  // Actions
  async function loadCourses() {
    isLoading.value = true
    error.value = ''
    try {
      courses.value = await fetchCourses()
    } catch (err) {
      error.value = 'Gagal memuat daftar mata kuliah.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function addCourse(payload) {
    const saved = await createCourse(payload)
    courses.value.push(saved)
    return saved
  }

  return { courses, isLoading, error, totalSks, ipk, loadCourses, addCourse }
})
