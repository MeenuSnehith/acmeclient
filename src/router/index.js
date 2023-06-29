import HomePage from '@/components/HomePage.vue'
import RegisterUser from '@/components/RegisterUser.vue'
import LoginUser from '@/components/LoginUser.vue'
import UpdateTrip from '@/components/UpdateTrip.vue'
import ViewTrip from '@/components/ViewTrip.vue'
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterUser
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUser
  },
  {
    path: '/updatetrip',
    name: 'updatetrip',
    component: UpdateTrip
  },
  {
    path: '/viewtrip',
    name: 'viewtrip',
    component: ViewTrip,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
