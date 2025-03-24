import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/session'
import { convertToTree } from '@/utils/convert'

// 使用 import.meta.glob() 函数，查找出所有的 views 文件夹下的 .vue 文件模块
const modules = import.meta.glob('@/views/**/*.vue')
console.log('modules:::', modules)


const useUserStore = defineStore('user', () => {
  // 用户基本信息
  const userInfo = ref<UserInfo>()
  // 用户角色
  const role = ref<Role>()
  // 用户权限
  const permissions = ref<Permission[]>()
  // 动态路由配置信息
  const dynamicRoutes = ref<any>()

  /**
   * 根据登录用户的角色权限，动态生成其所能访问到的路由配置信息
   */
  const generateDynamicRoutes = (permissions: Permission[]) => {
    // 从所有权限中筛选出 type 为 1 的权限，即菜单权限 （type 为2的是按钮功能权限）
    let menuPermissions: any = permissions?.filter(item => item.type === 1)
    // 将 menuPerssions 数组中的元素结构转换为类似路由配置的结构
    menuPermissions = menuPermissions?.map((item: Permission) => {
      return {
        ...item,
        path: item.rule, // 路由地址
        // compUrl: `/src/views${item.rule}.vue`,
        component: modules[`/src/views${item.rule}.vue`] ?? (() => import('@/layout/index.vue')),
        meta: {
          title: item.name,
          icon: item.icon,
        },
      }
    })
  
    // 将扁平数据结构转树形结构
    const routes = convertToTree(menuPermissions)
    // console.log('动态生成的路由信息:', routes)
    dynamicRoutes.value = routes
  }

  /**
   * 查询用户基本信息，更新状态数据
   */
  const update = async () => {
    try {
      // 查询用户基本信息
      const res = await getUserInfo()
      // console.log('用户信息:', res)
      // 将查询到的用户基本信息、角色等保存到状态数据中
      userInfo.value = res.userInfo
      role.value = res.roles[0]
      permissions.value = role.value?.permissions as Permission[]

      // 动态生成路由配置
      generateDynamicRoutes(permissions.value)
    } catch (error) {
      console.error('查询用户信息异常:', error)
      throw error
    }
  }

  /**
   * 重置用户基本信息
   */
  const reset = () => {
    userInfo.value = undefined
  }

  return {
    userInfo,
    role,
    permissions,
    dynamicRoutes,
    update,
    reset,
  }
})

export default useUserStore
