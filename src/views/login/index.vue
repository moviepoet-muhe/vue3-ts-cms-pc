<template>
  <div class="login-container">
    <div class="login">
      <div class="header">用户登录</div>
      <!-- 用户登录表单 -->
      <el-form :model="user" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="user.username" prefix-icon="Iphone" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="user.password" prefix-icon="Lock" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="user.remember">
            记住用户
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type FormInstance } from 'element-plus'
import { userLogin } from '@/api/session'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

// 用于加解密处理的密钥
const secret = '13497kadslfjlkqweruoj2134kjlkfdj'

// 路由对象
const router = useRouter()

// 绑定表单组件实例
const loginFormRef = ref<FormInstance>()

// 表单绑定的用户登录数据
const user = ref<LoginUser>({
  username: '',
  password: '',
  remember: true,
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '用户名必填!', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码必填!', trigger: 'blur' },

    // {
    //   pattern: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
    //   message: '密码必须包含大小写字母',
    //   trigger: 'blur'
    // },
    // { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
  ],
}

/**
 * 挂载后，将本地保存的用户名与密码回显到表单中
 */
onMounted(() => {
  // 获取本地存储的用户名与密码密文数据
  const str = localStorage.getItem('user')
  if (str) {
    // 将密文解密
    var origin = CryptoJS.AES.decrypt(str, secret).toString(CryptoJS.enc.Utf8)
    // 还原用户名与密码
    const [username, password] = origin.split('::::')
    // 将用户名与密码回显到表单中
    user.value = {
      username,
      password,
      remember: true,
    }
  }
})

/**
 * 点击登录按钮，处理登录逻辑
 */
const handleLogin = async () => {
  try {
    // 调用表单组件实例暴露的 validate() 方法进行表单校验
    const result = await loginFormRef.value?.validate()
    if (result) {
      // 校验通过，发送网络请求，进行用户登录处理
      const res = await userLogin(user.value)
      // 判断登录成功与失败
      if (res.status === 200) {
        // 登录成功，需要将登录用户的 token 保存到本地
        localStorage.setItem('token', res.token as string)
        // 如果有勾选记住用户，则将用户名与密码加密后保存到本地
        if (user.value.remember) {
          // 将用户名与密码拼接后加密
          const encryptStr = CryptoJS.AES.encrypt(user.value.username + '::::' + user.value.password, secret).toString()
          // 将加密后数据保存到本地
          localStorage.setItem('user', encryptStr)
        } else {
          // 将本地保存的加密用户数据删除
          localStorage.removeItem('user')
        }
        // 跳转到主页面
        router.push('/')
      } else {
        // 登录失败，全局错误提示
        ElMessage.error(res.message)
      }
    }
  } catch (error) {
    ElMessage.error('表单校验失败，登录失败')
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;

  .login {
    width: 300px;
    height: 300px;
    margin: auto;
    border: 1px solid;
    padding: 24px;

    .header {
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
