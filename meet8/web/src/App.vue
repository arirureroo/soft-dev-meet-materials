<script setup>
</script>

<template>
  <div>
    <!-- Navigation Bar -->
    <header class="border-b border-gray-300 p-4 mb-6 flex justify-between items-center">
      <div class="font-bold text-xl">Campus Portal</div>
      <nav class="flex gap-4">
        <RouterLink to="/students" class="text-blue-600 hover:underline">Students</RouterLink>
        <RouterLink to="/courses" class="text-blue-600 hover:underline">Courses</RouterLink>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-4xl mx-auto px-4">
      <RouterView />
    </main>
  </div>
</template>
