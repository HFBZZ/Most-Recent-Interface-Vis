import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
//import Home from '../views/Home.vue'
//import Home from '../views/With API test4.vue'
//import Home from '../views/MostRecentTest1.vue'
import Home from '../views/IntegratedTest2.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
