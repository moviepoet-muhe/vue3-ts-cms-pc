import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import useHistoryTabsStore, { type HistoryTabsState } from '@/store/historyTabs'

const router = createRouter({
  history: createWebHistory(), // 路由模式
  routes, // 路由表
})

// 历史 tabs 的仓库
let historyTabsStore: any

const whiteList = ['/login', '/']

// 全局前置守卫
router.beforeEach((
  to,
) => {
  // to : 即将进入的路由对象
  // from : 即将离开的路由对象
  // 如果历史 tabs 的仓库不存在数据
  if (!historyTabsStore) {

    historyTabsStore = useHistoryTabsStore()
  }

  if (!whiteList.includes(to.path)) {
    const currHistory: HistoryTabsState = {
      title: to.meta?.title as string,
      path: to.path,
    }
    // 向历史记录中添加当前历史标签
    historyTabsStore.addHistoryTab(currHistory)
  }
})

export default router
