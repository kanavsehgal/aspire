import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import CardsPage from '@/views/CardsPage.vue'
import PaymentsPage from '@/views/PaymentsPage.vue'
import CreditPage from '@/views/CreditPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home', requiresAuth: false },
  },
  {
    path: '/cards',
    name: 'Cards',
    component: CardsPage,
    meta: { title: 'Cards', requiresAuth: false },
  },
  {
    path: '/payments',
    name: 'Payments',
    component: PaymentsPage,
    meta: { title: 'Payments', requiresAuth: false },
  },
  {
    path: '/credit',
    name: 'Credit',
    component: CreditPage,
    meta: { title: 'Credit', requiresAuth: false },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { title: 'Settings', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  console.log('Navigating from:', from.path, 'to:', to.path);
  document.title = (to.meta.title as string) || 'Aspire App'
  next()
})

export default router
