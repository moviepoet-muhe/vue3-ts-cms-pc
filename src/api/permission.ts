/**
 * 菜单管理API
 */
import request from '@/utils/request'

/**
 * 查询所有菜单权限数据
 */
export const getAllPermissions = () => request<any, {list: Permission[]}>({
  url: '/permissions',
})

/**
 * 添加新菜单权限
 */
export const addPermission = (permission: Partial<Permission>) => request<any, Status>({
  url: '/permissions',
  method: 'POST',
  data: permission, // 是在请求主体中传递给服务端
})

/**
 * 修改菜单权限
 */
export const updatePermission = (permission: Permission) => request<any, Status>({
  url: '/permissions/' + permission.id, // 将需要修改权限的 id 作为路径参数拼接在 url 后传递
  method: 'PUT',
  data: permission, // 将需要修改权限的具体信息通过请求主体发送给后端
})

/**
 * 删除菜单权限
 */
export const removePermission = (id: string) => request<any, Status>({
  url: '/permissions/' + id,
  method: 'DELETE',
})
