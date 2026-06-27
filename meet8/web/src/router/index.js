import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/students',
    },
    {
      path: '/students',
      name: 'students',
      // Lazy-loading: the component is only downloaded when the user navigates here.
      // This keeps the initial page load fast.
      component: () => import('@/views/StudentsView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/views/CoursesView.vue'),
    },
  ],
});

export default router;
