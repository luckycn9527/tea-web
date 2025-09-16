// Updated products store using backend API
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService, { type Product, type ApiResponse } from '@/services/api'

export interface Filter {
  dynasty_id?: number
  shape_id?: number
  category_id?: number
  is_featured?: boolean
  is_available?: boolean
  search?: string
  sort_by?: string
  sort_order?: string
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<Filter>({})
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const itemsPerPage = ref(12)

  // Computed
  const filteredProducts = computed(() => products.value)

  const featuredProducts = computed(() => 
    products.value.filter(p => p.is_featured)
  )

  // Actions
  async function fetchProducts(page = 1, limit = 12) {
    loading.value = true
    error.value = null
    
    try {
      const params = {
        page,
        limit,
        ...filters.value
      }

      const response: ApiResponse<Product[]> = await apiService.getProducts(params)
      
      if (response.success && response.data) {
        products.value = response.data
        currentPage.value = page
        totalPages.value = response.pagination?.totalPages || 1
        totalItems.value = response.pagination?.total || 0
        itemsPerPage.value = limit
      } else {
        error.value = response.message || 'Failed to fetch products'
        products.value = []
      }
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response: ApiResponse<Product> = await apiService.getProduct(id)
      
      if (response.success && response.data) {
        currentProduct.value = response.data
      } else {
        error.value = response.message || 'Product not found'
        currentProduct.value = null
      }
    } catch (err) {
      error.value = 'Failed to fetch product'
      console.error('Error fetching product:', err)
      currentProduct.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchProductBySlug(slug: string) {
    loading.value = true
    error.value = null
    
    try {
      const response: ApiResponse<Product> = await apiService.getProductBySlug(slug)
      
      if (response.success && response.data) {
        currentProduct.value = response.data
      } else {
        error.value = response.message || 'Product not found'
        currentProduct.value = null
      }
    } catch (err) {
      error.value = 'Failed to fetch product'
      console.error('Error fetching product:', err)
      currentProduct.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedProducts(limit = 6) {
    loading.value = true
    error.value = null
    
    try {
      const response: ApiResponse<Product[]> = await apiService.getFeaturedProducts(limit)
      
      if (response.success && response.data) {
        products.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch featured products'
        products.value = []
      }
    } catch (err) {
      error.value = 'Failed to fetch featured products'
      console.error('Error fetching featured products:', err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchRelatedProducts(productId: number, limit = 4) {
    try {
      const response: ApiResponse<Product[]> = await apiService.getRelatedProducts(productId, limit)
      
      if (response.success && response.data) {
        return response.data
      } else {
        console.error('Failed to fetch related products:', response.message)
        return []
      }
    } catch (err) {
      console.error('Error fetching related products:', err)
      return []
    }
  }

  function setFilters(newFilters: Filter) {
    filters.value = { ...newFilters }
    currentPage.value = 1
  }

  function clearFilters() {
    filters.value = {}
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setItemsPerPage(items: number) {
    itemsPerPage.value = items
    currentPage.value = 1
  }

  // Search products
  async function searchProducts(query: string) {
    if (!query.trim()) {
      await fetchProducts()
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const params = {
        search: query.trim(),
        page: 1,
        limit: itemsPerPage.value
      }

      const response: ApiResponse<Product[]> = await apiService.getProducts(params)
      
      if (response.success && response.data) {
        products.value = response.data
        currentPage.value = 1
        totalPages.value = response.pagination?.totalPages || 1
        totalItems.value = response.pagination?.total || 0
      } else {
        error.value = response.message || 'Search failed'
        products.value = []
      }
    } catch (err) {
      error.value = 'Search failed'
      console.error('Error searching products:', err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // Filter by dynasty
  async function filterByDynasty(dynastyId: number) {
    setFilters({ ...filters.value, dynasty_id: dynastyId })
    await fetchProducts(1, itemsPerPage.value)
  }

  // Filter by shape
  async function filterByShape(shapeId: number) {
    setFilters({ ...filters.value, shape_id: shapeId })
    await fetchProducts(1, itemsPerPage.value)
  }

  // Filter by category
  async function filterByCategory(categoryId: number) {
    setFilters({ ...filters.value, category_id: categoryId })
    await fetchProducts(1, itemsPerPage.value)
  }

  // Filter featured products
  async function filterFeatured() {
    setFilters({ ...filters.value, is_featured: true })
    await fetchProducts(1, itemsPerPage.value)
  }

  // Sort products
  async function sortProducts(sortBy: string, sortOrder: 'ASC' | 'DESC' = 'DESC') {
    setFilters({ ...filters.value, sort_by: sortBy, sort_order: sortOrder })
    await fetchProducts(currentPage.value, itemsPerPage.value)
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    
    // Computed
    filteredProducts,
    featuredProducts,
    
    // Actions
    fetchProducts,
    fetchProduct,
    fetchProductBySlug,
    fetchFeaturedProducts,
    fetchRelatedProducts,
    setFilters,
    clearFilters,
    setPage,
    setItemsPerPage,
    searchProducts,
    filterByDynasty,
    filterByShape,
    filterByCategory,
    filterFeatured,
    sortProducts
  }
})