import request from '@/utils/request'

/**
 * 查询所有角色信息
 * @returns 
 */
export const getAllRoles = () => request<any, { list: Role[] }>({
  url: '/roles'
})

/**
 * 添加角色
 */
export const addRole = (role: Partial<Role>) => request<any, Status>({
  url: '/roles',
  method: 'POST',
  data: role,
})

/**
 * 修改角色
 */
export const updateRole = (role: Partial<Role>) => request<any, Status>({
  url: '/roles/' + role.id,
  method: 'PUT',
  data: role,
})

/**
 * 删除角色
 */
export const removeRole = (id: string) => request<any, Status>({
  url: '/roles/' + id,
  method: 'DELETE',
})
