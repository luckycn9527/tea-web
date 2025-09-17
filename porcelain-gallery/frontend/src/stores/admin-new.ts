// Updated admin store using backend API
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService, { type Product, type ContentSection, type SiteSetting, type Dynasty, type Shape } from '@/services/api'

export const useAdminStore = defineStore('admin', () => {
  // State
  const products = ref<Product[]>([])
  const bestSellersProducts = ref<Product[]>([])
  const rareDynastyCollection = ref<ContentSection | null>(null)
  const heritageStory = ref<ContentSection | null>(null)
  const dynastyImages = ref<string[]>([])
  const siteSettings = ref<SiteSetting[]>([])
  const contentSections = ref<ContentSection[]>([])
  const dynasties = ref<Dynasty[]>([])
  const shapes = ref<Shape[]>([])
  const mediaLibrary = ref<any[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const featuredProducts = computed(() => 
    products.value.filter(p => p.is_featured)
  )

  const availableProducts = computed(() => 
    products.value.filter(p => p.is_available)
  )

  // Actions
  async function loadAllData() {
    loading.value = true
    error.value = null

    try {
      // Load products
      await loadProducts()
      
      // Load best sellers (featured products)
      await loadBestSellers()
      
      // Load content sections
      await loadContentSections()
      
      // Load site settings
      await loadSiteSettings()
      
      // Load dynasty images from content sections
      await loadDynastyImages()

      console.log('All admin data loaded successfully')
    } catch (err) {
      error.value = 'Failed to load admin data'
      console.error('Error loading admin data:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadProducts() {
    try {
      const response = await apiService.getProducts({ 
        is_available: true,
        limit: 100 // Load more products for admin
      })
      
      if (response.success && response.data) {
        products.value = response.data
        console.log('Loaded products from API:', products.value.length)
      } else {
        console.error('Failed to load products:', response.message)
        products.value = []
      }
    } catch (err) {
      console.error('Error loading products:', err)
      products.value = []
    }
  }

  async function loadBestSellers() {
    try {
      const response = await apiService.getFeaturedProducts(8)
      
      if (response.success && response.data) {
        bestSellersProducts.value = response.data
        console.log('Loaded best sellers from API:', bestSellersProducts.value.length)
      } else {
        console.error('Failed to load best sellers:', response.message)
        bestSellersProducts.value = []
      }
    } catch (err) {
      console.error('Error loading best sellers:', err)
      bestSellersProducts.value = []
    }
  }

  async function loadContentSections() {
    try {
      const response = await apiService.getContentSections(true)
      
      if (response.success && response.data) {
        contentSections.value = response.data
        
        // Find specific sections
        rareDynastyCollection.value = response.data.find(s => s.section_key === 'rare_dynasty_collection') || null
        heritageStory.value = response.data.find(s => s.section_key === 'heritage_story') || null
        
        console.log('Loaded content sections from API:', contentSections.value.length)
      } else {
        console.error('Failed to load content sections:', response.message)
        contentSections.value = []
      }
    } catch (err) {
      console.error('Error loading content sections:', err)
      contentSections.value = []
    }
  }

  async function loadSiteSettings() {
    try {
      const response = await apiService.getSiteSettings(false) // Load all settings for admin
      
      if (response.success && response.data) {
        siteSettings.value = response.data
        console.log('Loaded site settings from API:', siteSettings.value.length)
      } else {
        console.error('Failed to load site settings:', response.message)
        siteSettings.value = []
      }
    } catch (err) {
      console.error('Error loading site settings:', err)
      siteSettings.value = []
    }
  }

  async function loadDynastyImages() {
    try {
      // Load dynasty images from content sections or use default
      const dynastySection = contentSections.value.find(s => s.section_key === 'dynasty_images')
      
      if (dynastySection && dynastySection.content_en) {
        try {
          dynastyImages.value = JSON.parse(dynastySection.content_en)
        } catch {
          // Fallback to default images
          dynastyImages.value = [
            '/src/assets/tea_image/tang.png',
            '/src/assets/tea_image/song.png',
            '/src/assets/tea_image/yuan.png',
            '/src/assets/tea_image/ming.png',
            '/src/assets/tea_image/qing.png'
          ]
        }
      } else {
        // Use default dynasty images
        dynastyImages.value = [
          '/src/assets/tea_image/tang.png',
          '/src/assets/tea_image/song.png',
          '/src/assets/tea_image/yuan.png',
          '/src/assets/tea_image/ming.png',
          '/src/assets/tea_image/qing.png'
        ]
      }
      
      console.log('Loaded dynasty images:', dynastyImages.value.length)
    } catch (err) {
      console.error('Error loading dynasty images:', err)
      dynastyImages.value = [
        '/src/assets/tea_image/tang.png',
        '/src/assets/tea_image/song.png',
        '/src/assets/tea_image/yuan.png',
        '/src/assets/tea_image/ming.png',
        '/src/assets/tea_image/qing.png'
      ]
    }
  }

  // Helper functions
  function getProductById(id: number): Product | undefined {
    return products.value.find(p => p.id === id)
  }

  function getSettingByKey(key: string): string {
    const setting = siteSettings.value.find(s => s.setting_key === key)
    return setting?.setting_value || ''
  }

  function getContentSectionByKey(key: string): ContentSection | undefined {
    return contentSections.value.find(s => s.section_key === key)
  }

  // Refresh functions
  async function refreshProducts() {
    await loadProducts()
  }

  async function refreshBestSellers() {
    await loadBestSellers()
  }

  async function refreshContentSections() {
    await loadContentSections()
  }

  async function refreshSiteSettings() {
    await loadSiteSettings()
  }

  // Product CRUD methods
  async function addProduct(product: Omit<Product, 'id'>) {
    try {
      const response = await apiService.createProduct(product)
      if (response.success && response.data) {
        products.value.push(response.data)
        await refreshBestSellers() // Refresh best sellers after adding
        return response.data
      } else {
        throw new Error(response.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  async function updateProduct(productId: number, updates: Partial<Product>) {
    try {
      const response = await apiService.updateProduct(productId, updates)
      if (response.success && response.data) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index > -1) {
          products.value[index] = response.data
        }
        await refreshBestSellers() // Refresh best sellers after updating
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async function deleteProduct(productId: number) {
    try {
      const response = await apiService.deleteProduct(productId)
      if (response.success) {
        const index = products.value.findIndex(p => p.id === productId)
        if (index > -1) {
          products.value.splice(index, 1)
        }
        await refreshBestSellers() // Refresh best sellers after deleting
        return true
      } else {
        throw new Error(response.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  function addProductWithoutImages(product: Omit<Product, 'id'>) {
    return addProduct(product)
  }

  function addDynasty(dynasty: Omit<Dynasty, 'id'>) {
    const newDynasty: Dynasty = {
      ...dynasty,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    // Add to dynasties if we have a dynasties array
    return Promise.resolve(newDynasty)
  }

  function deleteDynasty(dynastyId: number) {
    // Implementation for deleting dynasty
  }

  function addShape(shape: Omit<Shape, 'id'>) {
    const newShape: Shape = {
      ...shape,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return Promise.resolve(newShape)
  }

  function deleteShape(shapeId: number) {
    // Implementation for deleting shape
  }

  function addMediaFile(file: File) {
    return Promise.resolve({
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      uploadDate: new Date().toISOString()
    })
  }

  function deleteMediaFile(mediaId: number) {
    // Implementation for deleting media file
  }

  function clearLocalStorage() {
    localStorage.clear()
  }

  function updateBestSellerMainImage(productIndex: number, imageUrl: string) {
    if (bestSellersProducts.value[productIndex]) {
      bestSellersProducts.value[productIndex].primary_image = imageUrl
    }
  }

  function updateBestSellerThumbnail(productIndex: number, thumbnailIndex: number, imageUrl: string) {
    // Implementation for updating thumbnail
  }

  function updateBestSellerName(productIndex: number, name: string) {
    if (bestSellersProducts.value[productIndex]) {
      bestSellersProducts.value[productIndex].name_en = name
    }
  }

  function updateBestSellerPrice(productIndex: number, price: string) {
    if (bestSellersProducts.value[productIndex]) {
      bestSellersProducts.value[productIndex].price = parseFloat(price)
    }
  }

  function updateRareDynastyTitle(title: string) {
    if (rareDynastyCollection.value) {
      rareDynastyCollection.value.title_en = title
    }
  }

  function updateRareDynastyDescription(description: string) {
    if (rareDynastyCollection.value) {
      rareDynastyCollection.value.content_en = description
    }
  }

  function updateRareDynastyButtonText(buttonText: string) {
    if (rareDynastyCollection.value) {
      rareDynastyCollection.value.button_text_en = buttonText
    }
  }

  function updateRareDynastyImage(image: string) {
    if (rareDynastyCollection.value) {
      rareDynastyCollection.value.image_url = image
    }
  }

  function updateHeritageStoryTitle(title: string) {
    if (heritageStory.value) {
      heritageStory.value.title_en = title
    }
  }

  function updateHeritageStoryDescription1(description: string) {
    if (heritageStory.value) {
      heritageStory.value.content_en = description
    }
  }

  function updateHeritageStoryDescription2(description: string) {
    // Implementation for second description
  }

  function updateHeritageStoryImage(image: string) {
    if (heritageStory.value) {
      heritageStory.value.image_url = image
    }
  }

  function saveSiteSettings(settings: SiteSetting[]) {
    siteSettings.value = settings
  }

  function saveContentSettings(settings: any) {
    // Implementation for saving content settings
  }

  // Filter methods for ProductsView
  function setFilters(filters: any) {
    // Implementation for setting filters
  }

  function clearFilters() {
    // Implementation for clearing filters
  }

  const filteredProducts = computed(() => products.value)

  return {
    // State
    products,
    bestSellersProducts,
    rareDynastyCollection,
    heritageStory,
    dynastyImages,
    siteSettings,
    contentSections,
    dynasties,
    shapes,
    mediaLibrary,
    loading,
    error,
    
    // Computed
    featuredProducts,
    availableProducts,
    
    // Actions
    loadAllData,
    loadProducts,
    loadBestSellers,
    loadContentSections,
    loadSiteSettings,
    loadDynastyImages,
    getProductById,
    getSettingByKey,
    getContentSectionByKey,
    refreshProducts,
    refreshBestSellers,
    refreshContentSections,
    refreshSiteSettings,
    
    // AdminView methods
    addProduct,
    updateProduct,
    addProductWithoutImages,
    deleteProduct,
    addDynasty,
    deleteDynasty,
    addShape,
    deleteShape,
    addMediaFile,
    deleteMediaFile,
    clearLocalStorage,
    updateBestSellerMainImage,
    updateBestSellerThumbnail,
    updateBestSellerName,
    updateBestSellerPrice,
    updateRareDynastyTitle,
    updateRareDynastyDescription,
    updateRareDynastyButtonText,
    updateRareDynastyImage,
    updateHeritageStoryTitle,
    updateHeritageStoryDescription1,
    updateHeritageStoryDescription2,
    updateHeritageStoryImage,
    saveSiteSettings,
    saveContentSettings,
    
    // Filter methods
    setFilters,
    clearFilters,
    filteredProducts
  }
})

