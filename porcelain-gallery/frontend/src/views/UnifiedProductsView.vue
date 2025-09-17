<!-- 统一产品页面 - 替换所有混乱的产品显示代码 -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('products.title') }}</h1>
        <p class="mt-2 text-gray-600">{{ $t('products.subtitle') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap gap-4">
          <!-- Dynasty Filter -->
          <select
            v-model="selectedDynasty"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">{{ $t('products.filters.allDynasties') }}</option>
            <option value="Tang Dynasty">Tang Dynasty</option>
            <option value="Song Dynasty">Song Dynasty</option>
            <option value="Yuan Dynasty">Yuan Dynasty</option>
            <option value="Ming Dynasty">Ming Dynasty</option>
            <option value="Qing Dynasty">Qing Dynasty</option>
            <option value="Modern">Modern</option>
          </select>

          <!-- Shape Filter -->
          <select
            v-model="selectedShape"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">{{ $t('products.filters.allShapes') }}</option>
            <option value="Vase">Vase</option>
            <option value="Bowl">Bowl</option>
            <option value="Plate">Plate</option>
            <option value="Teapot">Teapot</option>
            <option value="Bottle">Bottle</option>
            <option value="Bracelet">Bracelet</option>
          </select>

          <!-- Price Range Filter -->
          <select
            v-model="selectedPriceRange"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">{{ $t('products.filters.allPrices') }}</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-300">$200 - $300</option>
            <option value="300+">$300+</option>
          </select>

          <!-- Age Filter -->
          <select
            v-model="selectedAge"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">{{ $t('products.filters.allAges') }}</option>
            <option value="Modern">Modern</option>
            <option value="Antique">Antique</option>
          </select>

          <!-- Featured Only -->
          <label class="flex items-center">
            <input
              v-model="showFeaturedOnly"
              @change="applyFilters"
              type="checkbox"
              class="mr-2"
            />
            {{ $t('products.filters.featuredOnly') }}
          </label>

          <!-- Clear Filters -->
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            {{ $t('products.filters.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">{{ $t('products.loading') }}</p>
      </div>

      <!-- No Products -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
        <p class="text-gray-600">{{ $t('products.noProducts') }}</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Product Image -->
          <div class="aspect-w-16 aspect-h-9">
            <UnifiedImage
              :src="product.primary_image"
              :alt="product.name_en"
              class="w-full h-48 object-cover"
              @click="goToProduct(product.id)"
            />
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ locale === 'zh' ? product.name_cn : product.name_en }}
            </h3>
            <p class="text-gray-600 text-sm mb-2">
              {{ locale === 'zh' ? product.description_cn : product.description_en }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-red-600">${{ product.price }}</span>
              <span class="text-sm text-gray-500">{{ product.dynasty_name }}</span>
            </div>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ product.shape_name }}</span>
              <span class="text-sm text-gray-500">{{ product.age }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium',
              page === currentPage
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUnifiedData } from '../config/data-manager'
import UnifiedImage from '../components/UnifiedImage.vue'

const router = useRouter()
const { locale } = useI18n()
const { products, initialize, getImageUrl } = useUnifiedData()

// 响应式数据
const loading = ref(true)
const selectedDynasty = ref('')
const selectedShape = ref('')
const selectedPriceRange = ref('')
const selectedAge = ref('')
const showFeaturedOnly = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

// 计算属性
const hasActiveFilters = computed(() => 
  selectedDynasty.value || selectedShape.value || selectedPriceRange.value || selectedAge.value || showFeaturedOnly.value
)

const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedDynasty.value) {
    filtered = filtered.filter(p => p.dynasty_name === selectedDynasty.value)
  }

  if (selectedShape.value) {
    filtered = filtered.filter(p => p.shape_name === selectedShape.value)
  }

  if (selectedPriceRange.value) {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    if (max) {
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    } else {
      filtered = filtered.filter(p => p.price >= min)
    }
  }

  if (selectedAge.value) {
    filtered = filtered.filter(p => p.age === selectedAge.value)
  }

  if (showFeaturedOnly.value) {
    filtered = filtered.filter(p => p.is_featured)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredProducts.value.slice(startIndex, endIndex)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  selectedDynasty.value = ''
  selectedShape.value = ''
  selectedPriceRange.value = ''
  selectedAge.value = ''
  showFeaturedOnly.value = false
  currentPage.value = 1
}

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}

// 生命周期
onMounted(async () => {
  try {
    await initialize()
    console.log('UnifiedProductsView initialized with', products.value.length, 'products')
  } catch (error) {
    console.error('Error initializing UnifiedProductsView:', error)
  } finally {
    loading.value = false
  }
})

// 监听过滤器变化
watch([selectedDynasty, selectedShape, selectedPriceRange, selectedAge, showFeaturedOnly], () => {
  applyFilters()
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-h-9 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
