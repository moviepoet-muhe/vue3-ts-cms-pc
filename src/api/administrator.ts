import request from '@/utils/request'

/**
 *  查询所有管理员信息
 * @returns 
 */
export const getAllAdministrators = ({ page = 1, pageSize = 10 }) => request({
  url: '/administrators',
  params: {
    page,
    pageSize,
  }
})

/**
 * 添加管理员
 */
export const addAdministrator = (admin: Partial<Administrator>) => request<any, Status>({
  url: '/administrators',
  method: 'POST',
  data: admin,
})

/**
 * 修改管理员
 */
export const updateAdministrator = (admin: Partial<Administrator>) => request<any, Status>({
  url: '/administrators/' + admin.id,
  method: 'PUT',
  data: admin,
})

/**
 * 删除管理员
 */
export const removeAdministrator = (id: string) => request<any, Status>({
  url: '/administrators/' + id,
  method: 'DELETE',
})
