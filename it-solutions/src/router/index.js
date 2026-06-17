import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TechBookmarks from '../views/TechBookmarks.vue'
import TechGenerator from '../views/TechGenerator.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tech',
      name: 'tech-bookmarks',
      component: TechBookmarks
    },
    {
      path: '/tech/:tag',
      name: 'tech-generator',
      component: TechGenerator
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
