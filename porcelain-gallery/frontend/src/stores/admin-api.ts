// Admin store using backend API
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/api'

export const useAdminStore = defineStore('admin', () => {
  // State
  const products = ref<any[]>([])
  const bestSellersProducts = ref<any[]>([])
  
  // Function to convert bestSellersProducts to products format
  function convertBestSellersToProducts() {
    const convertedProducts: any[] = bestSellersProducts.value.map((bestSeller, index) => ({
      id: bestSeller.id,
      name_en: bestSeller.name_en || bestSeller.name,
      name_cn: bestSeller.name_cn || bestSeller.name,
      description_en: bestSeller.description_en || 'Beautiful handcrafted product',
      description_cn: bestSeller.description_cn || '精美的手工艺品',
      craftsmanship_en: bestSeller.craftsmanship_en || 'Handcrafted with traditional techniques',
      craftsmanship_cn: bestSeller.craftsmanship_cn || '采用传统工艺手工制作',
      history_en: bestSeller.history_en || 'Rich cultural heritage',
      history_cn: bestSeller.history_cn || '丰富的文化遗产',
      price: typeof bestSeller.price === 'string' ? parseFloat(bestSeller.price.replace('$', '')) : bestSeller.price,
      dimensions: bestSeller.dimensions || 'Various sizes available',
      material: bestSeller.material || 'Premium materials',
      weight: bestSeller.weight || 'Lightweight',
      age: bestSeller.age || 'Modern',
      dynasty_id: bestSeller.dynasty_id || 1,
      shape_id: bestSeller.shape_id || 1,
      dynasty_name: bestSeller.dynasty_name || 'Tang Dynasty',
      shape_name: bestSeller.shape_name || 'Vase',
      primary_image: bestSeller.mainImage || bestSeller.primary_image || '/src/assets/tea_image/1.png',
      images: bestSeller.thumbnails ? bestSeller.thumbnails.map((thumb: string, imgIndex: number) => ({
        id: imgIndex + 1,
        product_id: bestSeller.id,
        image_url: thumb,
        alt_text: null,
        caption: null,
        is_primary: imgIndex === 0 ? 1 : 0,
        sort_order: imgIndex + 1,
        file_size: null,
        mime_type: null,
        width: null,
        height: null,
        created_at: new Date().toISOString()
      })) : [],
      videos: [],
      is_featured: bestSeller.is_featured || false,
      is_available: bestSeller.is_available !== false
    }))
    
    products.value = convertedProducts
    console.log('Converted bestSellersProducts to products:', convertedProducts.length)
  }
  const rareDynastyCollection = ref<any>(null)
  const heritageStory = ref<any>(null)
  const heroConfig = ref<any>(null)
  const dynastyImages = ref<string[]>([])
  const siteSettings = ref<any[]>([])
  const contentSections = ref<any[]>([])
  const dynasties = ref<any[]>([])
  const shapes = ref<any[]>([])
  const mediaLibrary = ref<any[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authToken = ref<string | null>(null)

  // Computed
  const featuredProducts = computed(() => 
    products.value.filter(p => p.is_featured)
  )

  const availableProducts = computed(() => 
    products.value.filter(p => p.is_available)
  )

  const isAuthenticated = computed(() => !!authToken.value)

  // Actions
  async function login(username: string, password: string) {
    try {
      const response = await apiService.adminLogin(username, password)

      if (response.success && response.data?.token) {
        authToken.value = response.data.token
        localStorage.setItem('admin_token', response.data.token)
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.message || '登录失败' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: '登录失败' }
    }
  }

  function logout() {
    authToken.value = null
    localStorage.removeItem('admin_token')
  }

  function initializeAuth() {
    const token = localStorage.getItem('admin_token')
    if (token) {
      authToken.value = token
    }
  }

  async function loadAllData() {
    loading.value = true
    error.value = null

    try {
      // 对于公开页面，使用不需要认证的API
      await Promise.all([
        loadSiteSettings(),
        loadContentSections(),
        loadBestSellers(), // This will also convert to products
        loadDynasties(),
        loadDynastyImages(),
        loadShapes()
      ])
      
      console.log('All admin data loaded successfully')
      console.log('Products count after loadAllData:', products.value.length)
    } catch (err) {
      error.value = 'Failed to load admin data'
      console.error('Error loading admin data:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadProducts() {
    try {
      const response = await apiService.getProducts({ limit: 100 })
      if (response.success && response.data) {
        products.value = response.data
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  async function loadBestSellers() {
    try {
      const token = localStorage.getItem('admin_token')
      
      let response;
      if (token) {
        // Use admin API with authentication
        response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          if (handleAuthError(response)) {
            return; // Auth error handled, redirecting to login
          }
          
          // If not in admin area, fall back to public API
          console.log('Falling back to public API due to auth error');
          response = await fetch(`http://106.75.68.99:3000/api/best-sellers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      } else {
        // Use public API without authentication
        response = await fetch(`http://106.75.68.99:3000/api/best-sellers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 预处理数据，包括 thumbnails 和统一格式
          const processedData = result.data.map((product: any) => ({
            ...product,
            name: product.name_en || product.name || `Product ${product.id}`,
            name_en: product.name_en || product.name || `Product ${product.id}`,
            name_cn: product.name_cn || product.name_en || product.name || `Product ${product.id}`,
            is_featured: true,
            is_available: true,
            // 预处理 thumbnails
            thumbnails: processThumbnails(product.thumbnails || [])
          }));
          
          setBestSellersProducts(processedData);
          // Convert bestsellers to products format
          convertBestSellersToProducts();
          console.log('Loaded Best Sellers from API:', bestSellersProducts.value.length, 'products');
        }
      } else {
        console.error('Failed to load Best Sellers from API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading Best Sellers from API:', error);
    }
  }

  // 新增：设置 best sellers 产品的方法，保证响应式
  function setBestSellersProducts(data: any[]) {
    bestSellersProducts.value = [...data]; // 使用展开运算符保证响应式
  }

  // 新增：处理认证错误的通用函数
  function handleAuthError(response: Response): boolean {
    if (response.status === 401 || response.status === 403) {
      console.warn('Token expired or invalid, clearing auth data');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      authToken.value = null;
      
      // Redirect to login page if in admin area
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
        return true; // Indicates auth error was handled
      }
    }
    return false; // No auth error
  }

  // 新增：处理 thumbnails 的工具函数
  function processThumbnails(thumbnails: string[]): string[] {
    if (!thumbnails || !Array.isArray(thumbnails)) {
      return [];
    }
    
    return thumbnails.map(thumb => {
      if (!thumb || thumb === 'undefined' || thumb.includes('undefined')) {
        return '';
      }
      
      // 如果是远程 URL，直接返回
      if (thumb.startsWith('http')) {
        return thumb;
      }
      
      // 如果是本地 asset 路径，转换为正确的 URL
      if (thumb.includes('tea_image')) {
        const fileName = thumb.split('/').pop();
        if (fileName && fileName !== 'undefined') {
          return new URL(`../assets/tea_image/${fileName}`, import.meta.url).href;
        }
      }
      
      return thumb;
    }).filter(Boolean); // 过滤掉空值
  }

  async function loadContentSections() {
    try {
      const response = await apiService.getContentSections(true) // 只加载激活的内容区块
      if (response.success && response.data) {
        contentSections.value = response.data
        // Update specific content sections
        rareDynastyCollection.value = contentSections.value.find(s => s.section_key === 'rare_dynasty') || null
        heritageStory.value = contentSections.value.find(s => s.section_key === 'heritage_story') || null
      }
    } catch (error) {
      console.error('Error loading content sections:', error)
    }
  }

  async function loadSiteSettings() {
    try {
      // 对于公开页面，使用不需要认证的API
      const response = await apiService.getSiteSettings(true) // 只获取公开设置
      if (response.success && response.data) {
        siteSettings.value = response.data
        
        // 构建heroConfig对象
        const heroSettings = response.data.filter((setting: any) => 
          setting.setting_key.startsWith('hero_')
        )
        
        if (heroSettings.length > 0) {
          heroConfig.value = {
            title: heroSettings.find((s: any) => s.setting_key === 'hero_main_title')?.setting_value || 'Welcome to Chinese Porcelain Gallery',
            subtitle: heroSettings.find((s: any) => s.setting_key === 'hero_subtitle')?.setting_value || 'Discover the beauty of ancient Chinese ceramics',
            backgroundImage: heroSettings.find((s: any) => s.setting_key === 'hero_background_image')?.setting_value || '/src/assets/hero-bg.jpg',
            features: heroSettings.find((s: any) => s.setting_key === 'hero_features')?.setting_value ? 
              JSON.parse(heroSettings.find((s: any) => s.setting_key === 'hero_features').setting_value) : 
              ['Authentic Antiques', 'Artisan Craftsmanship', 'Rich History']
          }
        }
      }
    } catch (error) {
      console.error('Error loading site settings:', error)
    }
  }

  async function loadDynasties() {
    try {
      const response = await apiService.getDynasties()
      if (response.success && response.data) {
        dynasties.value = response.data
        dynastyImages.value = response.data.map((d: any) => d.image_url).filter(Boolean) as string[]
        console.log('Loaded dynasties:', dynasties.value.length, 'items')
      }
    } catch (error) {
      console.error('Error loading dynasties:', error)
    }
  }

  async function loadDynastyImages() {
    try {
      const response = await apiService.getDynasties()
      if (response.success && response.data) {
        // 只更新dynastyImages，不覆盖dynasties
        dynastyImages.value = response.data.map((d: any) => d.image_url).filter(Boolean) as string[]
        console.log('Loaded dynasty images:', dynastyImages.value.length, 'images')
      }
    } catch (error) {
      console.error('Error loading dynasty images:', error)
    }
  }

  async function loadShapes() {
    try {
      const response = await apiService.getShapes()
      if (response.success && response.data) {
        shapes.value = response.data
        console.log('Loaded shapes:', shapes.value.length, 'items')
      }
    } catch (error) {
      console.error('Error loading shapes:', error)
    }
  }

  // Update methods that sync to database
  async function updateSiteSettings(settings: any[]) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateSiteSettings(authToken.value, settings)
      if (response.success) {
        siteSettings.value = settings
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (error) {
      console.error('Error updating site settings:', error)
      return false
    }
  }

  async function updateContentSections(sections: any[]) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateContentSections(authToken.value, sections)
      if (response.success) {
        contentSections.value = sections
        
        // 更新相关的内容区块
        const rareDynastySection = sections.find(s => s.key === 'rare_dynasty_collection')
        if (rareDynastySection) {
          rareDynastyCollection.value = rareDynastySection
        }
        
        const heritageSection = sections.find(s => s.key === 'heritage_story')
        if (heritageSection) {
          heritageStory.value = heritageSection
        }
        
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (error) {
      console.error('Error updating content sections:', error)
      return false
    }
  }

  async function updateBestSellers(bestSellers: any[]) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateBestSellers(authToken.value, bestSellers)
      if (response.success) {
        bestSellersProducts.value = bestSellers
        // Update products after updating bestsellers
        convertBestSellersToProducts()
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (error) {
      console.error('Error updating best sellers:', error)
      return false
    }
  }

  // Function to add product to bestsellers (max 8)
  function addProductToBestSellers(product: any) {
    if (bestSellersProducts.value.length >= 8) {
      console.warn('Maximum 8 bestsellers allowed')
      return false
    }
    
    // Check if product already exists in bestsellers
    if (bestSellersProducts.value.some(p => p.id === product.id)) {
      console.warn('Product already exists in bestsellers')
      return false
    }
    
    // Convert product to bestseller format
    const bestSellerProduct = {
      id: product.id,
      name: product.name_en,
      price: `$${product.price}`,
      mainImage: product.primary_image,
      thumbnails: product.images?.map(img => img.image_url) || [product.primary_image],
      name_en: product.name_en,
      name_cn: product.name_cn,
      description_en: product.description_en,
      description_cn: product.description_cn,
      craftsmanship_en: product.craftsmanship_en,
      craftsmanship_cn: product.craftsmanship_cn,
      history_en: product.history_en,
      history_cn: product.history_cn,
      dynasty_id: product.dynasty_id,
      shape_id: product.shape_id,
      dimensions: product.dimensions,
      weight: product.weight,
      age: product.age,
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 10,
      dynasty_name: product.dynasty_name,
      shape_name: product.shape_name,
      is_featured: product.is_featured,
      is_available: product.is_available
    }
    
    bestSellersProducts.value.push(bestSellerProduct)
    
    // Update products list
    convertBestSellersToProducts()
    
    console.log('Added product to bestsellers:', bestSellerProduct.name)
    return true
  }
  
  // Function to remove product from bestsellers
  async function removeProductFromBestSellers(productId: number) {
    console.log('removeProductFromBestSellers called with productId:', productId)
    
    // Get token from localStorage directly
    const token = localStorage.getItem('admin_token')
    console.log('localStorage admin_token:', token)
    
    if (!token) {
      error.value = '未登录'
      console.log('No auth token found in localStorage')
      return false
    }

    try {
      // First, remove from local array
      const index = bestSellersProducts.value.findIndex(p => p.id === productId)
      console.log('Found product at index:', index)
      if (index === -1) {
        console.log('Product not found in bestsellers')
        return false
      }

      const removedProduct = bestSellersProducts.value.splice(index, 1)[0]
      console.log('Removed product:', removedProduct)
      
      // Update products list locally
      convertBestSellersToProducts()
      
      // Update backend by calling updateBestSellers with the updated list
      console.log('Making API call to update bestsellers list')
      console.log('Sending bestSellers data:', bestSellersProducts.value.map(p => ({ id: p.id })))
      const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bestSellers: bestSellersProducts.value.map(p => ({ id: p.id }))
        })
      })

      console.log('Backend response status:', response.status)
      console.log('Backend response ok:', response.ok)

      // Handle authentication errors
      if (handleAuthError(response)) {
        // Restore the product to local array
        bestSellersProducts.value.splice(index, 0, removedProduct);
        convertBestSellersToProducts();
        error.value = '登录已过期，请重新登录';
        return false;
      }

      if (response.ok) {
        console.log('Removed product from bestsellers:', removedProduct.name)
        return true
      } else {
        // If backend update fails, restore the product to local array
        bestSellersProducts.value.splice(index, 0, removedProduct)
        convertBestSellersToProducts()
        const errorText = await response.text()
        console.error('Failed to update backend for bestseller removal:', response.status, errorText)
        error.value = `Failed to update backend: ${response.status} ${errorText}`
        return false
      }
    } catch (error) {
      console.error('Error removing product from bestsellers:', error)
      return false
    }
  }
  
  // Function to get available products for selection (products not in bestsellers)
  function getAvailableProductsForBestSellers() {
    const bestSellerIds = bestSellersProducts.value.map(p => p.id)
    return products.value.filter(p => !bestSellerIds.includes(p.id))
  }

  async function updateDynasties(dynastiesData: any[]) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateDynasties(authToken.value, dynastiesData)
      if (response.success) {
        dynasties.value = [...dynastiesData]
        dynastyImages.value = dynastiesData.map((d: any) => d.image_url).filter(Boolean) as string[]
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (error) {
      console.error('Error updating dynasties:', error)
      return false
    }
  }

  async function updateShapes(shapesData: any[]) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateShapes(authToken.value, shapesData)
      if (response.success) {
        shapes.value = [...shapesData]
        return true
      } else {
        error.value = response.message || '更新失败'
        return false
      }
    } catch (error) {
      console.error('Error updating shapes:', error)
      return false
    }
  }

  // Helper methods
  function getSetting(key: string) {
    const setting = siteSettings.value.find(s => s.key === key)
    return setting ? setting.value : ''
  }

  function updateSetting(key: string, value: string) {
    const setting = siteSettings.value.find(s => s.key === key)
    if (setting) {
      setting.value = value
    }
  }

  function getContentSection(key: string) {
    return contentSections.value.find(s => s.key === key)
  }

  function updateContentSection(key: string, updates: any) {
    const section = contentSections.value.find(s => s.key === key)
    if (section) {
      Object.assign(section, updates)
    }
  }

  // Product management methods
  async function createProduct(productData: any) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.createProduct(productData)
      if (response.success) {
        await loadProducts() // Reload products
        return true
      } else {
        error.value = response.message || '创建商品失败'
        return false
      }
    } catch (error) {
      console.error('Error creating product:', error)
      return false
    }
  }

  async function updateProduct(id: number, productData: any) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.updateProduct(id, productData)
      if (response.success) {
        await loadProducts() // Reload products
        return true
      } else {
        error.value = response.message || '更新商品失败'
        return false
      }
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  }

  async function deleteProduct(id: number) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.deleteProduct(id)
      if (response.success) {
        await loadAllData() // Reload all data including bestsellers
        return true
      } else {
        error.value = response.message || '删除商品失败'
        return false
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  async function uploadProductImages(productId: number, images: File[], isPrimary?: boolean) {
    if (!authToken.value) {
      error.value = '未登录'
      return false
    }

    try {
      const response = await apiService.uploadProductImages(productId, images, isPrimary)
      if (response.success) {
        await loadProducts() // Reload products
        return true
      } else {
        error.value = response.message || '上传图片失败'
        return false
      }
    } catch (error) {
      console.error('Error uploading product images:', error)
      return false
    }
  }

  return {
    // State
    products,
    bestSellersProducts,
    rareDynastyCollection,
    heritageStory,
    heroConfig,
    dynastyImages,
    siteSettings,
    contentSections,
    dynasties,
    shapes,
    mediaLibrary,
    loading,
    error,
    authToken,
    
    // Computed
    featuredProducts,
    availableProducts,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    initializeAuth,
    loadAllData,
    loadProducts,
    loadBestSellers,
    loadDynasties,
    loadShapes,
    loadContentSections,
    loadSiteSettings,
    loadDynastyImages,
    setBestSellersProducts,
    updateSiteSettings,
    updateContentSections,
    updateBestSellers,
    updateDynasties,
    updateShapes,
    
    // Product management
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    
    // Best Sellers management
    convertBestSellersToProducts,
    addProductToBestSellers,
    removeProductFromBestSellers,
    getAvailableProductsForBestSellers,
    
    // Helper methods
    getSetting,
    updateSetting,
    getContentSection,
    updateContentSection
  }
})
