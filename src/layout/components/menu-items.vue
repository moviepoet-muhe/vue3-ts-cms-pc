<template>
  <template v-for="route in routes" :key="route.path">
    <!-- 当前遍历到的 route 路由如果有 children 属性，则使用 sub-menu 组件渲染一级子菜单 -->
    <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
      <template #title>
        <el-icon>
          <!-- 动态组件，is 属性用于表示当前组件的名称，这里表示动态组件的名称为 route.meta?.icon -->
          <component :is="route.meta?.icon || 'Message'" />
          <!-- <component :is="resolveComponent(route.meta?.icon as string ?? 'Message')" /> -->
        </el-icon>
        <span>{{ route.meta?.title ?? '默认标题' }}</span>
      </template>

      <!-- 当前menu-items组件自身的递归调用二级子渲染 -->
      <menu-items :routes="route.children" />
    </el-sub-menu>

    <!-- 没有 children 属性的话，直接使用 menu-item 组件渲染一级菜单项 -->
    <el-menu-item v-else :index="route.path">
      <el-icon>
        <component :is="route.meta?.icon || 'Message'" />
      </el-icon>
      <span>{{ route.meta?.title ?? '默认标题' }}</span>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
// 接受aside-menu组件中路由数组
defineProps<{
  routes: RouteRecordRaw[]
}>()
</script>

<style lang="less" scoped></style>
