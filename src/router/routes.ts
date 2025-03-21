import type { RouteRecordRaw } from 'vue-router'

// 页面整体布局组件
const SiteLayout = () => import('@/layout/index.vue')

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: SiteLayout,
    redirect: '/workbench',
    children: [ // 嵌套路由
      {
        path: '/workbench',
        name: 'workbench',
        component: () => import('@/views/workbench/index.vue'),
        meta: {
          title: '工作台',
        },
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/workbench/dashboard.vue'),
        meta: {
          title: '仪表盘',
        },
      },
    ],
    meta: {
      title: '概览',
      icon: 'Odometer',
    },
  },

  {
    path: '/goods',
    name: 'goods',
    component: SiteLayout,
    meta: {
      title: '商品',
      icon: 'Goods',
    },
    children: [
      {
        path: '/goods/list',
        name: 'goodsList',
        component: () => import('@/views/goods/list.vue'),
        meta: {
          title: '商品管理',
        },
      },
      {
        path: '/goods/category',
        name: 'goodsCategory',
        component: () => import('@/views/goods/category.vue'),
        meta: {
          title: '分类管理',
        },
      },
      {
        path: '/goods/brand',
        name: 'goodsBrand',
        component: () => import('@/views/goods/brand.vue'),
        meta: {
          title: '品牌管理',
        },
      },
    ],
  },

  {
    path: '/setting',
    name: 'setting',
    component: SiteLayout,
    meta: {
      title: '设置',
      icon: 'Setting',
    },
    children: [
      {
        path: '/setting/rbac',
        name: 'settingRBAC',
        component: () => import('@/views/setting/rbac/index.vue'),
        meta: {
          title: '权限管理',
        },
        children: [
          {
            path: '/setting/rbac/role',
            name: 'settingRBACRole',
            component: () => import('@/views/setting/rbac/role.vue'),
            meta: {
              title: '角色管理',
            },
          },
          {
            path: '/setting/rbac/administrator',
            name: 'settingRBACUser',
            component: () => import('@/views/setting/rbac/administrator.vue'),
            meta: {
              title: '管理员',
            },
          },
          {
            path: '/setting/rbac/permission',
            name: 'settingRBACPermission',
            component: () => import('@/views/setting/rbac/permission.vue'),
            meta: {
              title: '菜单权限',
            },
          },
        ],
      },
      {
        path: '/setting/system',
        name: 'settingSystem',
        component: () => import('@/views/setting/system.vue'),
        meta: {
          title: '系统设置',
        },
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
]

export default routes
