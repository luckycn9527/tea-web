// 统一图片处理工具 - 替换所有混乱的图片处理代码
import API_CONFIG from './api'

// 图片类型枚举
export enum ImageType {
  STATIC_ASSET = 'static_asset',      // 本地静态资源
  BACKEND_UPLOAD = 'backend_upload', // 后端上传文件
  BASE64 = 'base64',                 // base64编码
  BLOB = 'blob',                     // blob URL
  EXTERNAL = 'external'              // 外部URL
}

// 图片信息接口
export interface ImageInfo {
  type: ImageType
  url: string
  originalPath: string
}

// 统一图片处理器
export class UnifiedImageProcessor {
  private static instance: UnifiedImageProcessor

  private constructor() {}

  static getInstance(): UnifiedImageProcessor {
    if (!UnifiedImageProcessor.instance) {
      UnifiedImageProcessor.instance = new UnifiedImageProcessor()
    }
    return UnifiedImageProcessor.instance
  }

  // 分析图片路径类型
  private analyzeImagePath(imagePath: string): ImageType {
    if (!imagePath) return ImageType.STATIC_ASSET

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return ImageType.EXTERNAL
    }

    if (imagePath.startsWith('data:')) {
      return ImageType.BASE64
    }

    if (imagePath.startsWith('blob:')) {
      return ImageType.BLOB
    }

    if (imagePath.startsWith('/uploads')) {
      return ImageType.BACKEND_UPLOAD
    }

    if (imagePath.startsWith('/src/assets/') || imagePath.includes('tea_image')) {
      return ImageType.STATIC_ASSET
    }

    // 默认为静态资源
    return ImageType.STATIC_ASSET
  }

  // 处理图片路径 - 这是唯一的图片处理入口
  processImage(imagePath: string): ImageInfo {
    const type = this.analyzeImagePath(imagePath)
    let url = imagePath

    switch (type) {
      case ImageType.EXTERNAL:
      case ImageType.BASE64:
      case ImageType.BLOB:
        // 这些类型不需要处理
        url = imagePath
        break

      case ImageType.BACKEND_UPLOAD:
        // 后端上传文件，需要构造完整URL
        url = API_CONFIG.getApiUrl(imagePath)
        break

      case ImageType.STATIC_ASSET:
        // 静态资源，直接使用路径
        url = imagePath
        break

      default:
        // 其他情况，尝试构造API URL
        url = API_CONFIG.getApiUrl(imagePath)
        break
    }

    return {
      type,
      url,
      originalPath: imagePath
    }
  }

  // 批量处理图片
  processImages(imagePaths: string[]): ImageInfo[] {
    return imagePaths.map(path => this.processImage(path))
  }

  // 获取图片URL - 简化接口
  getImageUrl(imagePath: string): string {
    return this.processImage(imagePath).url
  }

  // 检查图片是否有效
  isValidImage(imagePath: string): boolean {
    if (!imagePath) return false
    
    const info = this.processImage(imagePath)
    return !!info.url
  }

  // 获取图片类型
  getImageType(imagePath: string): ImageType {
    return this.analyzeImagePath(imagePath)
  }
}

// 导出单例实例
export const imageProcessor = UnifiedImageProcessor.getInstance()

// 导出便捷函数
export const getImageUrl = (imagePath: string): string => {
  return imageProcessor.getImageUrl(imagePath)
}

export const processImage = (imagePath: string): ImageInfo => {
  return imageProcessor.processImage(imagePath)
}

export const processImages = (imagePaths: string[]): ImageInfo[] => {
  return imageProcessor.processImages(imagePaths)
}

export const isValidImage = (imagePath: string): boolean => {
  return imageProcessor.isValidImage(imagePath)
}

export const getImageType = (imagePath: string): ImageType => {
  return imageProcessor.getImageType(imagePath)
}

export default imageProcessor
