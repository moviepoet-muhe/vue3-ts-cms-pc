<template>
  <!-- 页面整体的布局容器 -->
  <el-container class="site-layout">
    <!-- 左侧导航栏 -->
    <el-aside width="200px">
      <AsideMenu />
    </el-aside>

    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <!-- 下拉菜单 -->
          <el-dropdown>
            <el-image style="width: 32px; height: 32px" :src="'http://113.45.10.129:5945' + store.userInfo?.avatarUrl" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ store.userInfo?.nickname }}</span>
        </div>
      </el-header>

      <!-- 主体内容区域 -->
      <el-main>
        <!-- 访问历史标签 -->
        <HistoryTabs />
        <!-- 主体内容 -->
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AsideMenu from './components/aside-menu.vue'
import HistoryTabs from './components/history-tabs.vue'
import useUserStore from '@/store/user'

const store = useUserStore()
</script>

<style scoped>
.site-layout {
  height: 100vh;
}
.site-layout .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.site-layout .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.site-layout .el-menu {
  border-right: none;
}
.site-layout .el-main {
  padding: 12px;
}
.site-layout .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
