import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'


import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn'

import App from './App.vue'

import 'normalize.css'

import './permission'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.use(store)
// 注册所有 element-plus 的 icon 图标
// 以图标名称作为组件名使用
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
