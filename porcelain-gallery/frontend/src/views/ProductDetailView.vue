<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useCartStore } from '@/stores/cart'
import { getImageSrc, handleImageError } from '@/utils/image-utils'
import SuccessToast from '@/components/SuccessToast.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const cartStore = useCartStore()

// Success toast state
const showSuccessToast = ref(false)
const successMessage = ref('')

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

const loading = ref(false)
const error = ref<string | null>(null)
const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const currentImageIndex = ref(0)
const activeTab = ref('about')

// Hardcoded product data matching the database
const hardcodedProducts = [
  {
    id: 9,
    name_en: "Landscape Jasper Bracelet IV (42mm)",
    name_cn: "风景碧玉手链 IV (42mm)",
    description_en: "Beautiful landscape jasper bracelet with natural patterns",
    description_cn: "美丽的风景碧玉手链，具有天然图案",
    craftsmanship_en: "Handcrafted from natural landscape jasper",
    craftsmanship_cn: "由天然风景碧玉手工制作",
    history_en: "Landscape jasper is known for its natural beauty",
    history_cn: "风景碧玉以其天然美感而闻名",
    price: 211.00,
    dynasty_id: 1,
    shape_id: 1,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png",
    images: [{
      id: 13,
      product_id: 9,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Landscape Jasper Bracelet IV (42mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png"]
  },
  {
    id: 10,
    name_en: "Dragon Blood Jasper V (4mm)",
    name_cn: "龙血碧玉 V (4mm)",
    description_en: "Powerful dragon blood jasper bracelet",
    description_cn: "强大的龙血碧玉手链",
    craftsmanship_en: "Handcrafted from dragon blood jasper",
    craftsmanship_cn: "由龙血碧玉手工制作",
    history_en: "Dragon blood jasper is known for its protective properties",
    history_cn: "龙血碧玉以其保护特性而闻名",
    price: 275.00,
    dynasty_id: 2,
    shape_id: 2,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png",
    images: [{
      id: 14,
      product_id: 10,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Dragon Blood Jasper V (4mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758089165792-528600025.png"]
  },
  {
    id: 11,
    name_en: "Landscape Jasper Bracelet VII (6mm)",
    name_cn: "风景碧玉手链 VII (6mm)",
    description_en: "Elegant landscape jasper bracelet featuring natural earth tones and intricate patterns. Each piece is unique, showcasing the natural beauty of landscape jasper stone.",
    description_cn: "优雅的风景碧玉手链",
    craftsmanship_en: "Handcrafted from premium landscape jasper with meticulous attention to detail. Each bead is carefully selected and polished to perfection.",
    craftsmanship_cn: "由优质风景碧玉手工制作",
    history_en: "Landscape jasper has been treasured for centuries for its natural beauty and grounding properties. This premium quality bracelet represents the finest examples of this remarkable stone.",
    history_cn: "优质风景碧玉",
    price: 285.00,
    dynasty_id: 3,
    shape_id: 3,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png",
    images: [{
      id: 15,
      product_id: 11,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Landscape Jasper Bracelet VII (6mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/media_library/product/media_1758088384420-107499404.png"]
  },
  {
    id: 12,
    name_en: "Camel-Turquoise Hematite Bracelet V (4mm)",
    name_cn: "骆驼绿松石赤铁矿手链 V (4mm)",
    description_en: "Unique camel-turquoise hematite bracelet",
    description_cn: "独特的骆驼绿松石赤铁矿手链",
    craftsmanship_en: "Handcrafted from camel-turquoise hematite",
    craftsmanship_cn: "由骆驼绿松石赤铁矿手工制作",
    history_en: "Camel-turquoise hematite is a rare combination",
    history_cn: "骆驼绿松石赤铁矿是罕见的组合",
    price: 185.00,
    dynasty_id: 1,
    shape_id: 1,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png",
    images: [{
      id: 16,
      product_id: 12,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Camel-Turquoise Hematite Bracelet V (4mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/23.png"]
  },
  {
    id: 13,
    name_en: "Amethyst Bracelet XVII (6mm)",
    name_cn: "紫水晶手链 XVII (6mm)",
    description_en: "Beautiful amethyst bracelet",
    description_cn: "美丽的紫水晶手链",
    craftsmanship_en: "Handcrafted from natural amethyst",
    craftsmanship_cn: "由天然紫水晶手工制作",
    history_en: "Amethyst is known for its spiritual properties",
    history_cn: "紫水晶以其精神特性而闻名",
    price: 195.00,
    dynasty_id: 2,
    shape_id: 2,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png",
    images: [{
      id: 17,
      product_id: 13,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Amethyst Bracelet XVII (6mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png"]
  },
  {
    id: 14,
    name_en: "Tiger Eye Bracelet I (6mm)",
    name_cn: "虎眼石手链 I (6mm)",
    description_en: "Powerful tiger eye bracelet",
    description_cn: "强大的虎眼石手链",
    craftsmanship_en: "Handcrafted from tiger eye stone",
    craftsmanship_cn: "由虎眼石手工制作",
    history_en: "Tiger eye is known for its protective energy",
    history_cn: "虎眼石以其保护能量而闻名",
    price: 205.00,
    dynasty_id: 3,
    shape_id: 3,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png",
    images: [{
      id: 18,
      product_id: 14,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Tiger Eye Bracelet I (6mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png"]
  },
  {
    id: 15,
    name_en: "Landscape Jasper Bracelet IV (4mm)",
    name_cn: "风景碧玉手链 IV (4mm)",
    description_en: "Compact landscape jasper bracelet",
    description_cn: "紧凑的风景碧玉手链",
    craftsmanship_en: "Handcrafted from premium landscape jasper",
    craftsmanship_cn: "由优质风景碧玉手工制作",
    history_en: "Compact design for everyday wear",
    history_cn: "紧凑设计适合日常佩戴",
    price: 255.00,
    dynasty_id: 1,
    shape_id: 1,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png",
    images: [{
      id: 19,
      product_id: 15,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Landscape Jasper Bracelet IV (4mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png"]
  },
  {
    id: 16,
    name_en: "Dragon Blood Jasper V (4mm)",
    name_cn: "龙血碧玉 V (4mm)",
    description_en: "Premium dragon blood jasper bracelet",
    description_cn: "优质龙血碧玉手链",
    craftsmanship_en: "Handcrafted from premium dragon blood jasper",
    craftsmanship_cn: "由优质龙血碧玉手工制作",
    history_en: "Premium quality for collectors",
    history_cn: "优质品质适合收藏",
    price: 275.00,
    dynasty_id: 2,
    shape_id: 2,
    primary_image: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png",
    images: [{
      id: 20,
      product_id: 16,
      image_url: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png",
      alt_text: null,
      caption: null,
      is_primary: 1,
      sort_order: 0,
      file_size: null,
      mime_type: null,
      width: null,
      height: null,
      created_at: "2025-09-17T07:12:48.000Z"
    }],
    is_featured: true,
    is_available: true,
    name: "Dragon Blood Jasper V (4mm)",
    mainImage: "https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png",
    thumbnails: ["https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png"]
  }
]

// Load product by ID
async function loadProduct() {
  loading.value = true
  error.value = null
  
  try {
    const productId = parseInt(route.params.id as string)
    console.log('loadProduct called - route.params.id:', route.params.id)
    console.log('loadProduct called - route.fullPath:', route.fullPath)
    console.log('loadProduct called - parsed productId:', productId)
    
    // First try to find product in admin store
    let foundProduct = adminStore.products.find(p => p.id === productId)
    
    // If not found in admin store, try hardcoded data as fallback
    if (!foundProduct) {
      foundProduct = hardcodedProducts.find(p => p.id === productId)
      console.log('Product not found in admin store, trying hardcoded data')
    }
    
    if (foundProduct) {
      product.value = foundProduct as Product
      console.log('Product loaded:', foundProduct.name_en)
      
      // Load related products randomly from bestsellers (excluding current product)
      const bestSellersProducts = adminStore.bestSellersProducts || []
      const availableProducts = bestSellersProducts.filter(p => p.id !== productId)
      
      // Shuffle array and take first 4 products
      const shuffledProducts = availableProducts.sort(() => Math.random() - 0.5)
      relatedProducts.value = shuffledProducts.slice(0, 4)
      
      console.log('Related products loaded from bestsellers:', relatedProducts.value.length)
    } else {
      error.value = 'Product not found'
      console.error('Product not found:', productId)
      console.log('Available product IDs in admin store:', adminStore.products.map(p => p.id))
      console.log('Available product IDs in hardcoded:', hardcodedProducts.map(p => p.id))
    }
  } catch (err) {
    error.value = 'Error loading product'
    console.error('Error loading product:', err)
  } finally {
    loading.value = false
  }
}

// Computed properties
const productImages = computed(() => {
  if (!product.value) {
    console.log('ProductDetailView - No product loaded')
    return []
  }
  
  console.log('ProductDetailView - Product loaded:', product.value.id, product.value.name_en)
  
  // Get images from product data
  const productImages = product.value.images || []
  console.log('ProductDetailView - Product images:', productImages)
  
  // Get additional images from bestsellers if available
  const bestSellerProduct = adminStore.bestSellersProducts.find(p => p.id === product.value?.id)
  console.log('ProductDetailView - Best seller product found:', bestSellerProduct)
  
  let additionalImages = bestSellerProduct?.thumbnails || []
  console.log('ProductDetailView - Additional images from bestseller:', additionalImages)
  
  // If no bestseller product found, use sample images for demonstration
  if (!bestSellerProduct && product.value?.id === 11) {
    additionalImages = [
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/6.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/7.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/8.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/9.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/10.png'
    ]
    console.log('ProductDetailView - Using sample images for product 11:', additionalImages)
  }
  
  // Combine product images with additional images
  const allImages = [...productImages]
  
  // Add additional images from bestsellers or sample images
  additionalImages.forEach((imageUrl: string, index: number) => {
    if (imageUrl && !allImages.some(img => img.image_url === imageUrl)) {
      allImages.push({
        id: `additional_${index}`,
        product_id: product.value?.id || 0,
        image_url: imageUrl,
        alt_text: null,
        caption: null,
        is_primary: 0,
        sort_order: allImages.length,
        file_size: null,
        mime_type: null,
        width: null,
        height: null,
        created_at: new Date().toISOString()
      })
    }
  })
  
  console.log('ProductDetailView - Final allImages:', allImages)
  console.log('ProductDetailView - All images count:', allImages.length)
  
  return allImages
})

const primaryImage = computed(() => {
  if (!product.value) return ''
  return product.value.primary_image || product.value.mainImage || ''
})

const formattedPrice = computed(() => {
  if (!product.value) return '$0.00'
  const price = typeof product.value.price === 'string' ? 
    parseFloat(product.value.price) : product.value.price
  return `$${price.toFixed(2)}`
})

const currentImage = computed(() => {
  if (!product.value) {
    console.log('ProductDetailView - currentImage: No product loaded')
    return ''
  }
  
  const images = productImages.value
  console.log('ProductDetailView - currentImage: Available images:', images.length)
  console.log('ProductDetailView - currentImage: Current index:', currentImageIndex.value)
  
  if (images.length === 0) {
    const primaryImg = primaryImage.value
    console.log('ProductDetailView - currentImage: No images, using primary:', primaryImg)
    return primaryImg
  }
  
  const currentImg = images[currentImageIndex.value]?.image_url || primaryImage.value
  console.log('ProductDetailView - currentImage: Selected image:', currentImg)
  return currentImg
})

// Watch for route changes
watch(() => route.params.id, () => {
  loadProduct()
})

onMounted(async () => {
  // Load admin store data first
  await adminStore.loadAllData()
  // Then load the specific product
  loadProduct()
})

function goToProduct(productId: number) {
  router.push(`/products/${productId}`)
}

function addToCart() {
  if (product.value) {
    cartStore.addToCart(product.value)
    console.log('Added to cart:', product.value.name_en)
    
    // Show success toast
    successMessage.value = 'Added to cart successfully'
    showSuccessToast.value = true
  }
}

function addRelatedProductToCart(relatedProduct: any, event: Event) {
  event.stopPropagation() // 阻止事件冒泡，避免触发 goToProduct
  cartStore.addToCart(relatedProduct)
  console.log('Added related product to cart:', relatedProduct.name_en)
  
  // Show success toast
  successMessage.value = 'Added to cart successfully'
  showSuccessToast.value = true
}

function nextImage() {
  const images = productImages.value
  if (images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }
}

function prevImage() {
  const images = productImages.value
  if (images.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 ? images.length - 1 : currentImageIndex.value - 1
  }
}

function selectImage(index: number) {
  currentImageIndex.value = index
}

function setActiveTab(tab: string) {
  activeTab.value = tab
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen bg-black">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p class="mt-2 text-white">Loading...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen bg-black">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-white mb-4">Error occurred</h1>
        <p class="text-gray-300 mb-4">{{ error }}</p>
        <button 
          @click="router.push('/')"
          class="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-4">
          <li>
            <button @click="router.push('/')" class="text-gray-400 hover:text-white">
              Home
            </button>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <button @click="router.push('/products')" class="ml-4 text-gray-400 hover:text-white">
                Products
              </button>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-4 text-gray-300">{{ product.name_en }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Product Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="relative aspect-square overflow-hidden rounded-lg bg-gray-900 group">
            <img 
              :src="getImageSrc(currentImage)" 
              :alt="product.name_en"
              @error="handleImageError"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            <!-- Image Navigation -->
            <div v-if="productImages.length > 1" class="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                @click="prevImage"
                class="ml-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                @click="nextImage"
                class="mr-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Color/Style Variants - Using Additional Images data -->
          <div v-if="productImages.length > 0" class="space-y-4">
            <h3 class="text-sm font-medium text-white">Color/Style Options</h3>
            <div class="flex space-x-3">
              <div 
                v-for="(image, index) in productImages.slice(0, 6)" 
                :key="image.id"
                @click="selectImage(index)"
                :class="[
                  'w-12 h-12 rounded-full cursor-pointer transition-all duration-200 border-2 overflow-hidden',
                  currentImageIndex === index ? 'border-white' : 'border-gray-600 hover:border-gray-400'
                ]"
              >
                <img 
                  :src="getImageSrc(image.image_url)" 
                  :alt="image.alt_text || product.name_en"
                  @error="handleImageError"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <!-- Additional Product Images -->
          <div v-if="productImages.length > 1" class="space-y-4">
            <h3 class="text-sm font-medium text-white">Product Views</h3>
            <div class="flex space-x-2 overflow-x-auto pb-2">
              <div 
                v-for="(image, index) in productImages.slice(0, 5)" 
              :key="image.id"
                @click="selectImage(index)"
                :class="[
                  'flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-900 cursor-pointer transition-all duration-200',
                  currentImageIndex === index ? 'ring-2 ring-white' : 'hover:ring-2 hover:ring-gray-400'
                ]"
            >
              <img 
                :src="getImageSrc(image.image_url)" 
                :alt="image.alt_text || product.name_en"
                @error="handleImageError"
                class="w-full h-full object-cover"
              />
              </div>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-8 text-white">
          <!-- Product Title and Price -->
          <div>
            <h1 class="text-4xl font-bold text-white mb-4">
              {{ product.name_en }}
            </h1>
            <div class="flex items-center space-x-4 mb-6">
              <div class="flex items-center space-x-2">
                <span class="text-3xl font-bold text-white">{{ formattedPrice }}</span>
              </div>
            </div>
            <div class="flex items-center mb-6">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-400">(26 reviews)</span>
            </div>
          </div>

          <!-- Product Attributes -->
          <div class="p-4">
            <h3 class="font-semibold text-white mb-4">Specifications</h3>
            <div class="space-y-0">
              <!-- Dynasty -->
              <div class="flex justify-between items-center py-2 border-b border-gray-600">
                <span class="text-sm font-medium text-white">Dynasty:</span>
                <span :class="[
                  'text-sm',
                  product.dynasty_name ? 'text-white' : 'text-gray-500'
                ]">
                  {{ product.dynasty_name || 'No data available' }}
                </span>
              </div>
              
              <!-- Shape -->
              <div class="flex justify-between items-center py-2 border-b border-gray-600">
                <span class="text-sm font-medium text-white">Shape:</span>
                <span :class="[
                  'text-sm',
                  product.shape_name ? 'text-white' : 'text-gray-500'
                ]">
                  {{ product.shape_name || 'No data available' }}
                </span>
              </div>
              
              <!-- Dimensions -->
              <div class="flex justify-between items-center py-2 border-b border-gray-600">
                <span class="text-sm font-medium text-white">Dimensions:</span>
                <span :class="[
                  'text-sm',
                  product.dimensions ? 'text-white' : 'text-gray-500'
                ]">
                  {{ product.dimensions || 'No data available' }}
                </span>
              </div>
              
              <!-- Material -->
              <div class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-white">Material:</span>
                <span :class="[
                  'text-sm',
                  product.material ? 'text-white' : 'text-gray-500'
                ]">
                  {{ product.material || 'No data available' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <div class="space-y-4">
            <button 
              @click="addToCart"
              class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300"
            >
              ADD TO CART
            </button>
            <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300">
              Buy with shop
            </button>
            <p class="text-center text-sm text-gray-400">More payment options</p>
          </div>

          <!-- Key Features -->
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-300">Tailored to Your Wrist Size</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-gray-300">Free UPS Shipping & Returns</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-gray-300">Over 10.000+ Verified Reviews</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-gray-300">Made in The Netherlands Since 2015</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span class="text-sm text-gray-300">Free Resizing For New Customers</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information Tabs -->
      <div class="mt-16">
        <div class="border-b border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="setActiveTab('about')"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'about' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
              ]"
            >
              ABOUT
            </button>
            <button 
              @click="setActiveTab('specifications')"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'specifications' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
              ]"
            >
              SPECIFICATIONS
            </button>
            <button 
              @click="setActiveTab('shipping')"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'shipping' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
              ]"
            >
              SHIPPING & RETURN
            </button>
          </nav>
        </div>

        <div class="mt-8">
          <!-- About Tab -->
          <div v-if="activeTab === 'about'" class="prose max-w-none">
            <p class="text-gray-300 leading-relaxed text-lg">
              Complete your outfit with our {{ product.name_en.toLowerCase() }}. Handcrafted in The Netherlands by professional artisans with the best Nature has to offer and finished with 925 Sterling Silver.
            </p>
          </div>

          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specifications'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Gems</h3>
              <ul class="list-disc list-inside text-gray-300 space-y-1">
                <li>Miyuki glass</li>
                <li>Stone Size: Medium (06-08mm)</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Specifications</h3>
              <ul class="text-gray-300 space-y-2">
                <li><strong>Version:</strong> Slip-on Bracelet</li>
                <li><strong>Cord:</strong> High-end elastic silicone</li>
                <li><strong>Precious Metal:</strong> 925 Sterling silver</li>
                <li><strong>Packaging:</strong> Comes with linen pouch</li>
              </ul>
            </div>
          </div>

          <!-- Shipping Tab -->
          <div v-if="activeTab === 'shipping'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Free Shipping on All Orders</h3>
              <p class="text-gray-300">Bracelet are handcrafted within 2–3 business days.</p>
              <p class="text-gray-300">U.S. delivery: 1–2 days. International delivery: 1–5 days.</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">30 Days Free Return Guarantee</h3>
              <p class="text-gray-300">Return in original condition if it's not exactly what you had in mind.</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">Free Resize for 1st Order</h3>
              <p class="text-gray-300">We know getting the perfect fit can be tricky, that's why we offer complimentary resizing on your first order.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-white mb-8">TOP PICKS</h2>
        <p class="text-gray-400 mb-8">Selected just for you</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            @click="goToProduct(relatedProduct.id)"
            class="group cursor-pointer bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div class="relative overflow-hidden rounded-t-lg">
              <img 
                :src="getImageSrc(relatedProduct.primary_image || relatedProduct.mainImage || '')" 
                :alt="relatedProduct.name_en"
                @error="handleImageError"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {{ relatedProduct.name_en }}
              </h3>
              <p class="text-xl font-bold text-white mb-3">
                ${{ typeof relatedProduct.price === 'string' ? relatedProduct.price : relatedProduct.price.toFixed(2) }}
              </p>
              <button 
                @click="addRelatedProductToCart(relatedProduct, $event)"
                class="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Success Toast -->
  <SuccessToast 
    :show="showSuccessToast" 
    :message="successMessage"
    @close="showSuccessToast = false"
  />
</template>

<style scoped>
/* Add any custom styles here */
</style>
