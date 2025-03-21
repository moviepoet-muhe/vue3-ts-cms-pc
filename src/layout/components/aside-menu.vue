<template>
  <el-scrollbar>
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
import routes from '@/router/routes'

// 当前激活的路由对象信息
const route = useRoute()

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

// 需要动态渲染菜单使用到的路由数据
const menuRoutes = computed(() => routes.slice(0, -1))

</script>

<style lang="less" scoped></style>
