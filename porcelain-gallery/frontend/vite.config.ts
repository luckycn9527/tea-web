import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',  // 设置基础路径为根路径
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "106.75.68.99",     // ✅ 允许当前服务器IP
      ".ngrok-free.app",   // ✅ 允许所有 ngrok 子域名
      "zaopic.cn",         // ✅ 允许您的域名
      "www.zaopic.cn",     // ✅ 允许www子域名
      "all"                // ✅ 允许所有主机（开发环境）
    ],
    cors: true,            // ✅ 启用CORS支持
    strictPort: false      // ✅ 允许端口自动调整
  }
})
