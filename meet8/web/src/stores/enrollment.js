import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiFetch } from '@/services/api.js';

export const useEnrollmentStore = defineStore('enrollment', () => {
  const enrollments = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Track which view's enrollments are currently loaded,
  // so we can re-fetch after a mutation to get the correctly-shaped data.
  const currentStudentId = ref(null);
  const currentCourseId = ref(null);

  async function fetchByStudent(studentId) {
    currentStudentId.value = studentId;
    currentCourseId.value = null; // Clear opposite context
    isLoading.value = true;
    error.value = null;
    try {
      // Returns: [{ enrollment_id, code, course_name, credits, grade }, ...]
      enrollments.value = await apiFetch(`/students/${studentId}/enrollments`);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchByCourse(courseId) {
    currentCourseId.value = courseId;
    currentStudentId.value = null; // Clear opposite context
    isLoading.value = true;
    error.value = null;
    try {
      // Returns: [{ enrollment_id, nim, student_name, grade }, ...]
      enrollments.value = await apiFetch(`/courses/${courseId}/enrollments`);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function enroll(studentId, courseId) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiFetch('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });
      // Re-fetch based on active context
      if (currentStudentId.value) {
        enrollments.value = await apiFetch('/students/' + currentStudentId.value + '/enrollments');
      } else if (currentCourseId.value) {
        enrollments.value = await apiFetch('/courses/' + currentCourseId.value + '/enrollments');
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateGrade(enrollmentId, grade) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiFetch('/enrollments/' + enrollmentId + '/grade', {
        method: 'PUT',
        body: JSON.stringify({ grade }),
      });
      if (currentStudentId.value) {
        enrollments.value = await apiFetch('/students/' + currentStudentId.value + '/enrollments');
      } else if (currentCourseId.value) {
        enrollments.value = await apiFetch('/courses/' + currentCourseId.value + '/enrollments');
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelEnrollment(enrollmentId) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiFetch(`/enrollments/${enrollmentId}`, { method: 'DELETE' });
      enrollments.value = enrollments.value.filter((e) => e.enrollment_id !== enrollmentId);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  function clear() {
    enrollments.value = [];
    error.value = null;
    currentStudentId.value = null;
    currentCourseId.value = null;
  }

  return {
    enrollments, isLoading, error, currentStudentId, currentCourseId,
    fetchByStudent, fetchByCourse, enroll, updateGrade, cancelEnrollment, clear,
  };
});
