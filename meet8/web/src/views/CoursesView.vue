<script setup>
import { ref, onMounted } from 'vue';
import { useCourseStore } from '@/stores/course.js';
import { useStudentStore } from '@/stores/student.js';
import { useEnrollmentStore } from '@/stores/enrollment.js';

const courseStore = useCourseStore();
const studentStore = useStudentStore();
const enrollmentStore = useEnrollmentStore();

// Add Course form
const showForm = ref(false);
const form = ref({ code: '', name: '', credits: '' });

// Enrollment Section
const activeCourse = ref(null);
const enrollStudentId = ref('');
const editingGradeId = ref(null);
const editingGradeValue = ref('');

onMounted(() => {
  courseStore.fetchAll();
  studentStore.fetchAll();
});

// Course Methods
async function handleAddCourse() {
  await courseStore.createCourse({
    ...form.value,
    credits: Number(form.value.credits),
  });
  if (!courseStore.error) {
    form.value = { code: '', name: '', credits: '' };
    showForm.value = false;
  }
}

async function handleDeleteCourse(id) {
  if (!confirm('Delete this course?')) return;
  if (activeCourse.value?.id === id) closeEnrollments();
  await courseStore.deleteCourse(id);
}

// Enrollment Methods
function viewEnrollments(course) {
  activeCourse.value = course;
  enrollStudentId.value = '';
  editingGradeId.value = null;
  enrollmentStore.fetchByCourse(course.id);
}

function closeEnrollments() {
  activeCourse.value = null;
  enrollmentStore.clear();
}

async function handleEnroll() {
  await enrollmentStore.enroll(Number(enrollStudentId.value), activeCourse.value.id);
  if (!enrollmentStore.error) enrollStudentId.value = '';
}

function startEditGrade(enrollment) {
  editingGradeId.value = enrollment.enrollment_id;
  editingGradeValue.value = enrollment.grade ?? '';
}

async function handleSaveGrade(enrollmentId) {
  await enrollmentStore.updateGrade(enrollmentId, editingGradeValue.value || null);
  editingGradeId.value = null;
}

async function handleCancelEnrollment(enrollmentId) {
  if (!confirm('Drop this student?')) return;
  await enrollmentStore.cancelEnrollment(enrollmentId);
}
</script>

<template>
  <div class="mb-10">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Courses</h1>
      <button @click="showForm = !showForm" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ showForm ? 'Cancel' : 'Add Course' }}
      </button>
    </div>

    <!-- Error/Loading -->
    <div v-if="courseStore.error" class="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
      {{ courseStore.error }}
    </div>
    <div v-if="courseStore.isLoading" class="text-gray-500 mb-4">Loading courses...</div>

    <!-- Add Course Form -->
    <div v-if="showForm" class="border border-gray-300 p-4 mb-6 bg-gray-50">
      <h2 class="text-lg font-bold mb-4">New Course</h2>
      <form @submit.prevent="handleAddCourse" class="flex flex-col gap-3">
        <div>
          <label class="block mb-1 font-semibold">Course Code</label>
          <input v-model="form.code" required class="border p-2 w-full" placeholder="IF2210" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Course Name</label>
          <input v-model="form.name" required class="border p-2 w-full" placeholder="Algorithm Design" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Credits (SKS)</label>
          <input v-model="form.credits" type="number" min="1" max="6" required class="border p-2 w-full" />
        </div>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 mt-2" :disabled="courseStore.isLoading">
          Save Course
        </button>
      </form>
    </div>

    <!-- Courses Table -->
    <table class="w-full border-collapse border border-gray-300 text-left mb-8">
      <thead class="bg-gray-100">
        <tr>
          <th class="border border-gray-300 p-2">Code</th>
          <th class="border border-gray-300 p-2">Name</th>
          <th class="border border-gray-300 p-2">Credits</th>
          <th class="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="courseStore.courses.length === 0">
          <td colspan="4" class="border border-gray-300 p-4 text-center text-gray-500">No courses found.</td>
        </tr>
        <tr v-for="course in courseStore.courses" :key="course.id" :class="{'bg-blue-50': activeCourse?.id === course.id}">
          <td class="border border-gray-300 p-2">{{ course.code }}</td>
          <td class="border border-gray-300 p-2">{{ course.name }}</td>
          <td class="border border-gray-300 p-2">{{ course.credits }} SKS</td>
          <td class="border border-gray-300 p-2 space-x-2">
            <button @click="viewEnrollments(course)" class="text-blue-600 underline">Class List</button>
            <button @click="handleDeleteCourse(course.id)" class="text-red-600 underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Selected Course Enrollments Section -->
    <div v-if="activeCourse" class="border border-blue-300 p-4 bg-white">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-bold">Class List for {{ activeCourse.name }}</h2>
        <button @click="closeEnrollments" class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>

      <div v-if="enrollmentStore.error" class="bg-red-100 text-red-700 p-2 mb-4 border border-red-300">
        {{ enrollmentStore.error }}
      </div>

      <!-- Enroll Form -->
      <div class="flex gap-2 mb-4">
        <select v-model="enrollStudentId" class="border p-2 flex-1">
          <option value="" disabled>Select a student to add...</option>
          <option v-for="s in studentStore.students" :key="s.id" :value="s.id">
            {{ s.nim }} - {{ s.name }}
          </option>
        </select>
        <button @click="handleEnroll" :disabled="!enrollStudentId" class="bg-blue-600 text-white px-4 py-2 disabled:bg-gray-400">
          Add Student
        </button>
      </div>

      <div v-if="enrollmentStore.isLoading" class="text-gray-500 mb-4">Loading class list...</div>

      <!-- Enrollments Table -->
      <table v-else class="w-full border-collapse border border-gray-300 text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 p-2">NIM</th>
            <th class="border border-gray-300 p-2">Student Name</th>
            <th class="border border-gray-300 p-2">Grade</th>
            <th class="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="enrollmentStore.enrollments.length === 0">
            <td colspan="4" class="border border-gray-300 p-4 text-center text-gray-500">No students enrolled.</td>
          </tr>
          <tr v-for="e in enrollmentStore.enrollments" :key="e.enrollment_id">
            <td class="border border-gray-300 p-2">{{ e.nim }}</td>
            <td class="border border-gray-300 p-2">{{ e.student_name }}</td>
            <td class="border border-gray-300 p-2">
              <div v-if="editingGradeId === e.enrollment_id" class="flex gap-1">
                <input v-model="editingGradeValue" class="border p-1 w-16" placeholder="A" />
                <button @click="handleSaveGrade(e.enrollment_id)" class="text-green-600 underline">Save</button>
                <button @click="editingGradeId = null" class="text-gray-500 underline">Cancel</button>
              </div>
              <div v-else class="flex justify-between">
                <span>{{ e.grade ?? '-' }}</span>
                <button @click="startEditGrade(e)" class="text-blue-600 underline text-sm ml-2">Edit</button>
              </div>
            </td>
            <td class="border border-gray-300 p-2">
              <button @click="handleCancelEnrollment(e.enrollment_id)" class="text-red-600 underline">Drop</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
