import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/session'

const useUserStore = defineStore('user', () => {
  // 用户基本信息
  const userInfo = ref<UserInfo>()

  /**
   * 查询用户基本信息，更新状态数据
   */
  const update = async () => {
    try {
      const res = await getUserInfo()
      // console.log('用户信息:', res)
      userInfo.value = res.userInfo
    } catch (error) {
      console.error('查询用户信息异常:', error)
      throw error
    }
  }

  return {
    userInfo,
    update,
  }
})

export default useUserStore
