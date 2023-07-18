import HomePage from '@/components/HomePage.vue'
import RegisterUser from '@/components/RegisterUser.vue'
import LoginUser from '@/components/LoginUser.vue'
import UpdateDelivery from '@/components/UpdateDelivery.vue'
import ViewDelivery from '@/components/ViewDelivery.vue'
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
  //f
  {
    path: '/login',
    name: 'login',
    component: LoginUser
  },
  {
    path: '/updatedelivery',
    name: 'updatedelivery',
    component: UpdateDelivery
  },
  {
    path: '/viewdelivery',
    name: 'viewdelivery',
    component: ViewDelivery,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
