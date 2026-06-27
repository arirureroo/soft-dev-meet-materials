import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiFetch } from '@/services/api.js';

export const useCourseStore = defineStore('course', () => {
  // State
  const courses = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchAll() {
    isLoading.value = true;
    error.value = null;
    try {
      courses.value = await apiFetch('/courses');
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function createCourse(data) {
    isLoading.value = true;
    error.value = null;
    try {
      const newCourse = await apiFetch('/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      courses.value.push(newCourse);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCourse(id) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiFetch(`/courses/${id}`, { method: 'DELETE' });
      courses.value = courses.value.filter((c) => c.id !== id);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return { courses, isLoading, error, fetchAll, createCourse, deleteCourse };
});
