import request from '@/utils/request'

export const getBrands = ({page = 1, pageSize = 10}) => request({
  url: '/brands',
  params: {
    page,
    pageSize,
  }
})
