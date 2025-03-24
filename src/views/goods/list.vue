<template>
  <div class="goods-list">
    商品管理

    <!-- 使用v-if来操控权限按钮显示 -->
    <!-- <div>
      <el-button type="primary" v-if="hasPermission('goods:add')">上架商品</el-button>
      <el-button type="danger" v-if="hasPermission('goods:off')">下架商品</el-button>

      <el-button type="warning" v-if="hasPermission('goods:update')">修改</el-button>
      <el-button type="success" v-if="hasPermission('goods:remove')">删除</el-button>
    </div> -->

    <!-- 自定义一个 v-permission 的指令，来实现按钮权限控制 -->
    <div>
      <el-button type="primary" v-permission="'goods:add'">上架商品</el-button>
      <el-button type="danger" v-permission="'goods:off'">下架商品</el-button>

      <el-button type="warning" v-permission="'goods:update'">修改</el-button>
      <el-button type="success" v-permission="'goods:remove'">删除</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/user'
import { computed } from 'vue'

const store = useUserStore()

/**
 * 判断登录用户是否具备按钮操控权限  使用v-if来操控按钮
 * @param rule 权限规则
 */

// const hasPermission = (rule: string) => {
//   // 筛选出登录用户所有权限中的 type 为 2 的按钮权限数据，
//   // 并将各按钮权限的规则字符串统一放置到数组中保存
//   const rules = store.permissions?.filter(item => item.type === 2).map(item => item.rule)
//   // 判断当前函数传递的 rule 参数是否在 rules 数组中
//   return rules?.includes(rule)
// }

/**
 * 计算登录用户具备的所有按钮操作权限规则
 */
const rules = computed(() => {
  // 从所有权限中筛选出 type 为 2 的权限，即按钮权限
  return store.permissions?.filter(item => item.type === 2).map(item => item.rule)
})
/**
 * 自定义一个 v-permission 的指令，来实现按钮权限控制
 */
const vPermission = {
  mounted(el: any, binding: any) {
    // 当前绑定的指令值
    const rule = binding.value
    // 判断是否具备权限
    const has = rules.value?.includes(rule)
    // 如果不具备权限，则删除该元素(DOM操作)
    if (!has) {
      el.parentNode.removeChild(el)
      // el.remove()
    }
  },
}
</script>

<style lang="less" scoped></style>
