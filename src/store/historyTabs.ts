import { defineStore } from 'pinia'

export interface HistoryTabsState {
  title: string
  path: string
}

/**
 * 定义仓库，用于管理访问历史的状态数据
 */
const useHistoryTabsStore = defineStore('historyTabs', {
  state: () => ({
    // activeName: '', // 当前激活的 tab 项的名称
    historyTabs: [
      {
        title: '工作台',
        path: '/workbench/index',
      },
      // {
      //   title: '仪表盘',
      //   path: '/dashboard',
      // },
    ] as HistoryTabsState[], // 访问历史的tab
  }),
  actions: {
    /**
     * 添加访问历史的tab
     * @param tab 
     * @returns 
     */
    addHistoryTab(tab: HistoryTabsState) {
      // // 修改当前激活项 tab 的名称状态数据
      // this.activeName = tab.path
      // 先判断当前添加的访问历史是否已在状态数据中存在
      // 如果不存在，再向数组中添加访问历史
      const has = this.historyTabs.some((item) => item.path === tab.path)
      // const has = this.historyTabs.find(item => item.path === tab.path)
      if (has) {
        return
      }
      this.historyTabs.push(tab)
    },
    /**
     * 移除访问历史的tab
     * @param tab 
     * @returns 
     */
    removeHistoryTab(tab: string) {
      this.historyTabs = this.historyTabs.filter((item) => item.path !== tab)
    }
  }
})

export default useHistoryTabsStore
