<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-2xl">🏺</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-white">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="mt-2 text-sm text-gray-400">
          {{ $t('auth.login.subtitle') }}
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Username/Email -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.login.username') }}
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              :placeholder="$t('auth.login.usernamePlaceholder')"
              :disabled="loading"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.login.password') }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                :placeholder="$t('auth.login.passwordPlaceholder')"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                :disabled="loading"
              >
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-red-400">⚠️</span>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-200">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('auth.login.loggingIn') }}
            </span>
            <span v-else>{{ $t('auth.login.loginButton') }}</span>
          </button>
        </div>

        <!-- Language Toggle -->
        <div class="text-center">
          <button
            @click="toggleLanguage"
            class="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {{ $t('auth.languageToggle') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n()

// Form data
const form = reactive({
  username: '',
  password: ''
})

// UI state
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Computed
const { isAuthenticated } = authStore

// Methods
const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login({
      username: form.username.trim(),
      password: form.password
    })

    if (result.success) {
      // Check for redirect parameter
      const redirectPath = router.currentRoute.value.query.redirect as string
      
      if (redirectPath) {
        // Redirect to the originally requested page
        router.push(redirectPath)
      } else {
        // Redirect based on user role
        if (authStore.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } else {
      error.value = result.message || '登录失败'
    }
  } catch (err) {
    error.value = '登录时发生错误'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

// Check if already authenticated
onMounted(() => {
  if (isAuthenticated) {
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }
})
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>
