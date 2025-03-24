<template>
  <el-scrollbar style="height: calc(100vh - 60px);">
    <!-- 菜单 -->
    <el-menu router :default-openeds="openeds" :default-active="active">
      <menu-items :routes="menuRoutes" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MenuItems from './menu-items.vue'
// import routes from '@/router/routes'
import useUserStore from '@/store/user'
import { convertToTree } from '@/utils/convert'

// 当前激活的路由对象信息
const route = useRoute()
// 用户仓库
const userStore = useUserStore()

// 在侧边菜单中展开的子菜单项
const openeds = ref<string[]>([])
// 默认激活项
const active = ref<string>('')

// 监听 route 的变化，处理默认打开的子菜单与激活的菜单项
watch(
  () => route,
  (newRoute) => {
    // console.log('路由变化了...', newRoute)
    const tmp = newRoute.matched.map(item => item.path)
    active.value = tmp.pop() as string
    openeds.value = tmp
  },
  {
    immediate: true,
    deep: true,
  }
)

// // 需要动态渲染菜单使用到的路由数据
// const menuRoutes = computed(() => routes.slice(0, -1))

/**
 * 根据登录用户的角色权限，动态生成菜单数据
 */
const menuRoutes: any = computed(() => {
  // 从所有权限中筛选出 type 为 1 的权限，即菜单权限 （type 为2的是按钮功能权限）
  let menuPermissions: any = userStore.permissions?.filter(item => item.type === 1)
  // 将 menuPerssions 数组中的元素结构转换为类似路由配置的结构
  menuPermissions = menuPermissions?.map((item: Permission) => {
    return {
      ...item,
      path: item.rule, // 路由地址
      meta: {
        title: item.name,
        icon: item.icon,
      },
    }
  })
  console.log('menus:', menuPermissions);
  
  // 将扁平数据结构转树形结构
  const tree = convertToTree(menuPermissions)
  // 返回转换后的树
  return tree
})
</script>

<style lang="less" scoped>

</style>
