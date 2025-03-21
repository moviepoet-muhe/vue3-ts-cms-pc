<template>
  <div class="history-tabs">
    <!-- 标签容器 -->
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-change="handleTabChange"
      @tab-remove="handleTabRemove"
    >
      <!-- 标签项 -->
      <el-tab-pane
        v-for="(item, index) in store.historyTabs"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="index !== 0"
      >
        <!-- 标签页面内容 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useHistoryTabsStore from '@/store/historyTabs'

// 获取路由对象
const router = useRouter()
// 当前激活的路由对象信息
const route = useRoute()

// 获取保存访问历史的 store
const store = useHistoryTabsStore()

// 绑定 tab 选中标签名称
const editableTabsValue = ref('')

// 监听路由变化，更新当前激活的标签页
watch(
  () => route.path,
  (
    newRoute, 
    // oldRoute,
  ) => {
    // console.log('路由变化了', oldRoute, ' -> ', newRoute)
    editableTabsValue.value = newRoute
  },
  {
    immediate: true
  }
)

/**
 * 处理标签页切换时的路由跳转
 * @param tabPath 标签页的路由路径
 */
const handleTabChange = (tabPath: string) => {
  // console.log('标签页切换了', tabPath)
  // 跳转到对应路由
  router.push(tabPath)
}

/**
 * 处理标签页删除时的逻辑
 * @param tabPath 标签页的路由路径
 */
const handleTabRemove = (tabPath: string) => {
  // console.log('标签页删除了', tabPath)
  // 当前删除项是否为激活项
  if (tabPath === editableTabsValue.value) {
    // 如果是，则向后或向前切换一个标签页面
    // 获取当前删除的是否为数组中最后一项
    const index = store.historyTabs.findIndex(item => item.path === tabPath)
    if (index === store.historyTabs.length - 1) { // 是最后一项，则向前切换
      editableTabsValue.value = store.historyTabs[index - 1].path
    } else { // 不是最后一项，则向后切换
      editableTabsValue.value = store.historyTabs[index + 1].path
    }
    router.push(editableTabsValue.value)
  }
  
  // 删除对应的历史记录
  store.removeHistoryTab(tabPath)
}
</script>

<style lang="less" scoped>
.history-tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
