/**
 * 用于进行页面访问权限的拦截处理
 */
import router from './router'
import { ElMessage } from 'element-plus'
import useUserStore from './store/user'

// 白名单中的路由是不需要登录即可直接访问的页面
const whiteList = ['/login']

// 用户仓库
let userStore: any

/**
 * 在全局前置守卫中进行权限拦截处理
 */
router.beforeEach(async(
  to, 
  // from,
) => {
  // to: 即将进入的目标路由对象
  // from: 正在离开的当前路由对象
  // 本地用户token信息
  const token = localStorage.getItem('token')
  // 判断即将访问的页面是否在白名单中，如果不在
  // 则需要判断用户是否登录
  if (!whiteList.includes(to.path)) {
    // 判断用户是否登录，通常使用 token，即查看
    // 本地是否保存了登录成功的用户 token 信息
    if (!token) {
      // token 不存在，未登录，则跳转到登录页面
      ElMessage.error('请先登录!!!')
      return '/login'
    }
    // TODO::: 实际业务中，在有 token 的情况下，通常还需要将
    // token 发送到服务端进行认证校验，校验未通过，仍然去登录页面

    // 存在 token 说明已登录，由于在主页面中需要显示用户的头像、昵称等信息，
    // 所以需要查看用户基本信息是否已存在（用户基本信息保存在 store 中的），
    // 如果用户基本信息不存在，则发送网络请求查询用户数据并更新store中的状态数据
    if (!userStore) {
      userStore = useUserStore()
    }
    if (!userStore.userInfo) { // 没有用户基本信息，则查询处理
      try {
        // 查询数据，保存状态，并生成动态路由配置信息
        await userStore.update()
        // 将生成的动态路由配置信息添加到 router 中
        // 调用 router.addRoute() 动态添加路由信息
        const dynamicRoutes = userStore.dynamicRoutes
        dynamicRoutes.forEach((item: any) => {
          router.addRoute(item)
        })
        return '/'
      } catch (error) {
        ElMessage.error('管理员信息查询异常，请重新登录!')
        return '/login'
      }
    }
  } else {
    if (to.path === '/login' && token) {
      return '/'
    }
  }
})
