# 电商后台管理系统

[![Vue3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9-409eff)](https://element-plus.org/)

示例演示: [https://www.likeshop.cn/product_demo_center](https://www.likeshop.cn/product_demo_center)  
后端接口文档: [http://113.45.10.129:5945/swagger](http://113.45.10.129:5945/swagger)

## 项目亮点 ✨

- 基于 Vue3 + TypeScript 的现代化前端架构
- 动态路由权限控制（菜单/按钮级）
- 模块化状态管理（Pinia）
- 企业级 Axios 二次封装
- 可视化图表集成（ECharts）
- 响应式布局与主题定制

## 技术栈 🛠️

| 技术            | 说明                  | 版本   |
|-----------------|----------------------|--------|
| Vue3            | 前端框架             | 3.5    |
| TypeScript      | 类型系统             | 4.9+   |
| Element Plus    | UI组件库             | 2.9    |
| Pinia           | 状态管理             | 2.0    |
| Vue Router      | 路由管理             | 4.0    |
| Axios           | HTTP客户端           | 1.8    |
| ECharts         | 数据可视化           | 5.4    |
| Vite            | 构建工具             | 4.0    |

## 功能模块 🚀

### 系统功能
- **权限管理**  
  - 基于角色的访问控制（RBAC）
  - 动态菜单生成
  - 按钮级权限控制（v-permission指令）
  
- **商品管理**  
  - 商品上下架管理
  - 分类/品牌管理
  - 库存监控

- **系统设置**  
  - 角色权限配置
  - 管理员账户管理
  - 系统参数配置

### 特色功能
```typescript
// 动态路由生成示例（基于权限数据）
const generateDynamicRoutes = (permissions: Permission[]) => {
  const menuRoutes = permissions
    .filter(item => item.type === 1)
    .map(item => ({
      path: item.rule,
      component: dynamicImport(item.rule),
      meta: { title: item.name, icon: item.icon }
    }));
  return convertToTree(menuPermissions);
}

```bash


├── public              # 静态资源
├── src
│   ├── api             # 接口模块
│   ├── assets          # 静态资源
│   ├── components      # 公共组件
│   ├── layout          # 全局布局
│   ├── router          # 路由配置
│   ├── store           # 状态管理（Pinia）
│   ├── utils           # 工具函数
│   ├── views           # 页面组件
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .env.development    # 开发环境配置
├── .env.production     # 生产环境配置
└── vite.config.ts      # Vite配置

# .env.development
VITE_BASE_URL = http://113.45.10.129:5945/api/v1/admin
VITE_UPLOAD_URL = http://113.45.10.129:5945/api/v1/admin/files

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build