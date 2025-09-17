<template>
  <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200" @click="handleBackdropClick">
    <div 
      class="bg-gray-800/90 backdrop-blur-xl border border-gray-700/60 rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all duration-200 ease-out"
      :class="showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-8 border-b border-gray-800/40">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center shadow-lg">
            <span class="text-lg font-bold text-white">∞</span>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-white tracking-wide">PORCELAIN GALLERY</h1>
          </div>
        </div>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-900/50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <!-- Username/Email -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ isLoginMode ? $t('auth.login.username') : $t('auth.register.username') }}
              </label>
              <input
                v-model="form.username"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-800/95 backdrop-blur-sm border border-gray-600/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600/60 focus:border-gray-600/90 transition-all duration-200 placeholder-gray-400 text-white"
                :placeholder="isLoginMode ? $t('auth.login.usernamePlaceholder') : $t('auth.register.usernamePlaceholder')"
                :disabled="loading"
              />
            </div>

            <!-- Email (only for register) -->
            <div v-if="!isLoginMode">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ $t('auth.register.email') }}
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-gray-800/95 backdrop-blur-sm border border-gray-600/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600/60 focus:border-gray-600/90 transition-all duration-200 placeholder-gray-400 text-white"
                :placeholder="$t('auth.register.emailPlaceholder')"
                :disabled="loading"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ isLoginMode ? $t('auth.login.password') : $t('auth.register.password') }}
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 bg-gray-800/95 backdrop-blur-sm border border-gray-600/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600/60 focus:border-gray-600/90 transition-all duration-200 placeholder-gray-400 pr-12 text-white"
                  :placeholder="isLoginMode ? $t('auth.login.passwordPlaceholder') : $t('auth.register.passwordPlaceholder')"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-800/50"
                  :disabled="loading"
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

            <!-- Confirm Password (only for register) -->
            <div v-if="!isLoginMode">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ $t('auth.register.confirmPassword') }}
              </label>
              <div class="relative">
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 bg-gray-800/95 backdrop-blur-sm border border-gray-600/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600/60 focus:border-gray-600/90 transition-all duration-200 placeholder-gray-400 pr-12 text-white"
                  :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-800/50"
                  :disabled="loading"
                >
                  <svg v-if="showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Password Strength Indicator (only for register) -->
            <div v-if="!isLoginMode && form.password" class="space-y-2">
              <div class="text-xs text-gray-500">{{ $t('auth.register.passwordStrength') }}</div>
              <div class="flex space-x-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  :class="[
                    'h-1 flex-1 rounded-full transition-all duration-200',
                    i <= passwordStrength ? 'bg-gray-400' : 'bg-gray-700'
                  ]"
                ></div>
              </div>
              <div class="text-xs" :class="passwordStrengthText.color">
                {{ passwordStrengthText.text }}
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-4 bg-red-900/20 backdrop-blur-sm border border-red-600/50 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <span class="text-red-400">⚠️</span>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-300">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              :class="isLoginMode 
                ? 'bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600'
                : 'bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600'"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoginMode ? $t('auth.login.loggingIn') : $t('auth.register.registering') }}
              </span>
              <span v-else>{{ isLoginMode ? $t('auth.login.loginButton') : $t('auth.register.registerButton') }}</span>
            </button>
          </div>

          <!-- Mode Toggle -->
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-400">
              {{ isLoginMode ? $t('auth.login.noAccount') : $t('auth.register.hasAccount') }}
              <button
                type="button"
                @click="toggleMode"
                class="font-medium text-gray-300 hover:text-white transition-colors"
              >
                {{ isLoginMode ? $t('auth.login.registerLink') : $t('auth.register.loginLink') }}
              </button>
            </p>
          </div>

          <!-- Language Toggle -->
          <div class="mt-3 text-center">
            <button
              @click="toggleLanguage"
              class="text-sm text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded-full hover:bg-gray-900/50"
            >
              {{ $t('auth.languageToggle') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n()

// Props
const props = defineProps<{
  show: boolean
  mode?: 'login' | 'register'
  redirectPath?: string
}>()

// Emits
const emit = defineEmits<{
  close: []
  success: []
}>()

// State
const isLoginMode = ref(props.mode === 'register' ? false : true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Computed
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
  if (strength === 1) return { text: 'Very Weak', color: 'text-red-500' }
  if (strength === 2) return { text: 'Weak', color: 'text-orange-500' }
  if (strength === 3) return { text: 'Good', color: 'text-yellow-500' }
  if (strength === 4) return { text: 'Strong', color: 'text-green-500' }
  return { text: '', color: '' }
})

const isFormValid = computed(() => {
  if (isLoginMode.value) {
    return form.username.trim() && form.password
  } else {
    return form.username.trim() && 
           form.email.trim() && 
           form.password && 
           form.confirmPassword && 
           form.password === form.confirmPassword &&
           passwordStrength.value >= 2
  }
})

const showModal = computed(() => props.show)

// Methods
const handleSubmit = async () => {
  if (loading.value || !isFormValid.value) return
  
  loading.value = true
  error.value = ''

  try {
    let result
    
    if (isLoginMode.value) {
      result = await authStore.login({
        username: form.username.trim(),
        password: form.password
      })
    } else {
      // Validate password match
      if (form.password !== form.confirmPassword) {
        error.value = '密码不匹配'
        return
      }
      
      result = await authStore.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      })
    }

    if (result.success) {
      // Close modal and emit success
      closeModal()
      emit('success')
      
      // Handle redirect
      if (props.redirectPath) {
        router.push(props.redirectPath)
      } else {
        // 前端登录用户始终跳转到首页，不跳转到管理后台
        router.push('/')
      }
    } else {
      error.value = result.message || (isLoginMode.value ? '登录失败' : '注册失败')
    }
  } catch (err) {
    error.value = isLoginMode.value ? '登录时发生错误' : '注册时发生错误'
    console.error('Auth error:', err)
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  error.value = ''
  // Reset form
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
}

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Watch for mode changes
watch(() => props.mode, (newMode) => {
  isLoginMode.value = newMode === 'register' ? false : true
})

// Watch for show changes
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Reset form when modal opens
    form.username = ''
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    error.value = ''
  }
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>