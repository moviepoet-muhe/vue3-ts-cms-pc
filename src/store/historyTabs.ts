// history-tabs.vue 历史标签组件 仓库

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
    /*
      可以增加一个activeName,表示当前激活的 tab 项的名称， 
      在el-tabs标记通过双向绑定 v-model="historyTabsStore.activeName" 
      来实现历史tab标签激活与左侧菜单项绑定 
    */

    // activeName: '', 

    historyTabs: [
      {
        title: '工作台',
        path: '/workbench/index',
      },
      // {
      //   title: '仪表盘',
      //   path: '/workbench/dashboard',
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


      /* 
      可以增加一个activeName,表示当前激活的 tab 项的名称， 
      在el-tabs标记通过双向绑定 v-model="historyTabsStore.activeName" 
      来实现历史tab标签激活与左侧菜单项绑定  
      */

      // 修改当前激活项 tab 的名称状态数据
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
