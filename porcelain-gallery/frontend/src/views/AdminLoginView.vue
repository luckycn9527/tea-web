<template>
  <div class="admin-login-container">
    <div class="admin-login-box">
      <!-- Logo和标题 -->
      <div class="admin-login-header">
        <div class="admin-logo">
          <span class="logo-icon">∞</span>
          <h1>PORCELAIN GALLERY</h1>
          <p>管理后台</p>
        </div>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="admin-login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="请输入用户名"
            class="form-input"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="请输入密码"
              class="form-input"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 错误消息 -->
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="login-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 返回前端链接 -->
      <div class="back-to-frontend">
        <a href="/" class="back-link">
          ← 返回前端页面
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const form = ref({
  username: 'admin',
  password: '123456'
})

// 状态
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// 计算属性
const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password.trim()
})

// 登录处理
async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    // 强制使用正确的 API URL
    const apiUrl = 'http://106.75.68.99:3000/api/admin-auth/login'
    console.log('Attempting login to:', apiUrl)
    console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    const data = await response.json()

    if (data.success && data.data) {
      // 保存认证信息
      localStorage.setItem('admin_token', data.data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.data.user))
      
      // 检查是否为管理员
      if (data.data.user.role === 'admin') {
        // 跳转到产品管理页面
        router.push('/admin/products')
      } else {
        error.value = '权限不足，只有管理员可以访问后台'
      }
    } else {
      error.value = data.message || '登录失败'
    }
  } catch (err) {
    error.value = '网络错误，请检查连接'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.admin-login-box {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.admin-login-header {
  text-align: center;
  margin-bottom: 40px;
}

.admin-logo {
  color: white;
}

.logo-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #666, #333);
  border-radius: 50%;
  line-height: 60px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.admin-logo h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
}

.admin-logo p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.admin-login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #666;
  background: rgba(255, 255, 255, 0.08);
}

.form-input::placeholder {
  color: #666;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  flex: 1;
  padding-right: 40px; /* 为密码可见性按钮留出空间 */
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.password-toggle:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 14px;
}

.error-icon {
  font-size: 16px;
}

.login-button {
  padding: 14px 20px;
  background: linear-gradient(135deg, #333, #555);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #444, #666);
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-to-frontend {
  text-align: center;
  margin-top: 30px;
}

.back-link {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: white;
}
</style>
