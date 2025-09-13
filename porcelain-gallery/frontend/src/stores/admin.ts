import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SiteSettings {
  title: string
  logo: string
  heroBackground: string
  heroTitle: string
  heroSubtitle: string
  description: string
  phone: string
  email: string
  address: string
  wechat: string
  weibo: string
}

export interface ContentSettings {
  bestSellersTitle: string
  rareDynastyTitle: string
  rareDynastyDescription: string
  exploreDynastyTitle: string
}

export interface Product {
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

export interface Dynasty {
  id: number
  name: string
  period: string
  description: string
  image: string
  sort_order: number
  is_enabled: boolean
}

export interface Shape {
  id: number
  name: string
  description: string
  sort_order: number
  is_enabled: boolean
}

export const useAdminStore = defineStore('admin', () => {
  // Site Settings
  const siteSettings = ref<SiteSettings>({
    title: '瓷器画廊',
    logo: '/src/assets/logo.svg',
    heroBackground: '/src/assets/tea_image/background.png',
    heroTitle: '展现您的独特风格',
    heroSubtitle: '最值得信赖的中国瓷器杰作来源',
    description: '专业的中国瓷器收藏和展示平台',
    phone: '+86 123 4567 8900',
    email: 'contact@porcelain-gallery.com',
    address: '中国北京市朝阳区...',
    wechat: '',
    weibo: ''
  })

  // Content Settings
  const contentSettings = ref<ContentSettings>({
    bestSellersTitle: 'Shop Best Sellers',
    rareDynastyTitle: 'Rare Dynasty Collection',
    rareDynastyDescription: 'Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.',
    exploreDynastyTitle: 'Explore by Dynasty'
  })

  // Image Management
  const productImages = ref([
    '/src/assets/tea_image/1.png',
    '/src/assets/tea_image/2.png',
    '/src/assets/tea_image/3.png',
    '/src/assets/tea_image/4.png',
    '/src/assets/tea_image/5.png',
    '/src/assets/tea_image/6.png',
    '/src/assets/tea_image/7.png',
    '/src/assets/tea_image/8.png',
    '/src/assets/tea_image/9.png',
    '/src/assets/tea_image/10.png',
    '/src/assets/tea_image/11.png',
    '/src/assets/tea_image/12.png',
    '/src/assets/tea_image/13.png',
    '/src/assets/tea_image/14.png',
    '/src/assets/tea_image/15.png',
    '/src/assets/tea_image/16.png',
    '/src/assets/tea_image/17.png',
    '/src/assets/tea_image/18.png',
    '/src/assets/tea_image/19.png',
    '/src/assets/tea_image/20.png',
    '/src/assets/tea_image/21.png',
    '/src/assets/tea_image/jimeng-2025-09-12-9353-中国瓷器，单个，造型独特，国之重器，纯黑色背景，无灯光，有轻微倒影，4K，极致的....png'
  ])

  const dynastyImages = ref([
    '/src/assets/tea_image/tang.png',
    '/src/assets/tea_image/song.png',
    '/src/assets/tea_image/yuan.png',
    '/src/assets/tea_image/ming.png',
    '/src/assets/tea_image/qing.png'
  ])

  // Thumbnail images for product navigation
  const thumbnailImages = ref([
    '/src/assets/tea_image/1.png',
    '/src/assets/tea_image/2.png',
    '/src/assets/tea_image/3.png',
    '/src/assets/tea_image/4.png',
    '/src/assets/tea_image/5.png',
    '/src/assets/tea_image/6.png',
    '/src/assets/tea_image/7.png',
    '/src/assets/tea_image/8.png',
    '/src/assets/tea_image/9.png',
    '/src/assets/tea_image/10.png',
    '/src/assets/tea_image/11.png',
    '/src/assets/tea_image/12.png',
    '/src/assets/tea_image/13.png',
    '/src/assets/tea_image/14.png',
    '/src/assets/tea_image/15.png',
    '/src/assets/tea_image/16.png',
    '/src/assets/tea_image/17.png',
    '/src/assets/tea_image/18.png',
    '/src/assets/tea_image/19.png',
    '/src/assets/tea_image/20.png',
    '/src/assets/tea_image/21.png',
    '/src/assets/tea_image/jimeng-2025-09-12-9353-中国瓷器，单个，造型独特，国之重器，纯黑色背景，无灯光，有轻微倒影，4K，极致的....png'
  ])

  // Best Sellers Products (8 products with 3 thumbnails each)
  const bestSellersProducts = ref([
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
  ])

  // Rare Dynasty Collection settings
  const rareDynastyCollection = ref({
    title: 'Rare Dynasty Collection',
    description: 'Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.',
    buttonText: 'EXPLORE COLLECTION',
    image: '/src/assets/tea_image/best.png'
  })

  // Heritage Story settings
  const heritageStory = ref({
    title: 'Forget mass-produced',
    description1: 'From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques.',
    description2: 'A timeless design, authentic craftsmanship - a piece as unique as you are.',
    image: '/src/assets/tea_image/zhizuo.png'
  })

  // Products Management
  const products = ref<Product[]>([
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
  ])
  const dynasties = ref<Dynasty[]>([
    {
      id: 1,
      name: 'Tang Dynasty',
      period: '618-907 AD',
      description: 'The golden age of Chinese civilization',
      image: '/src/assets/tea_image/1.png',
      sort_order: 1,
      is_enabled: true
    },
    {
      id: 2,
      name: 'Song Dynasty',
      period: '960-1279 AD',
      description: 'Known for refined aesthetics and innovation',
      image: '/src/assets/tea_image/2.png',
      sort_order: 2,
      is_enabled: true
    },
    {
      id: 3,
      name: 'Yuan Dynasty',
      period: '1271-1368 AD',
      description: 'Mongol rule brought new artistic influences',
      image: '/src/assets/tea_image/3.png',
      sort_order: 3,
      is_enabled: true
    },
    {
      id: 4,
      name: 'Ming Dynasty',
      period: '1368-1644 AD',
      description: 'Peak of Chinese porcelain craftsmanship',
      image: '/src/assets/tea_image/4.png',
      sort_order: 4,
      is_enabled: true
    },
    {
      id: 5,
      name: 'Qing Dynasty',
      period: '1644-1912 AD',
      description: 'Imperial porcelain reached new heights',
      image: '/src/assets/tea_image/5.png',
      sort_order: 5,
      is_enabled: true
    }
  ])

  const shapes = ref<Shape[]>([
    {
      id: 1,
      name: 'Vase',
      description: 'Traditional Chinese vase shapes',
      sort_order: 1,
      is_enabled: true
    },
    {
      id: 2,
      name: 'Bowl',
      description: 'Various bowl forms and sizes',
      sort_order: 2,
      is_enabled: true
    },
    {
      id: 3,
      name: 'Plate',
      description: 'Decorative and functional plates',
      sort_order: 3,
      is_enabled: true
    },
    {
      id: 4,
      name: 'Teapot',
      description: 'Traditional tea ceremony vessels',
      sort_order: 4,
      is_enabled: true
    },
    {
      id: 5,
      name: 'Sculpture',
      description: 'Artistic porcelain sculptures',
      sort_order: 5,
      is_enabled: true
    }
  ])

  // Media Library
  const mediaLibrary = ref<Array<{
    id: number
    name: string
    type: 'image' | 'video'
    url: string
    size: number
    uploadDate: string
    tags: string[]
  }>>([])

  // Methods
  function saveSiteSettings(settings: SiteSettings) {
    siteSettings.value = { ...settings }
    localStorage.setItem('siteSettings', JSON.stringify(settings))
  }

  function saveContentSettings(settings: ContentSettings) {
    contentSettings.value = { ...settings }
    localStorage.setItem('contentSettings', JSON.stringify(settings))
  }

  function updateProductImage(index: number, newPath: string) {
    if (index >= 0 && index < productImages.value.length) {
      productImages.value[index] = newPath
      localStorage.setItem('productImages', JSON.stringify(productImages.value))
    }
  }

  function updateDynastyImage(index: number, newPath: string) {
    if (index >= 0 && index < dynastyImages.value.length) {
      dynastyImages.value[index] = newPath
      localStorage.setItem('dynastyImages', JSON.stringify(dynastyImages.value))
    }
  }

  function updateThumbnailImage(index: number, newPath: string) {
    if (index >= 0 && index < thumbnailImages.value.length) {
      thumbnailImages.value[index] = newPath
      localStorage.setItem('thumbnailImages', JSON.stringify(thumbnailImages.value))
    }
  }

  function updateProductImagePath(index: number, newPath: string) {
    if (index >= 0 && index < productImages.value.length) {
      productImages.value[index] = newPath
      localStorage.setItem('productImages', JSON.stringify(productImages.value))
    }
  }

  function updateDynastyImagePath(index: number, newPath: string) {
    if (index >= 0 && index < dynastyImages.value.length) {
      dynastyImages.value[index] = newPath
      localStorage.setItem('dynastyImages', JSON.stringify(dynastyImages.value))
    }
  }

  function updateThumbnailImagePath(index: number, newPath: string) {
    if (index >= 0 && index < thumbnailImages.value.length) {
      thumbnailImages.value[index] = newPath
      localStorage.setItem('thumbnailImages', JSON.stringify(thumbnailImages.value))
    }
  }

  // Best Sellers Product Management

  function updateBestSellerName(index: number, newName: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      bestSellersProducts.value[index].name = newName
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value))
    }
  }

  function updateBestSellerPrice(index: number, newPrice: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      bestSellersProducts.value[index].price = newPrice
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value))
    }
  }

  function updateBestSellerMainImage(index: number, newImagePath: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      bestSellersProducts.value[index].mainImage = newImagePath
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value))
    }
  }

  function updateBestSellerThumbnail(productIndex: number, thumbnailIndex: number, newImagePath: string) {
    if (productIndex >= 0 && productIndex < bestSellersProducts.value.length &&
        thumbnailIndex >= 0 && thumbnailIndex < bestSellersProducts.value[productIndex].thumbnails.length) {
      bestSellersProducts.value[productIndex].thumbnails[thumbnailIndex] = newImagePath
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value))
    }
  }

  // Rare Dynasty Collection Management
  function updateRareDynastyTitle(newTitle: string) {
    rareDynastyCollection.value.title = newTitle
    localStorage.setItem('rareDynastyCollection', JSON.stringify(rareDynastyCollection.value))
  }

  function updateRareDynastyDescription(newDescription: string) {
    rareDynastyCollection.value.description = newDescription
    localStorage.setItem('rareDynastyCollection', JSON.stringify(rareDynastyCollection.value))
  }

  function updateRareDynastyButtonText(newButtonText: string) {
    rareDynastyCollection.value.buttonText = newButtonText
    localStorage.setItem('rareDynastyCollection', JSON.stringify(rareDynastyCollection.value))
  }

  function updateRareDynastyImage(newImage: string) {
    rareDynastyCollection.value.image = newImage
    localStorage.setItem('rareDynastyCollection', JSON.stringify(rareDynastyCollection.value))
  }

  // Heritage Story Management
  function updateHeritageStoryTitle(newTitle: string) {
    heritageStory.value.title = newTitle
    localStorage.setItem('heritageStory', JSON.stringify(heritageStory.value))
  }

  function updateHeritageStoryDescription1(newDescription: string) {
    heritageStory.value.description1 = newDescription
    localStorage.setItem('heritageStory', JSON.stringify(heritageStory.value))
  }

  function updateHeritageStoryDescription2(newDescription: string) {
    heritageStory.value.description2 = newDescription
    localStorage.setItem('heritageStory', JSON.stringify(heritageStory.value))
  }

  function updateHeritageStoryImage(newImage: string) {
    heritageStory.value.image = newImage
    localStorage.setItem('heritageStory', JSON.stringify(heritageStory.value))
  }

  function loadSettings() {
    // Load site settings
    const savedSiteSettings = localStorage.getItem('siteSettings')
    if (savedSiteSettings) {
      siteSettings.value = JSON.parse(savedSiteSettings)
    }

    // Load content settings
    const savedContentSettings = localStorage.getItem('contentSettings')
    if (savedContentSettings) {
      contentSettings.value = JSON.parse(savedContentSettings)
    }

    // Always use default product images configuration for consistency
    const savedProductImages = localStorage.getItem('productImages')
    if (savedProductImages) {
      productImages.value = JSON.parse(savedProductImages)
    }
    // productImages already has default values, so no need to override

    // Always use default dynasty images configuration for consistency
    const savedDynastyImages = localStorage.getItem('dynastyImages')
    if (savedDynastyImages) {
      dynastyImages.value = JSON.parse(savedDynastyImages)
    }
    // dynastyImages already has default values, so no need to override

    // Always use default thumbnail images configuration for consistency
    const savedThumbnailImages = localStorage.getItem('thumbnailImages')
    if (savedThumbnailImages) {
      thumbnailImages.value = JSON.parse(savedThumbnailImages)
    }
    // thumbnailImages already has default values, so no need to override

    // Always use default best sellers products configuration for consistency
    const savedBestSellersProducts = localStorage.getItem('bestSellersProducts')
    if (savedBestSellersProducts) {
      bestSellersProducts.value = JSON.parse(savedBestSellersProducts)
    }
    // bestSellersProducts already has default values, so no need to override

    // Always use default rare dynasty collection configuration for consistency
    const savedRareDynastyCollection = localStorage.getItem('rareDynastyCollection')
    if (savedRareDynastyCollection) {
      rareDynastyCollection.value = JSON.parse(savedRareDynastyCollection)
    }
    // rareDynastyCollection already has default values, so no need to override

    // Always use default heritage story configuration for consistency
    const savedHeritageStory = localStorage.getItem('heritageStory')
    if (savedHeritageStory) {
      heritageStory.value = JSON.parse(savedHeritageStory)
    }
    // heritageStory already has default values, so no need to override
  }

  // Helper function to compress base64 image
  function compressBase64Image(base64: string, quality: number = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedBase64)
      }
      img.src = base64
    })
  }

  // Helper function to compress image
  function compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        
        console.log(`Image compressed: ${file.size} -> ${compressedDataUrl.length} chars`)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  // Helper function to convert File to compressed base64
  function fileToCompressedBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check file size first
      if (file.size > 2 * 1024 * 1024) { // 2MB
        console.log('Large file detected, compressing...')
        compressImage(file, 600, 0.6).then(resolve).catch(reject)
      } else if (file.size > 500 * 1024) { // 500KB
        console.log('Medium file detected, light compression...')
        compressImage(file, 800, 0.7).then(resolve).catch(reject)
      } else {
        console.log('Small file, no compression needed')
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      }
    })
  }

  // Product CRUD Methods
  async function addProduct(product: Omit<Product, 'id'>) {
    const newId = Math.max(...products.value.map(p => p.id), 0) + 1
    
    // Create a product with file paths converted to base64
    const productForStorage = { ...product, id: newId }
    
    console.log('Adding product with file objects:', {
      primary_image: productForStorage.primary_image,
      images_count: productForStorage.images?.length || 0
    })
    
    // Convert primary image file to compressed base64 if it exists
    if ((productForStorage as any).primary_image_file) {
      try {
        const base64 = await fileToCompressedBase64((productForStorage as any).primary_image_file)
        productForStorage.primary_image = base64
        console.log('Converted primary image file to compressed base64')
        // Remove the file object to save space
        delete (productForStorage as any).primary_image_file
      } catch (error) {
        console.error('Error converting primary image:', error)
      }
    }
    
    // Convert additional images to compressed base64 if they exist
    if (productForStorage.images && productForStorage.images.length > 0) {
      for (let i = 0; i < productForStorage.images.length; i++) {
        const img = productForStorage.images[i]
        if ((img as any).image_file) {
          try {
            const base64 = await fileToCompressedBase64((img as any).image_file)
            img.image_path = base64
            console.log(`Converted additional image ${i} file to compressed base64`)
            // Remove the file object to save space
            delete (img as any).image_file
          } catch (error) {
            console.error(`Error converting additional image ${i}:`, error)
          }
        }
      }
    }
    
    products.value.push(productForStorage)
    
    try {
      localStorage.setItem('products', JSON.stringify(products.value))
      console.log('Successfully stored product with compressed images')
    } catch (error) {
      console.error('Failed to store products with images:', error)
      
      // Try storing without images as fallback
      const productWithoutImages = { ...productForStorage }
      productWithoutImages.primary_image = '/src/assets/tea_image/1.png' // fallback image
      if (productWithoutImages.images) {
        productWithoutImages.images = productWithoutImages.images.map(() => ({
          id: 0,
          image_path: '/src/assets/tea_image/1.png',
          is_primary: false,
          sort_order: 0
        }))
      }
      
      // Remove the current product and add the fallback version
      const productIndex = products.value.findIndex(p => p.id === newId)
      if (productIndex !== -1) {
        products.value.splice(productIndex, 1)
      }
      products.value.push(productWithoutImages)
      
      try {
        localStorage.setItem('products', JSON.stringify(products.value))
        console.log('Successfully stored product without images (fallback)')
        alert('Product saved without images due to storage limitations. Please use smaller images or clear browser data.')
        return productWithoutImages
      } catch (fallbackError) {
        console.error('Even fallback storage failed:', fallbackError)
        
        // Final attempt: clear old products and try again
        clearOldProducts()
        try {
          localStorage.setItem('products', JSON.stringify(products.value))
          console.log('Successfully stored product after clearing old data')
          return productWithoutImages
        } catch (finalError) {
          console.error('Final storage attempt failed:', finalError)
          
          // Remove the product from memory
          const finalIndex = products.value.findIndex(p => p.id === newId)
          if (finalIndex !== -1) {
            products.value.splice(finalIndex, 1)
          }
          
          throw new Error('Storage quota exceeded. Please clear browser data or use smaller images.')
        }
      }
    }
    
    return productForStorage
  }

  // Add product without images (only product info)
  function addProductWithoutImages(product: Omit<Product, 'id'>) {
    const newId = Math.max(...products.value.map(p => p.id), 0) + 1
    const productForStorage = { ...product, id: newId }
    
    console.log('Adding product without images:', {
      name: productForStorage.name_en,
      dynasty: productForStorage.dynasty_name,
      shape: productForStorage.shape_name
    })
    
    products.value.push(productForStorage)
    
    try {
      localStorage.setItem('products', JSON.stringify(products.value))
      console.log('Successfully stored product without images')
    } catch (error) {
      console.error('Failed to store product:', error)
      throw new Error('Failed to save product. Please try again.')
    }
    
    return productForStorage
  }
  
  // Helper function to clear localStorage
  function clearLocalStorage() {
    console.log('Clearing localStorage...')
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage)
    
    // Remove all product image keys (from old storage format)
    keys.forEach(key => {
      if (key.startsWith('product_') && (key.includes('_primary_') || key.includes('_img_'))) {
        console.log(`Removing old image key: ${key}`)
        localStorage.removeItem(key)
      }
    })
    
    // Clear products array
    localStorage.removeItem('products')
    products.value = []
    
    console.log('localStorage cleared successfully')
  }

  // Helper function to clear old products when storage is full
  function clearOldProducts() {
    console.log('Clearing old products to free up space...')
    
    // Keep only the 5 most recent products
    if (products.value.length > 5) {
      // Keep only the 5 most recent products
      products.value = products.value.slice(-5)
    }
  }
  
  // Function to get product with restored image data
  function getProductWithImages(product: Product): Product {
    // Since we now store local paths directly, no need to restore from localStorage
    return { ...product }
  }

  function updateProduct(id: number, updates: Partial<Product>) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      // Handle image updates
      const updatedProduct = { ...products.value[index], ...updates }
      
      // If primary image is updated and it's base64, convert to local path
      if (updatedProduct.primary_image && updatedProduct.primary_image.startsWith('data:')) {
        const timestamp = Date.now()
        updatedProduct.primary_image = `/src/assets/tea_image/product_${id}_primary_${timestamp}.png`
      }
      
      // Handle additional images updates
      if (updatedProduct.images) {
        updatedProduct.images = updatedProduct.images.map((img, imgIndex) => {
          if (img.image_path && img.image_path.startsWith('data:')) {
            const timestamp = Date.now()
            return { ...img, image_path: `/src/assets/tea_image/product_${id}_img_${imgIndex}_${timestamp}.png` }
          }
          return img
        })
      }
      
      products.value[index] = updatedProduct
      
      try {
        localStorage.setItem('products', JSON.stringify(products.value))
      } catch (error) {
        console.error('Failed to update products:', error)
        clearOldProducts()
        localStorage.setItem('products', JSON.stringify(products.value))
      }
    }
  }

  function deleteProduct(id: number) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      localStorage.setItem('products', JSON.stringify(products.value))
    }
  }

  function getProduct(id: number): Product | undefined {
    const product = products.value.find(p => p.id === id)
    if (product) {
      return getProductWithImages(product)
    }
    return undefined
  }

  // Filter functions
  const filters = ref<any>({})
  const filteredProducts = computed(() => {
    let filtered = [...products.value]
    
    if (filters.value.dynasty_id) {
      filtered = filtered.filter(p => p.dynasty_id === filters.value.dynasty_id)
    }
    
    if (filters.value.shape_id) {
      filtered = filtered.filter(p => p.shape_id === filters.value.shape_id)
    }
    
    if (filters.value.min_price) {
      filtered = filtered.filter(p => p.price >= filters.value.min_price)
    }
    
    if (filters.value.max_price) {
      filtered = filtered.filter(p => p.price <= filters.value.max_price)
    }
    
    if (filters.value.age) {
      filtered = filtered.filter(p => p.age === filters.value.age)
    }
    
    if (filters.value.is_featured) {
      filtered = filtered.filter(p => p.is_featured === true)
    }
    
    // Return products directly since they already have local paths
    return filtered
  })

  function setFilters(newFilters: any) {
    filters.value = newFilters
  }

  function clearFilters() {
    filters.value = {}
  }

  // Dynasty CRUD Methods
  function addDynasty(dynasty: Omit<Dynasty, 'id'>) {
    const newId = Math.max(...dynasties.value.map(d => d.id), 0) + 1
    const newDynasty: Dynasty = { ...dynasty, id: newId }
    dynasties.value.push(newDynasty)
    localStorage.setItem('dynasties', JSON.stringify(dynasties.value))
    return newDynasty
  }

  function updateDynasty(id: number, updates: Partial<Dynasty>) {
    const index = dynasties.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dynasties.value[index] = { ...dynasties.value[index], ...updates }
      localStorage.setItem('dynasties', JSON.stringify(dynasties.value))
    }
  }

  function deleteDynasty(id: number) {
    const index = dynasties.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dynasties.value.splice(index, 1)
      localStorage.setItem('dynasties', JSON.stringify(dynasties.value))
    }
  }

  // Shape CRUD Methods
  function addShape(shape: Omit<Shape, 'id'>) {
    const newId = Math.max(...shapes.value.map(s => s.id), 0) + 1
    const newShape: Shape = { ...shape, id: newId }
    shapes.value.push(newShape)
    localStorage.setItem('shapes', JSON.stringify(shapes.value))
    return newShape
  }

  function updateShape(id: number, updates: Partial<Shape>) {
    const index = shapes.value.findIndex(s => s.id === id)
    if (index !== -1) {
      shapes.value[index] = { ...shapes.value[index], ...updates }
      localStorage.setItem('shapes', JSON.stringify(shapes.value))
    }
  }

  function deleteShape(id: number) {
    const index = shapes.value.findIndex(s => s.id === id)
    if (index !== -1) {
      shapes.value.splice(index, 1)
      localStorage.setItem('shapes', JSON.stringify(shapes.value))
    }
  }

  // Media Library Methods
  function addMediaFile(file: File, tags: string[] = []) {
    return new Promise<string>((resolve, reject) => {
      const newId = Math.max(...mediaLibrary.value.map(m => m.id), 0) + 1
      
      // Create a simple path identifier instead of storing base64
      const fileName = `media_${newId}_${Date.now()}.${file.name.split('.').pop()}`
      const localPath = `/media/${fileName}`
      
      const mediaItem = {
        id: newId,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        url: localPath, // Use simple path instead of base64
        size: file.size,
        uploadDate: new Date().toISOString(),
        tags
      }
      
      mediaLibrary.value.push(mediaItem)
      localStorage.setItem('mediaLibrary', JSON.stringify(mediaLibrary.value))
      
      // For immediate preview, we'll still read the file as base64
      const reader = new FileReader()
      reader.onload = () => {
        // Return base64 data for preview only, don't store it
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  function deleteMediaFile(id: number) {
    const index = mediaLibrary.value.findIndex(m => m.id === id)
    if (index !== -1) {
      mediaLibrary.value.splice(index, 1)
      localStorage.setItem('mediaLibrary', JSON.stringify(mediaLibrary.value))
    }
  }

  // Load all data from localStorage
  async function loadAllData() {
    loadSettings()
    
    // Always use default configurations to ensure consistency between local and public access
    // This ensures that public access shows the same content as local access
    
    // Always use default products configuration for consistency
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      products.value = JSON.parse(savedProducts)
      console.log('Loaded products from localStorage:', products.value.length)
    } else {
      // Only use default products if no admin configuration exists
      // This allows admin panel operations to take effect
      console.log('No saved products found, using default products configuration')
      console.log('Default products loaded:', products.value.length)
    }
    
    // Always use default dynasties configuration
    const savedDynasties = localStorage.getItem('dynasties')
    if (savedDynasties) {
      dynasties.value = JSON.parse(savedDynasties)
    }
    // dynasties already has default values, so no need to override
    
    // Always use default shapes configuration  
    const savedShapes = localStorage.getItem('shapes')
    if (savedShapes) {
      shapes.value = JSON.parse(savedShapes)
    }
    // shapes already has default values, so no need to override
    
    const savedMediaLibrary = localStorage.getItem('mediaLibrary')
    if (savedMediaLibrary) {
      mediaLibrary.value = JSON.parse(savedMediaLibrary)
    }
    
    // Return a promise to ensure data is loaded
    return Promise.resolve()
  }

  // Computed
  const isAdmin = computed(() => {
    // Simple admin check - in production, this would be more sophisticated
    return localStorage.getItem('isAdmin') === 'true'
  })

  return {
    // State
    siteSettings,
    contentSettings,
    productImages,
    dynastyImages,
    thumbnailImages,
    bestSellersProducts,
    rareDynastyCollection,
    heritageStory,
    products,
    dynasties,
    shapes,
    mediaLibrary,
    
    // Methods
    saveSiteSettings,
    saveContentSettings,
    updateProductImage,
    updateDynastyImage,
    updateThumbnailImage,
    updateProductImagePath,
    updateDynastyImagePath,
    updateThumbnailImagePath,
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
    loadSettings,
    
    // Product CRUD
    addProduct,
    addProductWithoutImages,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductWithImages,
    clearOldProducts,
    clearLocalStorage,
    
    // Filter functions
    filters,
    filteredProducts,
    setFilters,
    clearFilters,
    
    // Dynasty CRUD
    addDynasty,
    updateDynasty,
    deleteDynasty,
    
    // Shape CRUD
    addShape,
    updateShape,
    deleteShape,
    
    // Media Library
    addMediaFile,
    deleteMediaFile,
    
    // Load all data
    loadAllData,
    
    // Computed
    isAdmin
  }
})
