<template>
  <nav class="bg-black border-b border-gray-800 relative z-50" style="display: block !important; visibility: visible !important;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2">
            <!-- Infinity Symbol -->
            <div class="text-white text-2xl font-bold">∞</div>
            <div class="text-xl font-bold text-white">PORCELAIN GALLERY</div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="block">
          <div class="ml-10 flex items-baseline space-x-8">
            <router-link 
              to="/" 
              class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white': $route.path === '/' }"
            >
              New & Featured
            </router-link>
            <router-link 
              to="/products" 
              class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white': $route.path === '/products' }"
            >
              Vases
            </router-link>
            <router-link 
              to="/products" 
              class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white': $route.path === '/products' }"
            >
              Plates
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white': $route.path === '/about' }"
            >
              About
            </router-link>
          </div>
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <button class="text-gray-400 hover:text-white p-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button 
              @click="handleUserClick"
              class="text-gray-400 hover:text-white p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            <!-- User Dropdown Menu (only show when authenticated) -->
            <div v-if="isAuthenticated && showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div class="px-4 py-2 text-sm text-gray-700 border-b">
                <div class="font-medium">{{ user?.username }}</div>
                <div class="text-gray-500">{{ user?.email }}</div>
              </div>
              <router-link 
                v-if="isAdmin"
                to="/admin" 
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {{ $t('nav.admin') }}
              </router-link>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {{ $t('nav.logout') }}
              </button>
            </div>
          </div>

          <!-- Cart -->
          <router-link 
            to="/cart" 
            class="relative text-gray-400 hover:text-white p-2 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              @click="toggleMobileMenu"
              class="text-gray-600 hover:text-black p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link 
          to="/" 
          @click="showMobileMenu = false"
          class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          :class="{ 'text-white bg-gray-800': $route.path === '/' }"
        >
          New & Featured
        </router-link>
        <router-link 
          to="/products" 
          @click="showMobileMenu = false"
          class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          :class="{ 'text-white bg-gray-800': $route.path === '/products' }"
        >
          Porcelain
        </router-link>
        <router-link 
          to="/about" 
          @click="showMobileMenu = false"
          class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          :class="{ 'text-white bg-gray-800': $route.path === '/about' }"
        >
          About
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { locale } = useI18n()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showLanguageMenu = ref(false)
const showMobileMenu = ref(false)
const showUserMenu = ref(false)

// Computed
const currentLanguage = computed(() => locale.value)
const cartItemCount = computed(() => cartStore.totalItems)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

onMounted(() => {
  // Initialize auth store
  authStore.initializeAuth()
  
  console.log('NavigationBar mounted, current route:', window.location.pathname)
  console.log('NavigationBar visibility check:', {
    navElement: document.querySelector('nav'),
    navDisplay: document.querySelector('nav')?.style.display,
    navVisibility: document.querySelector('nav')?.style.visibility
  })
  
  // Check if navigation links are visible
  setTimeout(() => {
    const navLinks = document.querySelectorAll('nav a')
    console.log('Navigation links found:', navLinks.length)
    navLinks.forEach((link, index) => {
      console.log(`Link ${index}:`, {
        text: link.textContent?.trim(),
        href: link.getAttribute('href'),
        display: window.getComputedStyle(link).display,
        visibility: window.getComputedStyle(link).visibility,
        opacity: window.getComputedStyle(link).opacity
      })
    })
  }, 100)
})

function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function switchLanguage(lang: string) {
  locale.value = lang
  showLanguageMenu.value = false
  localStorage.setItem('language', lang)
}

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  router.push('/')
}

function handleUserClick() {
  if (isAuthenticated.value) {
    // Show user dropdown menu
    toggleUserMenu()
  } else {
    // Show login modal
    showLoginModal()
  }
}

function showLoginModal() {
  if (typeof window !== 'undefined' && window.showAuthModal) {
    window.showAuthModal('login')
  }
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as Element
  if (!target.closest('.relative')) {
    showLanguageMenu.value = false
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.router-link-active {
  @apply text-white;
}
</style>