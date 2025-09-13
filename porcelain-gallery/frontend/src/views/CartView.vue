<template>
  <div class="min-h-screen bg-black">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-4">{{ $t('cart.title') }}</h1>
        <p class="text-gray-300">
          Review your selected items and proceed when ready.
        </p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartStore.totalItems === 0" class="text-center py-16">
        <div class="text-gray-400 mb-6">
          <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-white mb-4">{{ $t('cart.empty') }}</h2>
        <p class="text-gray-300 mb-8">Your shopping cart is empty. Start adding some beautiful pieces to your collection.</p>
        <router-link 
          to="/products" 
          class="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
        >
          Browse Products
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-6">
        <!-- Cart Items List -->
        <div class="bg-gray-900 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div class="divide-y divide-gray-700">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id"
              class="p-6 hover:bg-gray-800 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <!-- Product Image -->
                <div class="flex-shrink-0 w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    v-if="item.primary_image" 
                    :src="getImageSrc(item.primary_image)"
                    :alt="currentLocale === 'en' ? item.name_en : item.name_cn"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-medium text-white truncate">
                    {{ currentLocale === 'en' ? item.name_en : item.name_cn }}
                  </h3>
                  <p class="text-sm text-gray-300">
                    Unit Price: ${{ item.price.toFixed(2) }}
                  </p>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-3">
                  <button 
                    @click="decreaseQuantity(item.id)"
                    class="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                    :disabled="item.quantity <= 1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span class="w-8 text-center font-medium text-white">{{ item.quantity }}</span>
                  
                  <button 
                    @click="increaseQuantity(item.id)"
                    class="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <!-- Price -->
                <div class="text-right">
                  <p class="text-lg font-semibold text-white">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                </div>

                <!-- Remove Button -->
                <button 
                  @click="removeItem(item.id)"
                  class="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Remove item"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 space-y-4">
          <div class="flex justify-between items-center text-lg">
            <span class="font-medium text-white">{{ $t('cart.total') }}:</span>
            <span class="text-2xl font-bold text-white">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          
          <p class="text-sm text-gray-300">
            {{ cartStore.totalItems }} item{{ cartStore.totalItems !== 1 ? 's' : '' }} in cart
          </p>
          
          <div class="flex space-x-4 pt-4">
            <button 
              @click="clearCart"
              class="flex-1 bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Clear Cart
            </button>
            
            <button 
              @click="proceedToCheckout"
              class="flex-1 bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {{ $t('cart.checkout') }}
            </button>
          </div>
        </div>

        <!-- Continue Shopping -->
        <div class="text-center">
          <router-link 
            to="/products" 
            class="inline-flex items-center text-white hover:text-gray-300 font-medium transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import API_CONFIG from '@/config/api'

const { locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const currentLocale = computed(() => locale.value)

function getImageSrc(imagePath: string) {
  // Use API config to handle all image URL logic
  const processedUrl = API_CONFIG.getImageUrl(imagePath)
  
  // If it's a local static asset path, convert to proper Vite asset import
  if (imagePath && (imagePath.startsWith('/src/assets/') || imagePath.includes('tea_image'))) {
    const fileName = imagePath.split('/').pop()
    return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
  }
  
  // If API config returned the original path (for local assets), convert it
  if (processedUrl === imagePath && imagePath.includes('tea_image')) {
    const fileName = imagePath.split('/').pop()
    return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
  }
  
  // Use the processed URL from API config
  return processedUrl
}

function increaseQuantity(productId: number) {
  const item = cartStore.items.find(item => item.id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

function decreaseQuantity(productId: number) {
  const item = cartStore.items.find(item => item.id === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

function removeItem(productId: number) {
  cartStore.removeFromCart(productId)
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

function proceedToCheckout() {
  // For now, just show an alert since we don't have actual checkout functionality
  alert('Checkout functionality would be implemented here. For now, this is just a demo.')
  // In a real application, you would:
  // 1. Validate cart items
  // 2. Redirect to checkout page
  // 3. Handle payment processing
  // 4. Create order in backend
}
</script>

<style scoped>
.cart-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .space-x-4 {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1rem;
  }
  
  .space-x-4 > * {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0.5rem;
  }
  
  .w-20 {
    width: 4rem;
  }
  
  .h-20 {
    height: 4rem;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .py-12 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-16 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .w-20 {
    width: 3.5rem;
  }
  
  .h-20 {
    height: 3.5rem;
  }
}
</style>