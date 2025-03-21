import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { // 路径别名
      '@': path.join(__dirname, 'src'), // 使用 @ 代表 src 目录的绝对路径
    }
  }
})
