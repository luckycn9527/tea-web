<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <span class="text-2xl">🏺</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-white">
          {{ $t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-sm text-gray-400">
          {{ $t('auth.register.subtitle') }}
        </p>
      </div>

      <!-- Register Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.register.username') }}
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :placeholder="$t('auth.register.usernamePlaceholder')"
              :disabled="loading"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.register.email') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :placeholder="$t('auth.register.emailPlaceholder')"
              :disabled="loading"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.register.password') }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors pr-12"
                :placeholder="$t('auth.register.passwordPlaceholder')"
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

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('auth.register.confirmPassword') }}
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors pr-12"
                :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                :disabled="loading"
              >
                <span v-if="showConfirmPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <!-- Password Strength Indicator -->
          <div v-if="form.password" class="space-y-2">
            <div class="text-xs text-gray-400">{{ $t('auth.register.passwordStrength') }}</div>
            <div class="flex space-x-1">
              <div 
                v-for="i in 4" 
                :key="i"
                :class="[
                  'h-1 flex-1 rounded',
                  i <= passwordStrength ? 'bg-green-500' : 'bg-gray-600'
                ]"
              ></div>
            </div>
            <div class="text-xs" :class="passwordStrengthText.color">
              {{ passwordStrengthText.text }}
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
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('auth.register.registering') }}
            </span>
            <span v-else>{{ $t('auth.register.registerButton') }}</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-400">
            {{ $t('auth.register.hasAccount') }}
            <router-link
              to="/login"
              class="font-medium text-green-400 hover:text-green-300 transition-colors"
            >
              {{ $t('auth.register.loginLink') }}
            </router-link>
          </p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n()

// Form data
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// UI state
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed
const { isAuthenticated } = authStore

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return { text: '', color: '' }
  if (strength === 1) return { text: 'Very Weak', color: 'text-red-400' }
  if (strength === 2) return { text: 'Weak', color: 'text-orange-400' }
  if (strength === 3) return { text: 'Good', color: 'text-yellow-400' }
  if (strength === 4) return { text: 'Strong', color: 'text-green-400' }
  return { text: '', color: '' }
})

const isFormValid = computed(() => {
  return form.username.trim() && 
         form.email.trim() && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         passwordStrength.value >= 2
})

// Methods
const handleRegister = async () => {
  if (loading.value || !isFormValid.value) return
  
  // Validate password match
  if (form.password !== form.confirmPassword) {
    error.value = '密码不匹配'
    return
  }
  
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password
    })

    if (result.success) {
      // Redirect based on user role
      if (authStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      error.value = result.message || '注册失败'
    }
  } catch (err) {
    error.value = '注册时发生错误'
    console.error('Registration error:', err)
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
