/**
 * 用户会话相关接口服务
 */
import request from '@/utils/request'

/**
 * 用户登录
 */
export const userLogin = (user: LoginUser) => request<any, LoginRes>({
  url: '/sessions',
  method: 'POST',
  data: user,
})

/**
 * 退出登录
 */
export const logout = () => request<any, Status>({
  url: '/sessions',
  method: 'DELETE',
})

/**
 * 查询登录用户的用户信息
 */
export const getUserInfo = () => request<any, BaseUserInfoRes>({
  url: '/sessions/userinfo'
})
