// Common data store for dynasties, shapes, categories, settings, and content sections
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService, { 
  type Dynasty, 
  type Shape, 
  type Category, 
  type SiteSetting, 
  type ContentSection,
  type ApiResponse 
} from '@/services/api'

export const useCommonStore = defineStore('common', () => {
  // State
  const dynasties = ref<Dynasty[]>([])
  const shapes = ref<Shape[]>([])
  const categories = ref<Category[]>([])
  const siteSettings = ref<SiteSetting[]>([])
  const contentSections = ref<ContentSection[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const enabledDynasties = computed(() => 
    dynasties.value.filter(d => d.is_enabled)
  )

  const enabledShapes = computed(() => 
    shapes.value.filter(s => s.is_enabled)
  )

  const enabledCategories = computed(() => 
    categories.value.filter(c => c.is_enabled)
  )

  const publicSettings = computed(() => 
    siteSettings.value.filter(s => s.is_public)
  )

  const activeContentSections = computed(() => 
    contentSections.value.filter(s => s.is_active)
  )

  // Helper function to get setting by key
  const getSetting = computed(() => (key: string) => {
    const setting = siteSettings.value.find(s => s.setting_key === key)
    return setting?.setting_value || ''
  })

  // Helper function to get content section by key
  const getContentSection = computed(() => (key: string) => {
    return contentSections.value.find(s => s.section_key === key)
  })

  // Actions
  async function fetchDynasties(enabledOnly = true) {
    try {
      const response: ApiResponse<Dynasty[]> = await apiService.getDynasties(enabledOnly)
      
      if (response.success && response.data) {
        dynasties.value = response.data
      } else {
        console.error('Failed to fetch dynasties:', response.message)
        dynasties.value = []
      }
    } catch (err) {
      console.error('Error fetching dynasties:', err)
      dynasties.value = []
    }
  }

  async function fetchShapes(enabledOnly = true) {
    try {
      const response: ApiResponse<Shape[]> = await apiService.getShapes(enabledOnly)
      
      if (response.success && response.data) {
        shapes.value = response.data
      } else {
        console.error('Failed to fetch shapes:', response.message)
        shapes.value = []
      }
    } catch (err) {
      console.error('Error fetching shapes:', err)
      shapes.value = []
    }
  }

  async function fetchCategories(enabledOnly = true, parentId?: number) {
    try {
      const response: ApiResponse<Category[]> = await apiService.getCategories(enabledOnly, parentId)
      
      if (response.success && response.data) {
        categories.value = response.data
      } else {
        console.error('Failed to fetch categories:', response.message)
        categories.value = []
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      categories.value = []
    }
  }

  async function fetchSiteSettings(publicOnly = true) {
    try {
      const response: ApiResponse<SiteSetting[]> = await apiService.getSiteSettings(publicOnly)
      
      if (response.success && response.data) {
        siteSettings.value = response.data
      } else {
        console.error('Failed to fetch site settings:', response.message)
        siteSettings.value = []
      }
    } catch (err) {
      console.error('Error fetching site settings:', err)
      siteSettings.value = []
    }
  }

  async function fetchContentSections(activeOnly = true) {
    try {
      const response: ApiResponse<ContentSection[]> = await apiService.getContentSections(activeOnly)
      
      if (response.success && response.data) {
        contentSections.value = response.data
      } else {
        console.error('Failed to fetch content sections:', response.message)
        contentSections.value = []
      }
    } catch (err) {
      console.error('Error fetching content sections:', err)
      contentSections.value = []
    }
  }

  // Fetch all common data
  async function fetchAllData() {
    loading.value = true
    error.value = null

    try {
      await Promise.all([
        fetchDynasties(),
        fetchShapes(),
        fetchCategories(),
        fetchSiteSettings(),
        fetchContentSections()
      ])
    } catch (err) {
      error.value = 'Failed to fetch common data'
      console.error('Error fetching all common data:', err)
    } finally {
      loading.value = false
    }
  }

  // Get dynasty by ID
  function getDynastyById(id: number): Dynasty | undefined {
    return dynasties.value.find(d => d.id === id)
  }

  // Get shape by ID
  function getShapeById(id: number): Shape | undefined {
    return shapes.value.find(s => s.id === id)
  }

  // Get category by ID
  function getCategoryById(id: number): Category | undefined {
    return categories.value.find(c => c.id === id)
  }

  // Get dynasty by name
  function getDynastyByName(name: string): Dynasty | undefined {
    return dynasties.value.find(d => d.name === name || d.name_cn === name)
  }

  // Get shape by name
  function getShapeByName(name: string): Shape | undefined {
    return shapes.value.find(s => s.name === name || s.name_cn === name)
  }

  // Get category by name
  function getCategoryByName(name: string): Category | undefined {
    return categories.value.find(c => c.name === name || c.name_cn === name)
  }

  return {
    // State
    dynasties,
    shapes,
    categories,
    siteSettings,
    contentSections,
    loading,
    error,
    
    // Computed
    enabledDynasties,
    enabledShapes,
    enabledCategories,
    publicSettings,
    activeContentSections,
    getSetting,
    getContentSection,
    
    // Actions
    fetchDynasties,
    fetchShapes,
    fetchCategories,
    fetchSiteSettings,
    fetchContentSections,
    fetchAllData,
    getDynastyById,
    getShapeById,
    getCategoryById,
    getDynastyByName,
    getShapeByName,
    getCategoryByName
  }
})

