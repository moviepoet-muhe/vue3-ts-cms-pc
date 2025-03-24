// 导入 Vue 核心功能
import { createApp } from 'vue'

// 路由配置
import router from '@/router'

// 状态管理
import store from '@/store'

// Element Plus 组件库及图标
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// Element Plus 样式
import 'element-plus/dist/index.css'

// 日期本地化配置
import 'dayjs/locale/zh-cn'

// 根组件
import App from './App.vue'

// 标准化样式
import 'normalize.css'

// 路由权限控制
import './permission'

// 创建 Vue 应用实例
const app = createApp(App)

// 配置 Element Plus 使用中文
app.use(ElementPlus, {
  locale: zhCn,
})

// 挂载路由系统
app.use(router)

// 挂载状态管理
app.use(store)

// 注册所有 element-plus 的 icon 图标（原有注释保留）
// 以图标名称作为组件名使用（原有注释保留）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用到 DOM
app.mount('#app')
