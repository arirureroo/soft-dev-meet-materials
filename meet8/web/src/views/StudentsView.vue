<script setup>
import { ref, onMounted } from 'vue';
import { useStudentStore } from '@/stores/student.js';
import { useCourseStore } from '@/stores/course.js';
import { useEnrollmentStore } from '@/stores/enrollment.js';

const studentStore = useStudentStore();
const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();

// Add Student form
const showForm = ref(false);
const form = ref({ nim: '', name: '', password: '', gpa: '', semester: '', major: '' });

// Enrollments section
const activeStudent = ref(null);
const enrollCourseId = ref('');
const editingGradeId = ref(null);
const editingGradeValue = ref('');

onMounted(() => {
  studentStore.fetchAll();
  courseStore.fetchAll();
});

// Student methods
async function handleAddStudent() {
  await studentStore.createStudent({
    ...form.value,
    gpa: Number(form.value.gpa),
    semester: Number(form.value.semester),
  });
  if (!studentStore.error) {
    form.value = { nim: '', name: '', password: '', gpa: '', semester: '', major: '' };
    showForm.value = false;
  }
}

async function handleDeleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  if (activeStudent.value?.id === id) closeEnrollments();
  await studentStore.deleteStudent(id);
}

// Enrollment methods
function viewEnrollments(student) {
  activeStudent.value = student;
  enrollCourseId.value = '';
  editingGradeId.value = null;
  enrollmentStore.fetchByStudent(student.id);
}

function closeEnrollments() {
  activeStudent.value = null;
  enrollmentStore.clear();
}

async function handleEnroll() {
  await enrollmentStore.enroll(activeStudent.value.id, Number(enrollCourseId.value));
  if (!enrollmentStore.error) enrollCourseId.value = '';
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
  if (!confirm('Drop this course?')) return;
  await enrollmentStore.cancelEnrollment(enrollmentId);
}
</script>

<template>
  <div class="mb-10">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Students</h1>
      <button @click="showForm = !showForm" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ showForm ? 'Cancel' : 'Add Student' }}
      </button>
    </div>

    <!-- Error/Loading -->
    <div v-if="studentStore.error" class="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">
      {{ studentStore.error }}
    </div>
    <div v-if="studentStore.isLoading" class="text-gray-500 mb-4">Loading students...</div>

    <!-- Add Student Form -->
    <div v-if="showForm" class="border border-gray-300 p-4 mb-6 bg-gray-50">
      <h2 class="text-lg font-bold mb-4">New Student</h2>
      <form @submit.prevent="handleAddStudent" class="flex flex-col gap-3">
        <div>
          <label class="block mb-1 font-semibold">NIM</label>
          <input v-model="form.nim" required class="border p-2 w-full" placeholder="2024001001" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Name</label>
          <input v-model="form.name" required class="border p-2 w-full" placeholder="Budi Santoso" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Password</label>
          <input v-model="form.password" type="password" required class="border p-2 w-full" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Major</label>
          <input v-model="form.major" required class="border p-2 w-full" placeholder="Informatics" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1 font-semibold">Semester</label>
            <input v-model="form.semester" type="number" required class="border p-2 w-full" />
          </div>
          <div class="flex-1">
            <label class="block mb-1 font-semibold">GPA</label>
            <input v-model="form.gpa" type="number" step="0.01" required class="border p-2 w-full" />
          </div>
        </div>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 mt-2" :disabled="studentStore.isLoading">
          Save Student
        </button>
      </form>
    </div>

    <!-- Students Table -->
    <table class="w-full border-collapse border border-gray-300 text-left mb-8">
      <thead class="bg-gray-100">
        <tr>
          <th class="border border-gray-300 p-2">NIM</th>
          <th class="border border-gray-300 p-2">Name</th>
          <th class="border border-gray-300 p-2">Major</th>
          <th class="border border-gray-300 p-2">Sem</th>
          <th class="border border-gray-300 p-2">GPA</th>
          <th class="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="studentStore.students.length === 0">
          <td colspan="6" class="border border-gray-300 p-4 text-center text-gray-500">No students found.</td>
        </tr>
        <tr v-for="student in studentStore.students" :key="student.id" :class="{'bg-blue-50': activeStudent?.id === student.id}">
          <td class="border border-gray-300 p-2">{{ student.nim }}</td>
          <td class="border border-gray-300 p-2">{{ student.name }}</td>
          <td class="border border-gray-300 p-2">{{ student.major }}</td>
          <td class="border border-gray-300 p-2">{{ student.semester }}</td>
          <td class="border border-gray-300 p-2">{{ student.gpa.toFixed(2) }}</td>
          <td class="border border-gray-300 p-2 space-x-2">
            <button @click="viewEnrollments(student)" class="text-blue-600 underline">View Enrollments</button>
            <button @click="handleDeleteStudent(student.id)" class="text-red-600 underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Selected Student Enrollments Section -->
    <div v-if="activeStudent" class="border border-blue-300 p-4 bg-white">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-bold">Enrollments for {{ activeStudent.name }}</h2>
        <button @click="closeEnrollments" class="text-gray-500 hover:text-black text-xl leading-none">&times;</button>
      </div>

      <div v-if="enrollmentStore.error" class="bg-red-100 text-red-700 p-2 mb-4 border border-red-300">
        {{ enrollmentStore.error }}
      </div>

      <!-- Enroll Form -->
      <div class="flex gap-2 mb-4">
        <select v-model="enrollCourseId" class="border p-2 flex-1">
          <option value="" disabled>Select a course to enroll...</option>
          <option v-for="c in courseStore.courses" :key="c.id" :value="c.id">
            {{ c.code }} - {{ c.name }} ({{ c.credits }} SKS)
          </option>
        </select>
        <button @click="handleEnroll" :disabled="!enrollCourseId" class="bg-blue-600 text-white px-4 py-2 disabled:bg-gray-400">
          Enroll
        </button>
      </div>

      <div v-if="enrollmentStore.isLoading" class="text-gray-500 mb-4">Loading enrollments...</div>

      <!-- Enrollments Table -->
      <table v-else class="w-full border-collapse border border-gray-300 text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 p-2">Code</th>
            <th class="border border-gray-300 p-2">Course Name</th>
            <th class="border border-gray-300 p-2">Credits</th>
            <th class="border border-gray-300 p-2">Grade</th>
            <th class="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="enrollmentStore.enrollments.length === 0">
            <td colspan="5" class="border border-gray-300 p-4 text-center text-gray-500">Not enrolled in any courses.</td>
          </tr>
          <tr v-for="e in enrollmentStore.enrollments" :key="e.enrollment_id">
            <td class="border border-gray-300 p-2">{{ e.code }}</td>
            <td class="border border-gray-300 p-2">{{ e.course_name }}</td>
            <td class="border border-gray-300 p-2">{{ e.credits }} SKS</td>
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
