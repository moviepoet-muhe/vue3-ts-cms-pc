<!-- 左侧操作菜单栏 -->
<template>
  <el-scrollbar style="height: calc(100vh - 60px);">
    <!-- 菜单项  -->
    <!-- default-active 页面加载时默认激活菜单的 index -->
    <!-- default-openeds 默认打开的 sub-menu 的 index 的数组 -->
    <!-- router 是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 使用 default-active 来设置加载时的激活项。 -->
    <el-menu router :default-openeds="openeds" :default-active="active">
      <!-- 子菜单项由 menu-items 组件提供 通过一个路由配置数组动态生成路由 -->
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
    // 从新路由的 matched 属性中提取出路径信息，并将其存储到 openeds 数组中
    const tmp = newRoute.matched.map(item => item.path)
    // 将最后一个元素从 tmp 数组中弹出，并将其赋值给 active 变量,使其有激活项
    active.value = tmp.pop() as string
    // 将 tmp 数组赋值给 openeds 变量
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
  // 将 menuPermissions 数组中的元素结构转换为类似路由配置的结构
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
  // 将扁平数据结构转树形结构
  const tree = convertToTree(menuPermissions)
  // 返回转换后的树
  return tree
})
</script>

<style lang="less" scoped></style>
