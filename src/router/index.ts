import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/0214.vue'
import Page2 from '../views/0214p2.vue'
// import Home from '../views/0215.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/page2',
    name: 'page2',
    component: Page2
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
