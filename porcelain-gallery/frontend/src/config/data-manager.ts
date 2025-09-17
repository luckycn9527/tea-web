// 统一数据管理模块 - 替换所有混乱的代码
import { ref, computed } from 'vue'
import API_CONFIG from './api'

// 统一的产品接口
export interface UnifiedProduct {
  id: number
  name_en: string
  name_cn: string
  description_en: string
  description_cn: string
  craftsmanship_en: string
  craftsmanship_cn: string
  history_en: string
  history_cn: string
  price: number
  dimensions: string
  weight: string
  age: string
  dynasty_id: number
  shape_id: number
  dynasty_name: string
  shape_name: string
  primary_image: string
  images: Array<{
    id: number
    image_path: string
    is_primary: boolean
    sort_order: number
  }>
  videos: Array<{
    id: number
    video_path: string
    thumbnail_path: string
    sort_order: number
  }>
  is_featured: boolean
  is_available: boolean
}

// 统一的Best Seller接口
export interface UnifiedBestSeller {
  name: string
  price: string
  mainImage: string
  thumbnails: string[]
}

// 统一的数据配置
export interface UnifiedDataConfig {
  products: UnifiedProduct[]
  bestSellers: UnifiedBestSeller[]
  rareDynastyCollection: {
    title: string
    description: string
    buttonText: string
    image: string
  }
  heritageStory: {
    title: string
    description1: string
    description2: string
    image: string
  }
  dynastyImages: string[]
}

// 默认配置 - 这是唯一的数据源
const DEFAULT_CONFIG: UnifiedDataConfig = {
  products: [
    {
      id: 1,
      name_en: "bottle",
      name_cn: "瓶子",
      description_en: "A beautiful porcelain bottle",
      description_cn: "一个美丽的瓷器瓶子",
      craftsmanship_en: "Hand-crafted porcelain",
      craftsmanship_cn: "手工制作的瓷器",
      history_en: "Traditional Chinese porcelain",
      history_cn: "中国传统瓷器",
      price: 0,
      dimensions: "Height: 20cm",
      weight: "0.5kg",
      age: "Modern",
      dynasty_id: 1,
      shape_id: 1,
      dynasty_name: "Modern",
      shape_name: "Bottle",
      primary_image: "/src/assets/tea_image/1.png",
      images: [],
      videos: [],
      is_featured: false,
      is_available: true
    },
    {
      id: 2,
      name_en: "Chinese porcelain",
      name_cn: "中国瓷器",
      description_en: "Authentic Chinese porcelain",
      description_cn: "正宗的中国瓷器",
      craftsmanship_en: "Traditional craftsmanship",
      craftsmanship_cn: "传统工艺",
      history_en: "Ancient Chinese art",
      history_cn: "中国古代艺术",
      price: 232,
      dimensions: "Height: 25cm",
      weight: "0.8kg",
      age: "Antique",
      dynasty_id: 2,
      shape_id: 2,
      dynasty_name: "Song Dynasty",
      shape_name: "Vase",
      primary_image: "/src/assets/tea_image/2.png",
      images: [],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 3,
      name_en: "Chinese porcelain",
      name_cn: "中国瓷器",
      description_en: "Classic Chinese porcelain",
      description_cn: "经典的中国瓷器",
      craftsmanship_en: "Master craftsmanship",
      craftsmanship_cn: "大师工艺",
      history_en: "Traditional Chinese heritage",
      history_cn: "中国传统遗产",
      price: 0,
      dimensions: "Height: 30cm",
      weight: "1.0kg",
      age: "Antique",
      dynasty_id: 3,
      shape_id: 3,
      dynasty_name: "Yuan Dynasty",
      shape_name: "Plate",
      primary_image: "/src/assets/tea_image/3.png",
      images: [],
      videos: [],
      is_featured: false,
      is_available: true
    },
    {
      id: 4,
      name_en: "Chinese porcelain",
      name_cn: "中国瓷器",
      description_en: "Exquisite Chinese porcelain",
      description_cn: "精美的中国瓷器",
      craftsmanship_en: "Fine porcelain work",
      craftsmanship_cn: "精细瓷器工艺",
      history_en: "Imperial Chinese porcelain",
      history_cn: "中国皇家瓷器",
      price: 333,
      dimensions: "Height: 35cm",
      weight: "1.2kg",
      age: "Antique",
      dynasty_id: 4,
      shape_id: 4,
      dynasty_name: "Ming Dynasty",
      shape_name: "Bowl",
      primary_image: "/src/assets/tea_image/4.png",
      images: [],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 5,
      name_en: "Chinese porcelain",
      name_cn: "中国瓷器",
      description_en: "Premium Chinese porcelain",
      description_cn: "优质的中国瓷器",
      craftsmanship_en: "Luxury porcelain",
      craftsmanship_cn: "奢华瓷器",
      history_en: "Royal Chinese porcelain",
      history_cn: "中国皇家瓷器",
      price: 121,
      dimensions: "Height: 28cm",
      weight: "0.9kg",
      age: "Antique",
      dynasty_id: 5,
      shape_id: 5,
      dynasty_name: "Qing Dynasty",
      shape_name: "Teapot",
      primary_image: "/src/assets/tea_image/5.png",
      images: [],
      videos: [],
      is_featured: false,
      is_available: true
    },
    {
      id: 6,
      name_en: "Chinese porcelain",
      name_cn: "中国瓷器",
      description_en: "Artistic Chinese porcelain",
      description_cn: "艺术性的中国瓷器",
      craftsmanship_en: "Artistic porcelain",
      craftsmanship_cn: "艺术瓷器",
      history_en: "Cultural Chinese porcelain",
      history_cn: "中国文化瓷器",
      price: 211,
      dimensions: "Height: 32cm",
      weight: "1.1kg",
      age: "Antique",
      dynasty_id: 1,
      shape_id: 1,
      dynasty_name: "Tang Dynasty",
      shape_name: "Vase",
      primary_image: "/src/assets/tea_image/6.png",
      images: [],
      videos: [],
      is_featured: true,
      is_available: true
    }
  ],
  bestSellers: [
    {
      name: 'Landscape Jasper Bracelet IV (42mm)',
      price: '$211',
      mainImage: '/src/assets/tea_image/5.png',
      thumbnails: [
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/3.png',
        '/src/assets/tea_image/4.png'
      ]
    },
    {
      name: 'Dragon Blood Jasper V (4mm)',
      price: '$275',
      mainImage: '/src/assets/tea_image/14.png',
      thumbnails: [
        '/src/assets/tea_image/14.png',
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/6.png'
      ]
    },
    {
      name: 'Landscape Jasper Bracelet VII (6mm)',
      price: '$285',
      mainImage: '/src/assets/tea_image/22.png',
      thumbnails: [
        '/src/assets/tea_image/22.png',
        '/src/assets/tea_image/8.png',
        '/src/assets/tea_image/9.png'
      ]
    },
    {
      name: 'Camel-Turquoise Hematite Bracelet V (4mm)',
      price: '$185',
      mainImage: '/src/assets/tea_image/23.png',
      thumbnails: [
        '/src/assets/tea_image/23.png',
        '/src/assets/tea_image/11.png',
        '/src/assets/tea_image/12.png'
      ]
    },
    {
      name: 'Amethyst Bracelet XVII (6mm)',
      price: '$195',
      mainImage: '/src/assets/tea_image/13.png',
      thumbnails: [
        '/src/assets/tea_image/13.png',
        '/src/assets/tea_image/14.png',
        '/src/assets/tea_image/15.png'
      ]
    },
    {
      name: 'Tiger Eye Bracelet I (6mm)',
      price: '$205',
      mainImage: '/src/assets/tea_image/16.png',
      thumbnails: [
        '/src/assets/tea_image/16.png',
        '/src/assets/tea_image/17.png',
        '/src/assets/tea_image/18.png'
      ]
    },
    {
      name: 'Landscape Jasper Bracelet IV (4mm)',
      price: '$255',
      mainImage: '/src/assets/tea_image/20.png',
      thumbnails: [
        '/src/assets/tea_image/20.png',
        '/src/assets/tea_image/20.png',
        '/src/assets/tea_image/3.png'
      ]
    },
    {
      name: 'Dragon Blood Jasper V (4mm)',
      price: '$275',
      mainImage: '/src/assets/tea_image/21.png',
      thumbnails: [
        '/src/assets/tea_image/21.png',
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/6.png'
      ]
    }
  ],
  rareDynastyCollection: {
    title: "Rare Dynasty Collection",
    description: "Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.",
    buttonText: "EXPLORE COLLECTION",
    image: "/src/assets/tea_image/best.png"
  },
  heritageStory: {
    title: "Forget mass-produced",
    description1: "From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques.",
    description2: "A timeless design, authentic craftsmanship - a piece as unique as you are.",
    image: "/src/assets/tea_image/zhizuo.png"
  },
  dynastyImages: [
    "/src/assets/tea_image/tang.png",
    "/src/assets/tea_image/song.png",
    "/src/assets/tea_image/yuan.png",
    "/src/assets/tea_image/ming.png",
    "/src/assets/tea_image/qing.png"
  ]
}

// 统一数据管理器
class UnifiedDataManager {
  private static instance: UnifiedDataManager
  private config = ref<UnifiedDataConfig>(DEFAULT_CONFIG)
  private isInitialized = false

  private constructor() {}

  static getInstance(): UnifiedDataManager {
    if (!UnifiedDataManager.instance) {
      UnifiedDataManager.instance = new UnifiedDataManager()
    }
    return UnifiedDataManager.instance
  }

  // 初始化数据 - 这是唯一的数据加载入口
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // 尝试从localStorage加载配置
      const savedConfig = localStorage.getItem('unifiedDataConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        this.config.value = { ...DEFAULT_CONFIG, ...parsedConfig }
        console.log('Loaded unified config from localStorage')
      } else {
        // 使用默认配置
        this.config.value = DEFAULT_CONFIG
        console.log('Using default unified config')
      }
      
      this.isInitialized = true
      console.log('UnifiedDataManager initialized with', this.config.value.products.length, 'products')
    } catch (error) {
      console.error('Error initializing UnifiedDataManager:', error)
      this.config.value = DEFAULT_CONFIG
      this.isInitialized = true
    }
  }

  // 获取产品数据
  getProducts(): UnifiedProduct[] {
    return this.config.value.products
  }

  // 获取特色产品
  getFeaturedProducts(): UnifiedProduct[] {
    return this.config.value.products.filter(p => p.is_featured)
  }

  // 获取Best Sellers
  getBestSellers(): UnifiedBestSeller[] {
    return this.config.value.bestSellers
  }

  // 获取Rare Dynasty Collection
  getRareDynastyCollection() {
    return this.config.value.rareDynastyCollection
  }

  // 获取Heritage Story
  getHeritageStory() {
    return this.config.value.heritageStory
  }

  // 获取Dynasty Images
  getDynastyImages(): string[] {
    return this.config.value.dynastyImages
  }

  // 更新配置
  updateConfig(newConfig: Partial<UnifiedDataConfig>): void {
    this.config.value = { ...this.config.value, ...newConfig }
    localStorage.setItem('unifiedDataConfig', JSON.stringify(this.config.value))
  }

  // 获取图片URL - 统一的图片处理
  getImageUrl(imagePath: string): string {
    return API_CONFIG.getImageUrl(imagePath)
  }

  // 获取响应式配置
  getReactiveConfig() {
    return this.config
  }
}

// 导出单例实例
export const dataManager = UnifiedDataManager.getInstance()

// 导出响应式数据
export const useUnifiedData = () => {
  const config = dataManager.getReactiveConfig()
  
  return {
    products: computed(() => config.value.products),
    featuredProducts: computed(() => config.value.products.filter(p => p.is_featured)),
    bestSellers: computed(() => config.value.bestSellers),
    rareDynastyCollection: computed(() => config.value.rareDynastyCollection),
    heritageStory: computed(() => config.value.heritageStory),
    dynastyImages: computed(() => config.value.dynastyImages),
    initialize: () => dataManager.initialize(),
    getImageUrl: (imagePath: string) => dataManager.getImageUrl(imagePath),
    updateConfig: (newConfig: Partial<UnifiedDataConfig>) => dataManager.updateConfig(newConfig)
  }
}

export default dataManager
