// API Configuration
export const API_CONFIG = {
  // Use environment variable if available, otherwise fallback to localhost
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Helper function to get full API URL
  getApiUrl: (path: string) => {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '') // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}` // Ensure path starts with /
    return `${baseUrl}${cleanPath}`
  },
  
  // Helper function to get image URL
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
    
    // If it's a local static asset path, don't modify it
    // Vite will handle these paths correctly
    if (imagePath.startsWith('/src/assets/') || imagePath.includes('tea_image')) {
      return imagePath
    }
    
    // For other backend paths, construct full URL
    return API_CONFIG.getApiUrl(imagePath)
  }
}

// Export for easy access
export default API_CONFIG
