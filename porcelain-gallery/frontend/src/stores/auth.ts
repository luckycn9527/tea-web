import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  // Initialize from localStorage
  function initializeAuth() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        console.log('Auth initialized from localStorage:', user.value?.username)
      } catch (error) {
        console.error('Error parsing saved auth data:', error)
        clearAuth()
      }
    }
  }

  // Save to localStorage
  function saveAuth(userData: User, authToken: string) {
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    token.value = authToken
    user.value = userData
  }

  // Clear auth data
  function clearAuth() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    token.value = null
    user.value = null
    error.value = null
  }

  // Login
  async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        saveAuth(data.data.user, data.data.token)
        console.log('Login successful:', data.data.user.username)
        return data
      } else {
        error.value = data.message || '登录失败'
        return data
      }
    } catch (err) {
      const errorMessage = '网络错误，请检查连接'
      error.value = errorMessage
      console.error('Login error:', err)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  // Register
  async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        saveAuth(data.data.user, data.data.token)
        console.log('Registration successful:', data.data.user.username)
        return data
      } else {
        error.value = data.message || '注册失败'
        return data
      }
    } catch (err) {
      const errorMessage = '网络错误，请检查连接'
      error.value = errorMessage
      console.error('Registration error:', err)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      loading.value = false
    }
  }

  // Logout
  function logout() {
    clearAuth()
    console.log('User logged out')
  }

  // Verify token
  async function verifyToken(): Promise<boolean> {
    if (!token.value) {
      return false
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      const data = await response.json()

      if (data.success && data.data) {
        user.value = data.data.user
        localStorage.setItem('auth_user', JSON.stringify(data.data.user))
        return true
      } else {
        clearAuth()
        return false
      }
    } catch (err) {
      console.error('Token verification error:', err)
      clearAuth()
      return false
    }
  }

  // Refresh token
  async function refreshToken(): Promise<boolean> {
    if (!token.value) {
      return false
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        saveAuth(data.data.user, data.data.token)
        return true
      } else {
        clearAuth()
        return false
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      clearAuth()
      return false
    }
  }

  // Get auth headers for API requests
  function getAuthHeaders(): Record<string, string> {
    if (!token.value) {
      return {}
    }
    return {
      'Authorization': `Bearer ${token.value}`,
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    verifyToken,
    refreshToken,
    getAuthHeaders,
    clearAuth
  }
})
