<template>
  <div class="group cursor-pointer bg-black"
       @click="goToProduct">
    <!-- Product Image -->
    <div class="aspect-square bg-gray-800 relative overflow-hidden">
      <img 
        v-if="product.primary_image && !imageError" 
        :src="getImageSrc(product.primary_image)"
        :alt="currentLocale === 'en' ? product.name_en : product.name_cn"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
        @load="handleImageLoad"
        @loadstart="setupImageTimeout"
      />
      <!-- Error state -->
      <div v-if="imageError" class="w-full h-full flex flex-col items-center justify-center bg-gray-700 text-gray-400">
        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-xs text-center px-2">Image failed to load</p>
        <p class="text-xs text-center px-2 text-gray-500">{{ product.primary_image }}</p>
      </div>
      <!-- Loading state -->
      <div v-else-if="imageLoading" class="w-full h-full flex items-center justify-center bg-gray-700">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
      <!-- No image state -->
      <div v-else-if="!product.primary_image" class="w-full h-full flex items-center justify-center bg-gray-700">
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Quick Add Button - appears on hover -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center p-4 pointer-events-none">
        <button 
          @click.stop="addToCart"
          class="bg-black text-white px-4 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800 mb-4 pointer-events-auto"
        >
          Add to cart
        </button>
      </div>
      
      <!-- Featured Badge -->
      <div v-if="product.is_featured" class="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
        TOP RATED
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4 space-y-2">
      <!-- Product Name -->
      <h3 class="text-sm font-medium text-white line-clamp-2"
          :title="currentLocale === 'en' ? product.name_en : product.name_cn">
        {{ currentLocale === 'en' ? product.name_en : product.name_cn }}
      </h3>
      
      <!-- Price -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-300">
          Sale price{{ product.price.toFixed(0) }} USD
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/stores/products'
import API_CONFIG from '@/config/api'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const router = useRouter()
const { locale } = useI18n()
const cartStore = useCartStore()

const currentLocale = computed(() => locale.value)

// Image loading states
const imageLoading = ref(true)
const imageError = ref(false)
let imageLoadTimeout: NodeJS.Timeout | null = null

function goToProduct() {
  router.push(`/products/${props.product.id}`)
}

function addToCart() {
  cartStore.addToCart(props.product)
  // Optional: Add visual feedback
  console.log('Added to cart:', props.product.name_en)
}

function handleImageLoad() {
  console.log('Image loaded successfully for product:', props.product.id)
  if (imageLoadTimeout) {
    clearTimeout(imageLoadTimeout)
    imageLoadTimeout = null
  }
  imageLoading.value = false
  imageError.value = false
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  console.error('Image failed to load:', {
    productId: props.product.id,
    productName: props.product.name_en,
    originalPath: props.product.primary_image,
    resolvedSrc: img.src,
    error: event
  })
  if (imageLoadTimeout) {
    clearTimeout(imageLoadTimeout)
    imageLoadTimeout = null
  }
  imageLoading.value = false
  imageError.value = true
}

// Set up timeout for image loading
function setupImageTimeout() {
  if (imageLoadTimeout) {
    clearTimeout(imageLoadTimeout)
  }
  imageLoadTimeout = setTimeout(() => {
    console.warn('Image load timeout for product:', props.product.id)
    imageLoading.value = false
    imageError.value = true
  }, 5000) // 5 second timeout
}

function getImageSrc(imagePath: string) {
  console.log('ProductCard getImageSrc called with:', imagePath)
  
  // Use API config to handle all image URL logic
  const processedUrl = API_CONFIG.getImageUrl(imagePath)
  
  // If it's a local static asset path, convert to proper Vite asset import
  if (imagePath && (imagePath.startsWith('/src/assets/') || imagePath.includes('tea_image'))) {
    const fileName = imagePath.split('/').pop()
    const assetUrl = new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
    console.log('Using local asset:', assetUrl)
    return assetUrl
  }
  
  // If API config returned the original path (for local assets), convert it
  if (processedUrl === imagePath && imagePath.includes('tea_image')) {
    const fileName = imagePath.split('/').pop()
    const assetUrl = new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
    console.log('Converting local asset:', assetUrl)
    return assetUrl
  }
  
  // For media path identifiers, use fallback
  if (imagePath && imagePath.startsWith('/media/')) {
    console.warn('Unexpected media path in ProductCard:', imagePath)
    const imageNumber = (props.product.id % 19) + 1
    const fallbackUrl = new URL(`../assets/tea_image/${imageNumber}.png`, import.meta.url).href
    console.log('Fallback URL:', fallbackUrl)
    return fallbackUrl
  }
  
  // Use the processed URL from API config
  console.log('Using processed URL:', processedUrl)
  return processedUrl
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for hover effects */
.group {
  transition: all 0.4s ease;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .text-lg {
    font-size: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .p-5 {
    padding: 1rem;
  }
  
  .w-20 {
    width: 4rem;
  }
  
  .h-20 {
    height: 4rem;
  }
}

@media (max-width: 640px) {
  .text-lg {
    font-size: 0.95rem;
  }
  
  .p-5 {
    padding: 0.875rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
  }
  
  .group:hover .group-hover\:opacity-100 {
    opacity: 1;
  }
  
  .group:hover .group-hover\:translate-y-0 {
    transform: translateY(0);
  }
}

@media (hover: none) and (pointer: coarse) {
  .group:hover .group-hover\:opacity-100 {
    opacity: 0;
  }
}
</style>