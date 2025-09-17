<template>
  <div class="min-h-screen bg-black">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-24">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p class="text-gray-300">Loading...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center py-24">
      <div class="text-center">
        <div class="text-red-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-300 mb-4 text-lg">Error occurred</p>
        <div class="space-x-4">
          <button 
            @click="loadProduct"
            class="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
          <router-link 
            to="/products"
            class="bg-white text-black px-6 py-2 hover:bg-gray-200 transition-colors"
          >
            Back to Products
          </router-link>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-400 mb-8">
        <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <router-link to="/products" class="hover:text-white transition-colors">Products</router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-white">{{ currentLocale === 'en' ? product.name_en : product.name_cn }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-square bg-gray-800 overflow-hidden relative cursor-pointer"
               @click="openImageModal">
            <img 
              v-if="currentImage" 
              :src="getImageSrc(currentImage)"
              :alt="currentLocale === 'en' ? product.name_en : product.name_cn"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-700">
              <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="product" class="flex space-x-2 overflow-x-auto pb-2">
            <div 
              v-for="(image, index) in productThumbnails" 
              :key="index"
              @click="setCurrentImageByIndex(index)"
              :class="[
                'flex-shrink-0 w-20 h-20 bg-gray-800 overflow-hidden cursor-pointer border-2 transition-all',
                currentImageIndex === index 
                  ? 'border-white' 
                  : 'border-transparent hover:border-gray-600'
              ]"
            >
              <img 
                :src="getImageSrc(image)"
                :alt="`Product image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="space-y-6">
          <!-- Product Title and Badges -->
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <h1 class="text-2xl lg:text-3xl font-bold text-white leading-tight">
                {{ currentLocale === 'en' ? product.name_en : product.name_cn }}
              </h1>
              <div v-if="product.is_featured" class="bg-orange-500 text-white px-3 py-1 text-xs font-medium ml-4 flex-shrink-0">
                TOP RATED
              </div>
            </div>
            <p class="text-sm text-gray-300">
              {{ product.dynasty_name }} • {{ product.shape_name }}
            </p>
          </div>

          <!-- Price -->
          <div class="space-y-2">
            <div class="text-2xl font-bold text-white">
              Sale price{{ product.price.toFixed(0) }} USD
            </div>
            <div class="flex items-center space-x-4 text-sm text-gray-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>4.8 (10,000+ Verified Reviews)</span>
              </div>
            </div>
          </div>

          <!-- Product Status -->
          <div class="flex items-center space-x-4 text-sm">
            <div v-if="product.is_available" class="flex items-center text-green-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              In Stock
            </div>
            <div v-else class="flex items-center text-red-400">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              Out of Stock
            </div>
          </div>

          <!-- Add to Cart Button -->
          <button 
            @click="addToCart"
            :disabled="!product.is_available"
            :class="[
              'w-full py-4 px-6 font-medium transition-colors text-lg',
              product.is_available
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ product.is_available ? 'Add to cart' : 'Out of Stock' }}
          </button>

          <!-- Trust Badges -->
          <div class="grid grid-cols-2 gap-4 py-4 border-t border-gray-700">
            <div class="text-center">
              <div class="text-sm font-medium text-white">Free Shipping</div>
              <div class="text-xs text-gray-300">On All Orders</div>
            </div>
            <div class="text-center">
              <div class="text-sm font-medium text-white">30 Days Return</div>
              <div class="text-xs text-gray-300">Free Return Guarantee</div>
            </div>
          </div>

          <!-- Product Specifications -->
          <div class="border-t border-gray-700 pt-6">
            <h3 class="text-lg font-semibold text-white mb-4">Specifications</h3>
            <div class="space-y-3">
              <div v-if="product.dynasty_name" class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Dynasty:</span>
                <span class="text-gray-300">{{ product.dynasty_name }}</span>
              </div>
              
              <div v-if="product.shape_name" class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Shape:</span>
                <span class="text-gray-300">{{ product.shape_name }}</span>
              </div>
              
              <div v-if="product.dimensions" class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Dimensions:</span>
                <span class="text-gray-300">{{ product.dimensions }}</span>
              </div>
              
              <div v-if="product.weight" class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Weight:</span>
                <span class="text-gray-300">{{ product.weight }}</span>
              </div>
              
              <div v-if="product.age" class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Age:</span>
                <span class="text-gray-300">{{ product.age }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Material:</span>
                <span class="text-gray-300">{{ product.material || 'Premium Porcelain' }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-700">
                <span class="font-medium text-white">Origin:</span>
                <span class="text-gray-300">{{ product.origin || 'China' }}</span>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-black mb-4">About</h3>
            <p v-if="currentLocale === 'en' ? product.description_en : product.description_cn" class="text-gray-600 leading-relaxed mb-4">
              {{ currentLocale === 'en' ? product.description_en : product.description_cn }}
            </p>
            <p class="text-gray-600 leading-relaxed">
              Handcrafted with the finest materials and traditional techniques, this piece represents the pinnacle of porcelain artistry. Each item is carefully selected and authenticated to ensure authenticity and quality.
            </p>
          </div>

          <!-- Craftsmanship -->
          <div v-if="currentLocale === 'en' ? product.craftsmanship_en : product.craftsmanship_cn" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-black mb-4">Craftsmanship</h3>
            <p class="text-gray-600 leading-relaxed">
              {{ currentLocale === 'en' ? product.craftsmanship_en : product.craftsmanship_cn }}
            </p>
          </div>

          <!-- Historical Context -->
          <div v-if="currentLocale === 'en' ? product.history_en : product.history_cn" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-black mb-4">Historical Context</h3>
            <p class="text-gray-600 leading-relaxed">
              {{ currentLocale === 'en' ? product.history_en : product.history_cn }}
            </p>
          </div>

          <!-- Shipping & Return -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-black mb-4">Shipping & Return</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <div class="font-medium text-black">Free Shipping on All Orders</div>
                  <div class="text-sm text-gray-600">Items are carefully packaged within 2–3 business days. U.S. delivery: 1–2 days. International delivery: 1–5 days.</div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <div class="font-medium text-black">30 Days Free Return Guarantee</div>
                  <div class="text-sm text-gray-600">Return in original condition if it's not exactly what you had in mind.</div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <div class="font-medium text-black">Authentication Guarantee</div>
                  <div class="text-sm text-gray-600">Every piece comes with a certificate of authenticity and detailed provenance documentation.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="mt-16 border-t border-gray-200 pt-12">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-black mb-2">You May Also Like</h2>
          <p class="text-gray-600">Discover more exquisite pieces from our collection</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" 
               class="group cursor-pointer bg-white"
               @click="goToProduct(relatedProduct.id)">
            <!-- Product Image -->
            <div class="aspect-square bg-gray-100 relative overflow-hidden">
              <img 
                v-if="relatedProduct.primary_image || (relatedProduct as any).primary_image_url"
                :src="getImageSrc(relatedProduct.primary_image || (relatedProduct as any).primary_image_url || '/src/assets/tea_image/1.png')"
                :alt="currentLocale === 'en' ? relatedProduct.name_en : relatedProduct.name_cn"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              
              <!-- Featured Badge -->
              <div v-if="relatedProduct.is_featured" class="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
                TOP RATED
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4 space-y-2">
              <!-- Product Name -->
              <h3 class="text-sm font-medium text-black line-clamp-2"
                  :title="currentLocale === 'en' ? relatedProduct.name_en : relatedProduct.name_cn">
                {{ currentLocale === 'en' ? relatedProduct.name_en : relatedProduct.name_cn }}
              </h3>
              
              <!-- Price -->
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">
                  Sale price{{ relatedProduct.price.toFixed(0) }} USD
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
         @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full">
        <img 
          :src="getImageSrc(currentImage || '')"
          :alt="currentLocale === 'en' ? product?.name_en : product?.name_cn"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
        
        <!-- Close Button -->
        <button 
          @click="closeImageModal"
          class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-70 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Navigation Buttons -->
        <button 
          v-if="product?.images && product.images.length > 1"
          @click.stop="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-70 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          v-if="product?.images && product.images.length > 1"
          @click.stop="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-70 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAdminStore, type Product } from '@/stores/admin'
import API_CONFIG from '@/config/api'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const adminStore = useAdminStore()

const loading = ref(false)
const error = ref('')
const showImageModal = ref(false)
const currentImageIndex = ref(0)

const product = ref<Product | null>(null)
const currentLocale = computed(() => locale.value)
const currentImage = computed(() => {
  if (!product.value) return null
  
  const thumbnails = productThumbnails.value
  const selectedImage = thumbnails[currentImageIndex.value] || thumbnails[0]
  console.log(`ProductDetailView currentImage: thumbnails=`, thumbnails)
  console.log(`Current image index: ${currentImageIndex.value}, selected image:`, selectedImage)
  return selectedImage
})

// Get thumbnails for current product (reactive)
const productThumbnails = computed(() => {
  if (!product.value) {
    console.log('ProductDetailView productThumbnails: no product.value')
    return []
  }
  
  console.log('ProductDetailView productThumbnails: product.value =', product.value)
  console.log('ProductDetailView productThumbnails: product.value.images =', product.value.images)
  console.log('ProductDetailView productThumbnails: product.value.primary_image =', product.value.primary_image)
  
  // For regular products, use the product's images array first (if it has valid images)
  if (product.value.images && product.value.images.length > 0) {
    const validImages = product.value.images.filter(img => img.image_path && img.image_path.trim() !== '')
    if (validImages.length > 0) {
      console.log(`Using regular product images for product ${product.value.id}:`, validImages)
      const imagePaths = validImages.map(img => img.image_path)
      console.log('Extracted image paths:', imagePaths)
      return imagePaths
    }
  }
  
  // Fallback: if no valid images array, use primary_image
  if (product.value.primary_image && product.value.primary_image.trim() !== '') {
    console.log(`Using primary image for product ${product.value.id}:`, product.value.primary_image)
    return [product.value.primary_image]
  }
  
  // For Best Seller products, use the thumbnails as last resort
  const bestSellerIndex = product.value.id - 10000
  if (bestSellerIndex >= 0 && bestSellerIndex < adminStore.bestSellersProducts.length) {
    console.log(`Using Best Seller thumbnails for product ${product.value.id}`)
    return adminStore.bestSellersProducts[bestSellerIndex].thumbnails
  }
  
  // Final fallback: generate images based on product ID
  console.log(`Using fallback images for product ${product.value.id}`)
  const baseImageNumber = (product.value.id % 1000) % 19 + 1
  return [
    `/src/assets/tea_image/${baseImageNumber}.png`
  ]
})

// Related products - get 4 products excluding current one (deterministic order for consistency)
const relatedProducts = computed(() => {
  // Use adminStore products first, then fallback to productsStore
  const allProducts = adminStore.products.length > 0 ? adminStore.products : productsStore.products
  if (!allProducts.length) return []
  return allProducts
    .filter(p => p.id !== product.value?.id)
    .sort((a, b) => a.id - b.id) // Use deterministic sorting instead of random
    .slice(0, 4)
})

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
  
  // For media path identifiers, use fallback image
  if (imagePath && imagePath.startsWith('/media/')) {
    const imageNumber = (product.value?.id || 1) % 19 + 1
    return new URL(`../assets/tea_image/${imageNumber}.png`, import.meta.url).href
  }
  
  // Use the processed URL from API config
  return processedUrl
}


async function loadProduct() {
  loading.value = true
  error.value = ''
  
  try {
    console.log(`loadProduct called - route.params.id:`, route.params.id)
    console.log(`loadProduct called - route.fullPath:`, route.fullPath)
    const productId = parseInt(route.params.id as string)
    console.log(`loadProduct called - parsed productId:`, productId)
    if (isNaN(productId)) {
      throw new Error('Invalid product ID')
    }
    
    // Get image index from URL query parameter
    const imageIndexParam = route.query.imageIndex as string
    const initialImageIndex = imageIndexParam ? parseInt(imageIndexParam) : 0
    
    // Check if this is a best seller product first
    // Best Seller IDs are generated as index + 10000
    // So we can extract the original index: productId - 10000
    // But only if the result is >= 0 and < bestSellersProducts.length
    const bestSellerIndex = productId - 10000
    const isBestSeller = bestSellerIndex >= 0 && bestSellerIndex < adminStore.bestSellersProducts.length
    console.log(`ProductDetailView: productId=${productId}, bestSellerIndex=${bestSellerIndex}, isBestSeller=${isBestSeller}`)
    
    if (isBestSeller) {
      // This is a best seller product, create a mock product from best seller data
      const bestSellerProduct = adminStore.bestSellersProducts[bestSellerIndex] as any
      const mockProduct = {
        id: productId,
        name_en: bestSellerProduct.name_en || bestSellerProduct.name,
        name_cn: bestSellerProduct.name_cn || bestSellerProduct.name,
        description_en: bestSellerProduct.description_en || `Description for ${bestSellerProduct.name}`,
        description_cn: bestSellerProduct.description_cn || `${bestSellerProduct.name}的描述`,
        craftsmanship_en: `Craftsmanship details for ${bestSellerProduct.name}`,
        craftsmanship_cn: `${bestSellerProduct.name}的工艺细节`,
        history_en: `History of ${bestSellerProduct.name}`,
        history_cn: `${bestSellerProduct.name}的历史`,
        price: parseFloat(String(bestSellerProduct.price || '0').replace(/[$,]/g, '')),
        dimensions: bestSellerProduct.dimensions || 'Various',
        weight: bestSellerProduct.weight || 'Various',
        age: bestSellerProduct.age || 'Various',
        material: bestSellerProduct.material || 'Premium Porcelain',
        origin: bestSellerProduct.origin || 'China',
        dynasty_id: bestSellerProduct.dynasty_id || 1,
        shape_id: bestSellerProduct.shape_id || 1,
        dynasty_name: getDynastyName(bestSellerProduct.dynasty_id || 1),
        shape_name: getShapeName(bestSellerProduct.shape_id || 1),
        primary_image: bestSellerProduct.mainImage,
        images: bestSellerProduct.thumbnails.map((thumb: string, index: number) => ({
          id: index + 1,
          image_path: thumb,
          is_primary: index === 0,
          sort_order: index + 1
        })),
        videos: [],
        is_featured: true,
        is_available: true
      }
      // Completely replace the product object to ensure reactivity
      product.value = { ...mockProduct }
      console.log(`Best Seller product value updated:`, product.value)
      console.log(`Best Seller product images:`, product.value.images)
      currentImageIndex.value = imageIndexParam ? parseInt(imageIndexParam) : 0
    } else {
      // This is a regular product, try adminStore first, then productsStore
      console.log(`Loading regular product with ID: ${productId}`)
      
      // First try to get from adminStore
      const adminProduct = adminStore.getProduct(productId)
      if (adminProduct) {
        console.log(`Product found in adminStore:`, adminProduct)
        console.log(`Product images:`, adminProduct.images)
        // Completely replace the product object to ensure reactivity
        product.value = { ...adminProduct }
        console.log(`Product value updated:`, product.value)
        console.log(`Updated product images:`, product.value.images)
        currentImageIndex.value = initialImageIndex
      } else {
        // Fallback to productsStore
        console.log(`Product not found in adminStore, trying productsStore`)
        await Promise.all([
          productsStore.fetchProduct(productId),
          productsStore.fetchProducts(1, 20) // Fetch more products for related section
        ])
        
        if (productsStore.currentProduct) {
          console.log(`Regular product loaded from productsStore:`, productsStore.currentProduct)
          console.log(`Product images:`, productsStore.currentProduct.images)
          // Completely replace the product object to ensure reactivity
          product.value = { ...productsStore.currentProduct, primary_image: (productsStore.currentProduct as any).primary_image_url || '/src/assets/tea_image/1.png' } as any
          console.log(`Product value updated from productsStore:`, product.value)
          console.log(`Updated product images:`, product.value?.images)
          currentImageIndex.value = initialImageIndex
        } else {
          throw new Error('Product not found')
        }
      }
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load product'
    console.error('Error loading product:', err)
  } finally {
    loading.value = false
  }
}

function setCurrentImage(imagePath: string) {
  const index = product.value?.images?.findIndex(img => img.image_path === imagePath) || 0
  currentImageIndex.value = index
}

function setCurrentImageByIndex(index: number) {
  currentImageIndex.value = index
}

// Helper function to get dynasty name by ID
function getDynastyName(dynastyId: number) {
  const dynasty = adminStore.dynasties.find(d => d.id === dynastyId)
  return dynasty ? dynasty.name : 'Various'
}

// Helper function to get shape name by ID
function getShapeName(shapeId: number) {
  const shape = adminStore.shapes.find(s => s.id === shapeId)
  return shape ? shape.name : 'Various'
}

function openImageModal() {
  if (product.value) {
    showImageModal.value = true
  }
}

function closeImageModal() {
  showImageModal.value = false
}

function previousImage() {
  if (!product.value) return
  const thumbnails = productThumbnails.value
  currentImageIndex.value = currentImageIndex.value > 0 
    ? currentImageIndex.value - 1 
    : thumbnails.length - 1
}

function nextImage() {
  if (!product.value) return
  const thumbnails = productThumbnails.value
  currentImageIndex.value = currentImageIndex.value < thumbnails.length - 1 
    ? currentImageIndex.value + 1 
    : 0
}

function addToCart() {
  if (product.value) {
    cartStore.addToCart(product.value)
    // Show success message or animation
  }
}

function goToProduct(productId: number) {
  router.push(`/products/${productId}`)
}

function addRelatedToCart(relatedProduct: any) {
  cartStore.addToCart(relatedProduct)
  // Show success message or animation
}

// Keyboard navigation for image modal
function handleKeydown(event: KeyboardEvent) {
  if (showImageModal.value) {
    switch (event.key) {
      case 'Escape':
        closeImageModal()
        break
      case 'ArrowLeft':
        previousImage()
        break
      case 'ArrowRight':
        nextImage()
        break
    }
  }
}

onMounted(async () => {
  await loadProduct()
  document.addEventListener('keydown', handleKeydown)
})

// Watch for route changes to reload product
watch(() => route.params.id, async (newId, oldId) => {
  if (newId !== oldId) {
    console.log(`Route changed from ${oldId} to ${newId}, reloading product`)
    await loadProduct()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for image changes */
img {
  transition: opacity 0.3s ease;
}

/* Custom scrollbar for thumbnails */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .w-20 {
    width: 3rem;
  }
  
  .h-20 {
    height: 3rem;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .w-16 {
    width: 2.5rem;
  }
  
  .h-16 {
    height: 2.5rem;
  }
}
</style>