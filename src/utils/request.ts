import { ElMessage } from 'element-plus'
import router from '@/router'

// 二次封装 axios
import axios from 'axios'

// 区分开发环境与生产环境的 baseURL
// 'development' | 'production'
// const baseURL = import.meta.env.MODE === 'development' ? '/api' : 'https://www.fastmock.site/mock/a0f0c0e0b0d0e0f0c0a0b0c0d0e0f0c0/api'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 请求的基准地址，从 .env 文件中读取
  timeout: 10000, // 请求超时时间
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加用户认证相关的请求头 - token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 在请求发送之前做些什么
    return config
  },
  (error) => {
    // 对请求错误做些什么
    // 提醒用户token过期
    ElMessage.error('Token已过期，请重新登录')  // 使用 Element Plus 的提示组件
    // 清除本地存储中的token
    localStorage.removeItem('token')
    // 跳转到登录页面
    router.push('/login')
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    if (response.status >= 200 && response.status < 300) {
      // 请求成功，获取后端向前端响应返回的数据
      if (response.data.code === 200) {
        return response.data.data
      }
      return Promise.reject(response.data.message)
    }
    // 对响应数据做点什么
    return Promise.reject('请求异常:' + response.status)
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default service
