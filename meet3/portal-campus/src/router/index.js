import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import GradesPage from '@/pages/GradesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/nilai',
      name: 'grades',
      component: GradesPage,
    },
    {
      // Lazy-loaded: SchedulePage's code is only fetched when the user navigates here.
      path: '/jadwal',
      name: 'schedule',
      component: () => import('@/pages/SchedulePage.vue'),
    },
    {
      // Catch-all: any URL that doesn't match the above renders NotFoundPage.
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

export default router
