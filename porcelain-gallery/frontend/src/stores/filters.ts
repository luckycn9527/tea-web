import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import API_CONFIG from '@/config/api'

export interface Dynasty {
  id: number
  name: string
  period: string
}

export interface Shape {
  id: number
  name: string
}

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api`

export const useFiltersStore = defineStore('filters', () => {
  const dynasties = ref<Dynasty[]>([])
  const shapes = ref<Shape[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDynasties(lang = 'en') {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${API_BASE_URL}/products/filters/dynasties?lang=${lang}`)
      dynasties.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch dynasties'
      console.error('Error fetching dynasties:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchShapes(lang = 'en') {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${API_BASE_URL}/products/filters/shapes?lang=${lang}`)
      shapes.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch shapes'
      console.error('Error fetching shapes:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    dynasties,
    shapes,
    loading,
    error,
    fetchDynasties,
    fetchShapes
  }
})