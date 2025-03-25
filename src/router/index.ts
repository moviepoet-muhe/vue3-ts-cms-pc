import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
const router = createRouter({
  history: createWebHistory(), // 路由模式
  routes, // 路由表
})
export default router
