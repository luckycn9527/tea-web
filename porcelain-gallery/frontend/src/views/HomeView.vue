<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAdminStore } from '@/stores/admin-api'
import ProductCard from '@/components/ProductCard.vue'
import API_CONFIG from '@/config/api'

const router = useRouter()
const productsStore = useProductsStore()
const adminStore = useAdminStore()

interface Product {
  id: number
  name_en: string
  name_cn: string
  description_en?: string
  description_cn?: string
  craftsmanship_en?: string
  craftsmanship_cn?: string
  history_en?: string
  history_cn?: string
  price: number | string
  dynasty_id?: number
  shape_id?: number
  material_id?: number
  primary_image?: string
  images?: any[]
  is_featured: boolean
  is_available: boolean
  name?: string
  mainImage?: string
  thumbnails?: string[]
}

interface BestSellerProduct {
  id: number
  name_en: string
  name_cn: string
  is_featured: boolean
  is_available: boolean
  name: string
  price: string
  mainImage: string
  thumbnails: string[]
}

const loading = ref(false)
const featuredProducts = ref<Product[]>([])
const bestSellers = ref<BestSellerProduct[]>([])

// 使用 watch 替代 watchEffect，单一入口监听
watch(() => adminStore.bestSellersProducts, (newProducts) => {
  console.log('Best sellers products changed, length:', newProducts.length)
  bestSellers.value = [...newProducts] // 直接使用 store 中已预处理的数据
  console.log('Best Sellers updated:', bestSellers.value.length, 'products')
}, { immediate: true })

// 简化的 computed，直接使用 store 中已预处理的 thumbnails
const productThumbnails = computed(() => {
  const thumbnailsMap: Record<number, string[]> = {}
  
  bestSellers.value.forEach((product) => {
    if (product.thumbnails && Array.isArray(product.thumbnails) && product.thumbnails.length > 0) {
      // 使用 store 中已预处理的 thumbnails
      thumbnailsMap[product.id] = product.thumbnails
    } else {
      // Fallback to static images
      const baseImageNumber = (product.id % 1000) % 21 + 1
      thumbnailsMap[product.id] = [
        getAssetUrl(`${baseImageNumber}.png`),
        getAssetUrl(`${(baseImageNumber % 21) + 1}.png`),
        getAssetUrl(`${(baseImageNumber % 21) + 2}.png`)
      ]
    }
  })
  
  return thumbnailsMap
})

const currentImageIndices = ref<Record<number, number>>({})

onMounted(async () => {
  loading.value = true
  try {
    // Load admin settings from API (this will also load bestsellers and convert to products)
    await adminStore.loadAllData()
    
    // Use adminStore products instead of productsStore
    featuredProducts.value = adminStore.products.filter(p => p.is_featured).slice(0, 4)
    
    // Debug: Check if best sellers data is loaded correctly
    console.log('HomeView - Best Sellers Products from Admin Store:', adminStore.bestSellersProducts.length)
    console.log('HomeView - Best Sellers computed:', bestSellers.value.length)
    console.log('HomeView - Product Thumbnails computed:', Object.keys(productThumbnails.value).length)
    console.log('HomeView - Featured Products from Admin Store:', featuredProducts.value.length)
    
    // 确保数据同步
    console.log('HomeView - Admin Store Products Count:', adminStore.products.length)
    console.log('HomeView - Admin Store Best Sellers Count:', adminStore.bestSellersProducts.length)
    
    // 如果API数据为空，使用fallback数据
    if (adminStore.bestSellersProducts.length === 0) {
      console.log('HomeView - No API data, using fallback data')
      const fallbackData = [
        {
          id: 1,
          name_en: 'Landscape Jasper Bracelet IV (42mm)',
          name_cn: '山水碧玉手镯 IV (42mm)',
          price: '299',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Landscape Jasper Bracelet IV (42mm)'
        },
        {
          id: 2,
          name_en: 'Dragon Blood Jasper V (4mm)',
          name_cn: '龙血碧玉 V (4mm)',
          price: '199',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Dragon Blood Jasper V (4mm)'
        },
        {
          id: 3,
          name_en: 'Landscape Jasper Bracelet VII (6mm)',
          name_cn: '山水碧玉手镯 VII (6mm)',
          price: '249',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/10.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/11.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Landscape Jasper Bracelet VII (6mm)'
        },
        {
          id: 4,
          name_en: 'Camel-Turquoise Hematite Bracelet V (4mm)',
          name_cn: '骆驼绿松石赤铁矿手镯 V (4mm)',
          price: '179',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/12.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/13.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Camel-Turquoise Hematite Bracelet V (4mm)'
        },
        {
          id: 5,
          name_en: 'Amethyst Bracelet XVII (6mm)',
          name_cn: '紫水晶手镯 XVII (6mm)',
          price: '229',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/14.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/15.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Amethyst Bracelet XVII (6mm)'
        },
        {
          id: 6,
          name_en: 'Rose Quartz Bracelet III (8mm)',
          name_cn: '玫瑰石英手镯 III (8mm)',
          price: '159',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/16.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/16.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/17.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/18.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Rose Quartz Bracelet III (8mm)'
        },
        {
          id: 7,
          name_en: 'Tiger Eye Bracelet IX (10mm)',
          name_cn: '虎眼石手镯 IX (10mm)',
          price: '189',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/19.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/19.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/20.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/21.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Tiger Eye Bracelet IX (10mm)'
        },
        {
          id: 8,
          name_en: 'Lapis Lazuli Bracelet XII (12mm)',
          name_cn: '青金石手镯 XII (12mm)',
          price: '279',
          mainImage: 'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/22.png',
          thumbnails: [
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/22.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/1.png',
            'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/2.png'
          ],
          is_featured: true,
          is_available: true,
          name: 'Lapis Lazuli Bracelet XII (12mm)'
        }
      ]
      
      // 使用 store 方法设置 fallback 数据，保证响应式
      adminStore.setBestSellersProducts(fallbackData)
    }
    
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
})

function goToProduct(productId: number) {
  console.log(`goToProduct called with productId: ${productId}`)
  
  const currentImageIndex = getCurrentImageIndex(productId)
  
  console.log(`Navigating to product ID ${productId}, final route: /products/${productId}`)
  
  // 直接使用真实产品 ID 进行路由跳转
  router.push(`/products/${productId}?imageIndex=${currentImageIndex}`)
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/src/assets/tea_image/1.png'
}

function getImageSrc(path: string) {
  if (!path) return getAssetUrl('1.png')
  
  // 远程 URL 直接用
  if (path.startsWith('http')) return path
  
  // 本地 asset 路径处理
  if (path.includes('tea_image')) {
    const fileName = path.split('/').pop()
    if (fileName && fileName !== 'undefined') {
      return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
    }
  }
  
  // 其他情况使用 API config
  return API_CONFIG.getImageUrl(path)
}

// Helper function to get asset URL for template use
function getAssetUrl(fileName: string) {
  return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href
}

// Get thumbnails for a product (now uses reactive computed property)
function getProductThumbnails(product: any) {
  const thumbnails = productThumbnails.value[product.id] || []
  console.log(`Getting thumbnails for product ${product.id}:`, thumbnails)
  return thumbnails
}

// Get current image index for a product
function getCurrentImageIndex(productId: number) {
  return currentImageIndices.value[productId] || 0
}

// Set current image for a product
function setCurrentImage(productId: number, index: number) {
  currentImageIndices.value[productId] = index
}

// Navigate to previous image
function previousImage(productId: number) {
  const currentIndex = getCurrentImageIndex(productId)
  const thumbnails = getProductThumbnails({ id: productId })
  const newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1
  setCurrentImage(productId, newIndex)
}

// Navigate to next image
function nextImage(productId: number) {
  const currentIndex = getCurrentImageIndex(productId)
  const thumbnails = getProductThumbnails({ id: productId })
  const newIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0
  setCurrentImage(productId, newIndex)
}
</script>

<template>
  <div class="min-h-screen bg-black" style="background-color: black !important;">
    <!-- Hero Section - Compact Layout -->
    <div class="relative text-white flex items-center" :style="{ backgroundImage: `url(${getImageSrc('/src/assets/tea_image/background.png')})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', aspectRatio: '16/3', width: '100%' }">
      <!-- Dark overlay for text readability -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div class="text-center">
          <!-- Trust Badge -->
          <div class="mb-6">
            <div class="inline-flex items-center text-sm font-medium">
              <span class="text-white mr-2">★★★★★</span>
              4.8/5.0 (9929 REVIEWS)
            </div>
          </div>

          <h1 class="text-4xl lg:text-6xl font-normal mb-4 leading-tight" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            {{ adminStore.getSetting?.('site_title') || 'Porcelain Gallery' }}
          </h1>
          
          <h2 class="text-lg lg:text-xl font-medium mb-8 text-gray-300 tracking-wide uppercase">
            {{ adminStore.getSetting?.('site_description') || 'Discover the beauty of Chinese porcelain art' }}
          </h2>

          <div class="space-y-3 max-w-2xl mx-auto">
            <div class="flex items-center justify-center text-sm">
              <svg class="w-4 h-4 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Authentic Chinese Porcelain</span>
            </div>
            <div class="flex items-center justify-center text-sm">
              <svg class="w-4 h-4 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Handcrafted Excellence</span>
            </div>
            <div class="flex items-center justify-center text-sm">
              <svg class="w-4 h-4 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Worldwide Shipping</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Shop Best Sellers Section -->
    <div class="py-16 bg-black text-white">
      <div class="w-full px-2">
        <div class="text-center mb-12 px-4">
          <h2 class="text-3xl lg:text-4xl font-normal text-white mb-4 tracking-normal" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Shop Best Sellers</h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-16">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p class="text-gray-300">Loading...</p>
          </div>
        </div>

        <!-- Best Sellers Grid - Four columns, two rows, eight products total -->
        <div v-else-if="bestSellers.length > 0" class="grid grid-cols-4 gap-0">
          <div v-for="product in bestSellers.slice(0, 8)" :key="product.id" 
               class="group cursor-pointer bg-black"
               @click="goToProduct(product.id)">
            <!-- Product Image -->
            <div class="aspect-square bg-gray-900 relative overflow-hidden mb-1">
              <img 
                :src="getImageSrc(getProductThumbnails(product)[getCurrentImageIndex(product.id)])"
                :alt="product.name_en"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <!-- TOP RATED Badge -->
              <div v-if="product.is_featured" class="absolute top-3 left-3 border px-2 py-1 text-xs font-normal tracking-wide uppercase" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: transparent; border-color: #D4AF37; color: #D4AF37;">
                TOP RATED
              </div>
              
              <!-- Navigation Dots -->
              <div v-if="getProductThumbnails(product).length > 1" class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div 
                  v-for="(thumb, index) in getProductThumbnails(product)" 
                  :key="index"
                  :class="[
                    'w-2 h-2 rounded-full',
                    index === getCurrentImageIndex(product.id) 
                      ? 'bg-orange-500' 
                      : 'bg-white border border-gray-300'
                  ]"
                ></div>
              </div>
              
              <!-- Arrow -->
              <div class="absolute bottom-3 right-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <!-- Thumbnail Navigation -->
            <div v-if="getProductThumbnails(product).length > 1" class="flex justify-center items-center space-x-2 py-2">
              <!-- Left Arrow -->
              <button 
                @click.stop="previousImage(product.id)"
                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- Thumbnail Images -->
              <div class="flex space-x-1">
                <div 
                  v-for="(thumb, index) in getProductThumbnails(product)" 
                  :key="index"
                  :class="[
                    'w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer',
                    index === getCurrentImageIndex(product.id) 
                      ? 'border-white' 
                      : 'border-gray-600'
                  ]"
                  @click.stop="setCurrentImage(product.id, index)"
                >
                  <img 
                    :src="getImageSrc(thumb)" 
                    :alt="`Thumbnail ${index + 1}`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                    loading="lazy"
                  />
                </div>
              </div>
              
              <!-- Right Arrow -->
              <button 
                @click.stop="nextImage(product.id)"
                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Product Info -->
            <div class="text-center px-0">
              <h3 class="text-sm font-medium text-white mb-2">{{ product.name_en }}</h3>
              <div v-if="product.id === 4" class="text-sm text-white mb-1">{{ product.price }} USD</div>
              <div v-if="product.id === 4" class="flex items-center justify-center mb-1">
                <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-xs text-gray-300">33 reviews</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Explore More Button -->
        <div class="text-center mt-12">
          <router-link 
            to="/products" 
            class="inline-flex items-center text-white hover:text-gray-300 font-medium transition-all duration-300"
          >
            Explore More
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- One-of-a-kind Collection Section -->
    <div class="py-16 bg-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column - Image -->
          <div class="order-2 lg:order-1">
            <img 
              :src="getImageSrc(adminStore.rareDynastyCollection?.image_url || '/src/assets/tea_image/rare-dynasty.png')" 
              alt="Rare Dynasty Collection"
              class="w-full h-auto object-cover"
            />
        </div>

          <!-- Right Column - Text and Button -->
          <div class="order-1 lg:order-2 text-left">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">{{ adminStore.rareDynastyCollection?.title_en || 'Explore by Dynasty' }}</h2>
            <p class="text-lg text-white mb-8 leading-relaxed">
              {{ adminStore.rareDynastyCollection?.content_en || 'Exclusive works from ancient Chinese dynasties' }}
            </p>
          <router-link 
            to="/products" 
              class="inline-block text-white px-8 py-4 font-medium transition-all duration-300" 
              style="background-color: #C7A77E; border-radius: 4px;"
          >
              {{ adminStore.rareDynastyCollection?.button_text_en || 'Explore Collection' }}
          </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Shop by Dynasty Section -->
    <div class="py-16 bg-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Explore by Dynasty</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <router-link 
            to="/products?dynasty=1" 
            class="group text-center hover:opacity-80 transition-opacity"
          >
            <div class="aspect-square bg-gray-800 mb-4 overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.dynastyImages[0])" 
                alt="Tang Dynasty"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="font-medium text-white">Tang Dynasty</div>
          </router-link>

          <router-link 
            to="/products?dynasty=2" 
            class="group text-center hover:opacity-80 transition-opacity"
          >
            <div class="aspect-square bg-gray-800 mb-4 overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.dynastyImages[1])" 
                alt="Song Dynasty"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="font-medium text-white">Song Dynasty</div>
          </router-link>

          <router-link 
            to="/products?dynasty=3" 
            class="group text-center hover:opacity-80 transition-opacity"
          >
            <div class="aspect-square bg-gray-800 mb-4 overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.dynastyImages[2])" 
                alt="Yuan Dynasty"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="font-medium text-white">Yuan Dynasty</div>
          </router-link>

          <router-link 
            to="/products?dynasty=4" 
            class="group text-center hover:opacity-80 transition-opacity"
          >
            <div class="aspect-square bg-gray-800 mb-4 overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.dynastyImages[3])" 
                alt="Ming Dynasty"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="font-medium text-white">Ming Dynasty</div>
          </router-link>

          <router-link 
            to="/products?dynasty=5" 
            class="group text-center hover:opacity-80 transition-opacity"
          >
            <div class="aspect-square bg-gray-800 mb-4 overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.dynastyImages[4])" 
                alt="Qing Dynasty"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="font-medium text-white">Qing Dynasty</div>
          </router-link>

        </div>
      </div>
    </div>

    <!-- Heritage Story Section -->
    <div class="py-16 bg-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <h2 class="text-3xl lg:text-4xl font-bold">
              {{ adminStore.heritageStory?.title_en || 'Forget Mass Production' }}
            </h2>
            <p class="text-lg text-gray-300 leading-relaxed">
              {{ adminStore.heritageStory?.content_en || 'Discover the rich history and craftsmanship behind each piece' }}
            </p>
            <p class="text-gray-300 leading-relaxed">
              {{ adminStore.heritageStory?.description_en || 'Each piece is a unique work of art' }}
            </p>
          </div>
          
          <div class="relative">
            <div class="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                :src="getImageSrc(adminStore.heritageStory?.image_url || '/src/assets/tea_image/heritage.png')" 
                alt="Chinese Porcelain Craftsmanship"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="py-16 bg-black text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Stay Connected</h2>
        <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our community of porcelain enthusiasts and be the first to discover new arrivals and exclusive pieces from ancient Chinese dynasties.
        </p>
        <form class="max-w-md mx-auto flex gap-4">
          <input 
            type="email" 
            placeholder="E-mail"
            class="flex-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          <button 
            type="submit"
            class="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
