<template>
  <!-- 页面整体的布局容器 -->
  <el-container class="site-layout">
    <!-- 左侧导航栏 -->
    <el-aside width="200px">
      <div class="logo">
        <el-image src="/logo.png" style="width: 48px; height: 48px" />
        <span>天天优选</span>
      </div>
      <!-- 左侧菜单 -->
      <AsideMenu />
    </el-aside>

    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <!-- 下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <el-image style="width: 32px; height: 32px" :src="store.userInfo?.avatarUrl" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 显示用户信息 -->
          <span>{{ store.userInfo?.nickname }}({{ store.role?.name }})</span>
        </div>
      </el-header>

      <!-- 主体内容区域 -->
      <el-main>
        <!-- 访问历史组件 -->
        <HistoryTabs />
        <!-- 主体内容 路由出口-->
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { logout } from '@/api/session'
import AsideMenu from './components/aside-menu.vue'
import HistoryTabs from './components/history-tabs.vue'
import useUserStore from '@/store/user'

const router = useRouter()
const store = useUserStore()

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    // 发送请求，退出登录
    await logout()
    // 清除本地存储的 token
    localStorage.removeItem('token')
    // localStorage.clear()
    // 清理 store 中保存的用户信息
    store.reset()
    // 跳转到登录页面
    router.push('/login')
  }
}
</script>

<style scoped>
.site-layout {
  height: 100vh;

  .logo {
    height: 60px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
