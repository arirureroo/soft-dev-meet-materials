import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiFetch } from '@/services/api.js';

// defineStore('id', setupFn) ← the Setup Store syntax.
// The 'id' is a unique string that identifies this store across the application.
//
// Inside the setup function:
//   - ref()       → becomes state
//   - computed()  → becomes a getter
//   - function    → becomes an action
export const useStudentStore = defineStore('student', () => {
  // State
  const students = ref([]);    // The list of students from the API
  const isLoading = ref(false); // True while any async action is running
  const error = ref(null);     // Holds an error message string, or null

  // Actions

  // Actions are plain async functions that:
  //  1. Set `isLoading = true` to signal the UI that work is happening
  //  2. Call the backend via apiFetch()
  //  3. Update the state on success
  //  4. Store an error message on failure
  //  5. Always reset `isLoading = false` when done
  async function fetchAll() {
    isLoading.value = true;
    error.value = null;
    try {
      students.value = await apiFetch('/students');
    } catch (err) {
      error.value = err.message;
    } finally {
      // 'finally' always runs, whether the try succeeded or threw.
      // This guarantees the loading spinner always disappears.
      isLoading.value = false;
    }
  }

  async function createStudent(data) {
    isLoading.value = true;
    error.value = null;
    try {
      const newStudent = await apiFetch('/students', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Append to the local list immediately — no need to re-fetch everything.
      students.value.push(newStudent);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteStudent(id) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiFetch(`/students/${id}`, { method: 'DELETE' });
      // Remove the deleted student from the local state without re-fetching.
      students.value = students.value.filter((s) => s.id !== id);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Expose state and actions so components can use them.
  return { students, isLoading, error, fetchAll, createStudent, deleteStudent };
});
