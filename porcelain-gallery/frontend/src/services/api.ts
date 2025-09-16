// API service for frontend to communicate with backend
import API_CONFIG from '@/config/api'

// API Response interface
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Product interfaces
interface Product {
  id: number
  name_en: string
  name_cn: string
  slug: string
  description_en: string
  description_cn: string
  craftsmanship_en: string
  craftsmanship_cn: string
  history_en: string
  history_cn: string
  price: number
  original_price?: number
  dimensions: string
  weight: string
  age: string
  material: string
  color: string
  dynasty_id: number
  shape_id: number
  category_id?: number
  primary_image_id?: number
  sku: string
  stock_quantity: number
  is_featured: boolean
  is_available: boolean
  is_digital: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  view_count: number
  created_at: string
  updated_at: string
  dynasty_name?: string
  dynasty_name_cn?: string
  shape_name?: string
  shape_name_cn?: string
  category_name?: string
  category_name_cn?: string
  primary_image?: string
  primary_image_url?: string
  primary_image_alt?: string
  images?: ProductImage[]
  videos?: ProductVideo[]
  attributes?: ProductAttribute[]
  tags?: ProductTag[]
}

interface ProductImage {
  id: number
  product_id: number
  image_url: string
  image_path?: string
  alt_text?: string
  caption?: string
  is_primary: boolean
  sort_order: number
  file_size?: number
  mime_type?: string
  width?: number
  height?: number
  created_at: string
}

interface ProductVideo {
  id: number
  product_id: number
  video_url: string
  thumbnail_url?: string
  title?: string
  description?: string
  duration?: number
  sort_order: number
  file_size?: number
  mime_type?: string
  created_at: string
}

interface ProductAttribute {
  id: number
  product_id: number
  attribute_name: string
  attribute_value: string
  attribute_type: 'text' | 'number' | 'boolean' | 'date'
  sort_order: number
  created_at: string
}

interface ProductTag {
  id: number
  name: string
  name_cn: string
  slug: string
  description?: string
  color: string
  created_at: string
}

// Common interfaces
interface Dynasty {
  id: number
  name: string
  name_cn: string
  period: string
  description?: string
  description_cn?: string
  image_url?: string
  image?: string
  sort_order: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

interface Shape {
  id: number
  name: string
  name_cn: string
  description?: string
  description_cn?: string
  sort_order: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  name_cn: string
  description?: string
  description_cn?: string
  parent_id?: number
  sort_order: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

interface SiteSetting {
  id: number
  setting_key: string
  setting_value: string
  setting_type: 'text' | 'number' | 'boolean' | 'json' | 'image'
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface ContentSection {
  id: number
  section_key: string
  title_en?: string
  title_cn?: string
  content_en?: string
  content_cn?: string
  image_url?: string
  button_text_en?: string
  button_text_cn?: string
  button_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// API Service Class
class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  // Generic HTTP methods
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Products API
  async getProducts(params: {
    page?: number
    limit?: number
    dynasty_id?: number
    shape_id?: number
    category_id?: number
    is_featured?: boolean
    is_available?: boolean
    search?: string
    sort_by?: string
    sort_order?: string
  } = {}): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<Product[]>(`/api/products?${searchParams.toString()}`)
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/api/products/${id}`)
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/api/products/slug/${slug}`)
  }

  async getFeaturedProducts(limit: number = 6): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/api/products/featured/list?limit=${limit}`)
  }

  async getRelatedProducts(id: number, limit: number = 4): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/api/products/${id}/related?limit=${limit}`)
  }

  // Product CRUD operations
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    })
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    })
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/products/${id}`, {
      method: 'DELETE'
    })
  }

  async getProductImages(id: number): Promise<ApiResponse<ProductImage[]>> {
    return this.request<ProductImage[]>(`/api/products/${id}/images`)
  }

  async getProductVideos(id: number): Promise<ApiResponse<ProductVideo[]>> {
    return this.request<ProductVideo[]>(`/api/products/${id}/videos`)
  }

  async getProductAttributes(id: number): Promise<ApiResponse<ProductAttribute[]>> {
    return this.request<ProductAttribute[]>(`/api/products/${id}/attributes`)
  }

  async getProductTags(id: number): Promise<ApiResponse<ProductTag[]>> {
    return this.request<ProductTag[]>(`/api/products/${id}/tags`)
  }

  // Dynasties API
  async getDynasties(is_enabled: boolean = true): Promise<ApiResponse<Dynasty[]>> {
    return this.request<Dynasty[]>(`/api/dynasties?is_enabled=${is_enabled}`)
  }

  async getDynasty(id: number): Promise<ApiResponse<Dynasty>> {
    return this.request<Dynasty>(`/api/dynasties/${id}`)
  }

  // Shapes API
  async getShapes(is_enabled: boolean = true): Promise<ApiResponse<Shape[]>> {
    return this.request<Shape[]>(`/api/shapes?is_enabled=${is_enabled}`)
  }

  async getShape(id: number): Promise<ApiResponse<Shape>> {
    return this.request<Shape>(`/api/shapes/${id}`)
  }

  // Categories API
  async getCategories(is_enabled: boolean = true, parent_id?: number): Promise<ApiResponse<Category[]>> {
    let url = `/api/categories?is_enabled=${is_enabled}`
    if (parent_id !== undefined) {
      url += `&parent_id=${parent_id}`
    }
    return this.request<Category[]>(url)
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/api/categories/${id}`)
  }

  // Site Settings API
  async getSiteSettings(is_public?: boolean): Promise<ApiResponse<SiteSetting[]>> {
    let url = '/api/settings'
    if (is_public !== undefined) {
      url += `?is_public=${is_public}`
    }
    return this.request<SiteSetting[]>(url)
  }

  async getSiteSetting(key: string): Promise<ApiResponse<SiteSetting>> {
    return this.request<SiteSetting>(`/api/settings/${key}`)
  }

  // Content Sections API
  async getContentSections(is_active: boolean = true): Promise<ApiResponse<ContentSection[]>> {
    return this.request<ContentSection[]>(`/api/content-sections?is_active=${is_active}`)
  }

  async getContentSection(key: string): Promise<ApiResponse<ContentSection>> {
    return this.request<ContentSection>(`/api/content-sections/${key}`)
  }

  // Media API
  async uploadImage(file: File, metadata?: {
    alt_text?: string
    caption?: string
    tags?: string[]
    is_public?: boolean
  }): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('image', file)
    
    if (metadata) {
      if (metadata.alt_text) formData.append('alt_text', metadata.alt_text)
      if (metadata.caption) formData.append('caption', metadata.caption)
      if (metadata.tags) formData.append('tags', metadata.tags.join(','))
      if (metadata.is_public !== undefined) formData.append('is_public', metadata.is_public.toString())
    }

    try {
      const response = await fetch(`${this.baseURL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Image upload failed:', error)
      return {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async uploadMultipleImages(files: File[], metadata?: {
    alt_text?: string
    caption?: string
    tags?: string[]
    is_public?: boolean
  }): Promise<ApiResponse<any[]>> {
    const formData = new FormData()
    
    files.forEach(file => {
      formData.append('images', file)
    })
    
    if (metadata) {
      if (metadata.alt_text) formData.append('alt_text', metadata.alt_text)
      if (metadata.caption) formData.append('caption', metadata.caption)
      if (metadata.tags) formData.append('tags', metadata.tags.join(','))
      if (metadata.is_public !== undefined) formData.append('is_public', metadata.is_public.toString())
    }

    try {
      const response = await fetch(`${this.baseURL}/api/media/upload-multiple`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Multiple images upload failed:', error)
      return {
        success: false,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getMediaLibrary(params: {
    is_public?: boolean
    limit?: number
    offset?: number
    search?: string
  } = {}): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<any[]>(`/api/media/media?${searchParams.toString()}`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/health')
  }
}

// Create singleton instance
const apiService = new ApiService()

// Export types and service
export {
  type ApiResponse,
  type Product,
  type ProductImage,
  type ProductVideo,
  type ProductAttribute,
  type ProductTag,
  type Dynasty,
  type Shape,
  type Category,
  type SiteSetting,
  type ContentSection,
  apiService
}

export default apiService
