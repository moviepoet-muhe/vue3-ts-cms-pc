// 类型声明文件

/**
 * 登录用户
 */
interface LoginUser {
  username: string
  password: string
  remember?: boolean
}

/**
 * 登录结果
 */
interface LoginRes {
  status: number
  message: string
  token?: string
}

/**
 * 用户基本信息
 */
interface UserInfo {
  id: string
  username: string
  nickname: string
  avatarUrl: string
  phone: string
  status: boolean
}

/**
 * 用户信息响应
 */
interface BaseUserInfoRes {
  userInfo: UserInfo
  status: number
  roles: Role[]
}

/**
 * 菜单权限
 * 树形结构的数据，通常是通过各项数据之间的 id 与 pid 关联关系来建立
 */
interface Permission {
  id: string // 编号
  pid: string // 父级编号(或 parentId)
  name: string // 权限名称
  type: number // 类型 1:菜单(页面级权限) 2:功能(按钮级权限)
  rule: string // 规则
  icon: string // 图标
  order: number // 排序
  status: boolean // 状态
}

interface Status {
  status: number
  message: string
  [key: string]: any
}

/**
 * 角色
 */
interface Role {
  id: string
  name: string
  description: string
  status: boolean
  permissions: (string | Permission)[]
}

/**
 * 管理员
 */
interface Administrator {
  id: string
  username: string
  password: string
  nickname: string
  phone: string
  avatarUrl: string
  roles: string[]
  status: boolean
}