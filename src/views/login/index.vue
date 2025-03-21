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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { type FormInstance } from 'element-plus'
import { login } from '@/api/session'
import { ElMessage } from 'element-plus'

// 路由对象
const router = useRouter()

// 绑定表单组件实例
const loginFormRef = ref<FormInstance>()

// 表单绑定的用户登录数据
const user = ref<LoginUser>({
  username: 'admin1',
  password: 'admin',
  remember: true,
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '用户名必填!', trigger: 'blur'},
  ],
  password: [
    { required: true, message: '密码必填!', trigger: 'blur'},
    // { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
  ],
}

/**
 * 点击登录按钮，处理登录逻辑
 */
const handleLogin = async() => {
  try {
    // 调用表单组件实例暴露的 validate() 方法进行表单校验
    const result = await loginFormRef.value?.validate()
    if (result) {
      // 校验通过，发送网络请求，进行用户登录处理
      const res = await login(user.value)
      console.log('登录结果:', res);
      // 判断登录成功与失败
      if (res.status === 200) {
        // 登录成功，需要将登录用户的 token 保存到本地，然后跳转到主页面
        localStorage.setItem('token', res.token as string)
        router.push('/')
      } else {
        // 登录失败，全局错误提示
        ElMessage.error(res.message)
      }
    }
  } catch (error) {
    console.error('登录异常:', error)
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
