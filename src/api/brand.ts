import request from '@/utils/request'

//  获取品牌列表
export const getBrands = ({ page = 1, pageSize = 10 }) => request({
  url: '/brands',
  params: {
    page,
    pageSize,
  }
})
