<template>
  <div class="min-h-screen bg-black">
    <!-- Hero Section -->
    <div class="bg-black py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">
          Chinese Porcelain Collection
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover our curated collection of authentic Chinese porcelain masterpieces from legendary dynasties and traditional craftsmanship.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters Section -->
      <div class="mb-8">
        <div class="bg-black rounded-xl shadow-sm border border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Filter Products</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <!-- Dynasty Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-300">Dynasty</label>
              <select 
                v-model="selectedDynasty"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Dynasties</option>
                <option v-for="dynasty in adminStore.dynasties" :key="dynasty.id" :value="dynasty.id">
                  {{ dynasty.name }} ({{ dynasty.period }})
                </option>
              </select>
            </div>

            <!-- Shape Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-300">Shape</label>
              <select 
                v-model="selectedShape"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Shapes</option>
                <option v-for="shape in adminStore.shapes" :key="shape.id" :value="shape.id">
                  {{ shape.name }}
                </option>
              </select>
            </div>

            <!-- Price Range Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-300">Price Range</label>
              <select 
                v-model="selectedPriceRange"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Prices</option>
                <option value="0-100">Under $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300+">$300+</option>
              </select>
            </div>

            <!-- Age Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-300">Age</label>
              <select 
                v-model="selectedAge"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Ages</option>
                <option value="Modern">Modern</option>
                <option value="Antique">Antique</option>
                <option value="Vintage">Vintage</option>
              </select>
            </div>

            <!-- Featured Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-300">Special</label>
              <button 
                @click="toggleFeaturedFilter"
                :class="[
                  'w-full px-3 py-2 text-sm rounded-lg border transition-colors',
                  showFeaturedOnly 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                ]"
              >
                {{ showFeaturedOnly ? 'Featured ✓' : 'Featured Only' }}
              </button>
            </div>
          </div>

          <!-- Clear Filters -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-400">
              {{ displayProducts.length }} products found
            </div>
            <div class="flex space-x-2">
              <button 
                @click="refreshProducts"
                class="text-sm text-green-600 hover:text-green-800 font-medium transition-colors flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                v-if="hasActiveFilters"
                @click="clearAllFilters"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productsStore.loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p class="text-neutral-600">Loading...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="productsStore.error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-neutral-600 mb-4">Error loading products</p>
        <button 
          @click="loadProducts"
          class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else-if="displayProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in displayProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-neutral-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-neutral-600 text-lg">No products found matching your criteria.</p>
        <p class="text-neutral-500 text-sm">Try adjusting your filters or browse all products.</p>
      </div>

      <!-- Pagination -->
      <div v-if="productsStore.totalPages > 1" class="flex justify-center items-center mt-12 space-x-2">
        <button 
          @click="changePage(productsStore.currentPage - 1)"
          :disabled="productsStore.currentPage === 1"
          class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div class="flex space-x-1">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              page === productsStore.currentPage
                ? 'bg-primary-600 text-white'
                : 'text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="changePage(productsStore.currentPage + 1)"
          :disabled="productsStore.currentPage === productsStore.totalPages"
          class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '@/stores/products'
import { useAdminStore } from '@/stores/admin'
import ProductCard from '@/components/ProductCard.vue'

const { locale } = useI18n()
const productsStore = useProductsStore()
const adminStore = useAdminStore()

const selectedDynasty = ref('')
const selectedShape = ref('')
const selectedPriceRange = ref('')
const selectedAge = ref('')
const showFeaturedOnly = ref(false)

const hasActiveFilters = computed(() => 
  selectedDynasty.value || selectedShape.value || selectedPriceRange.value || selectedAge.value || showFeaturedOnly.value
)

const visiblePages = computed(() => {
  const current = productsStore.currentPage
  const total = productsStore.totalPages
  const pages = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

async function loadProducts() {
  await productsStore.fetchProducts(productsStore.currentPage, productsStore.itemsPerPage)
}

function applyFilters() {
  const filters: any = {}
  
  if (selectedDynasty.value) {
    filters.dynasty_id = parseInt(selectedDynasty.value)
  }
  
  if (selectedShape.value) {
    filters.shape_id = parseInt(selectedShape.value)
  }
  
  if (selectedPriceRange.value) {
    const [min, max] = selectedPriceRange.value.split('-')
    if (max === '+') {
      filters.min_price = parseInt(min)
    } else {
      filters.min_price = parseInt(min)
      filters.max_price = parseInt(max)
    }
  }
  
  if (selectedAge.value) {
    filters.age = selectedAge.value
  }
  
  if (showFeaturedOnly.value) {
    filters.is_featured = true
  }
  
  // Apply filters to adminStore products
  adminStore.setFilters(filters)
}

function toggleFeaturedFilter() {
  showFeaturedOnly.value = !showFeaturedOnly.value
  applyFilters()
}

function clearAllFilters() {
  selectedDynasty.value = ''
  selectedShape.value = ''
  selectedPriceRange.value = ''
  selectedAge.value = ''
  showFeaturedOnly.value = false
  adminStore.clearFilters()
}

async function refreshProducts() {
  console.log('Refreshing products from adminStore...')
  await adminStore.loadAllData()
  refreshTrigger.value++
  console.log('Products refreshed:', adminStore.products.length)
}

async function changePage(page: number | string) {
  const pageNum = typeof page === 'string' ? parseInt(page) : page
  if (isNaN(pageNum) || pageNum < 1 || pageNum > productsStore.totalPages) return
  
  productsStore.currentPage = pageNum
  await loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Force refresh trigger
const refreshTrigger = ref(0)

// Watch for changes in adminStore products
watch(() => adminStore.products, (newProducts, oldProducts) => {
  console.log('AdminStore products changed:', {
    old: oldProducts?.length || 0,
    new: newProducts.length,
    products: newProducts.map(p => ({ id: p.id, name: p.name_en || p.name_cn }))
  })
  
  // Force reactivity update by incrementing refresh trigger
  refreshTrigger.value++
}, { deep: true })

// Computed property that depends on both products and refresh trigger
const displayProducts = computed(() => {
  // This will trigger when either products or refreshTrigger changes
  refreshTrigger.value // This line ensures reactivity
  return adminStore.filteredProducts
})

// Watch for changes in adminStore products and refresh
watch(() => adminStore.products, (newProducts) => {
  console.log('AdminStore products changed:', newProducts.length)
  refreshTrigger.value++
}, { deep: true })

onMounted(async () => {
  // Ensure adminStore is initialized first and wait for it to complete
  await adminStore.loadAllData()
  
  // Use adminStore products as configured in admin panel
  console.log('Using adminStore products:', adminStore.products.length)
  console.log('AdminStore products details:', adminStore.products.map(p => ({ id: p.id, name: p.name_en, image: p.primary_image })))
  
  // Clear any existing products from productsStore to avoid confusion
  productsStore.products = []
  console.log('Cleared productsStore products, now has:', productsStore.products.length)
  
  // Check for URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const dynastyParam = urlParams.get('dynasty')
  const shapeParam = urlParams.get('shape')
  
  if (dynastyParam) {
    selectedDynasty.value = dynastyParam
  }
  if (shapeParam) {
    selectedShape.value = shapeParam
  }
  
  // Apply filters if any URL parameters exist
  if (dynastyParam || shapeParam) {
    applyFilters()
  }
})
</script>

<style scoped>
select {
  background-image: none;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

/* Responsive Grid */
@media (max-width: 1024px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .gap-4 {
    gap: 0.5rem;
  }
  
  .space-x-4 {
    margin-left: 0;
    margin-right: 0;
  }
  
  .space-x-4 > * {
    margin-left: 0;
    margin-right: 0;
  }
}

@media (max-width: 640px) {
  .xl\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .py-16 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .text-4xl {
    font-size: 1.875rem;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

<style>
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flex-wrap {
    flex-wrap: wrap;
  }
  
  .gap-4 {
    gap: 0.5rem;
  }
  
  .space-x-4 {
    margin-left: 0;
    margin-right: 0;
  }
  
  .space-x-4 > * {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

<style>
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .py-16 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}
</style>

<style>
@media (max-width: 480px) {
  .text-4xl {
    font-size: 1.875rem;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>