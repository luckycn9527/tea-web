// API Configuration
import { ossImageManager } from '@/utils/oss-image-manager'

export const API_CONFIG = {
  // Force use server IP to avoid localhost issues
  BASE_URL: 'http://106.75.68.99:3000/api',
  
  // Helper function to get full API URL
  getApiUrl: (path: string) => {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '') // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}` // Ensure path starts with /
    return `${baseUrl}${cleanPath}`
  },
  
  // Helper function to get image URL - now uses OSS manager
  getImageUrl: (imagePath: string) => {
    if (!imagePath) return ''
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // If it's a data URL (base64), return as is
    if (imagePath.startsWith('data:')) {
      return imagePath
    }
    
    // If it's a blob URL, return as is
    if (imagePath.startsWith('blob:')) {
      return imagePath
    }
    
    // If it's a backend upload path, construct full URL
    if (imagePath.startsWith('/uploads')) {
      return API_CONFIG.getApiUrl(imagePath)
    }
    
    // Use OSS image manager for all other image paths
    return ossImageManager.getImageUrl(imagePath)
  }
}

// Export for easy access
export default API_CONFIG
