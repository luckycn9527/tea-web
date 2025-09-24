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
  name_cn: string
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
      id: 1,
      name: 'Landscape Jasper Bracelet IV (42mm)',
      price: '$211',
      mainImage: '/src/assets/tea_image/5.png',
      thumbnails: [
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/3.png',
        '/src/assets/tea_image/4.png'
      ],
      // 扩展字段
      name_en: 'Landscape Jasper Bracelet IV (42mm)',
      name_cn: '山水碧玉手镯 IV (42mm)',
      description_en: 'Beautiful landscape jasper bracelet with natural patterns',
      description_cn: '美丽的山水碧玉手镯，具有天然图案',
      dynasty_id: 1,
      shape_id: 1,
      dimensions: '42mm',
      weight: '15g',
      age: 'Modern',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 10
    },
    {
      id: 2,
      name: 'Dragon Blood Jasper V (4mm)',
      price: '$275',
      mainImage: '/src/assets/tea_image/14.png',
      thumbnails: [
        '/src/assets/tea_image/14.png',
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/6.png'
      ],
      // 扩展字段
      name_en: 'Dragon Blood Jasper V (4mm)',
      name_cn: '龙血碧玉 V (4mm)',
      description_en: 'Exquisite dragon blood jasper bracelet with deep red patterns',
      description_cn: '精美的龙血碧玉手镯，具有深红色图案',
      dynasty_id: 2,
      shape_id: 2,
      dimensions: '4mm',
      weight: '12g',
      age: 'Vintage',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 8
    },
    {
      id: 3,
      name: 'Landscape Jasper Bracelet VII (6mm)',
      price: '$285',
      mainImage: '/src/assets/tea_image/22.png',
      thumbnails: [
        '/src/assets/tea_image/22.png',
        '/src/assets/tea_image/8.png',
        '/src/assets/tea_image/9.png'
      ],
      // 扩展字段
      name_en: 'Landscape Jasper Bracelet VII (6mm)',
      name_cn: '山水碧玉手镯 VII (6mm)',
      description_en: 'Premium landscape jasper bracelet with natural stone patterns',
      description_cn: '高级山水碧玉手镯，具有天然石材图案',
      dynasty_id: 3,
      shape_id: 3,
      dimensions: '6mm',
      weight: '18g',
      age: 'Antique',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 6
    },
    {
      id: 4,
      name: 'Camel-Turquoise Hematite Bracelet V (4mm)',
      price: '$185',
      mainImage: '/src/assets/tea_image/23.png',
      thumbnails: [
        '/src/assets/tea_image/23.png',
        '/src/assets/tea_image/11.png',
        '/src/assets/tea_image/12.png'
      ],
      // 扩展字段
      name_en: 'Camel-Turquoise Hematite Bracelet V (4mm)',
      name_cn: '骆驼绿松石赤铁矿手镯 V (4mm)',
      description_en: 'Unique camel-turquoise hematite bracelet with earthy tones',
      description_cn: '独特的骆驼绿松石赤铁矿手镯，具有大地色调',
      dynasty_id: 4,
      shape_id: 4,
      dimensions: '4mm',
      weight: '14g',
      age: 'Modern',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 12
    },
    {
      id: 5,
      name: 'Amethyst Bracelet XVII (6mm)',
      price: '$195',
      mainImage: '/src/assets/tea_image/13.png',
      thumbnails: [
        '/src/assets/tea_image/13.png',
        '/src/assets/tea_image/14.png',
        '/src/assets/tea_image/15.png'
      ],
      // 扩展字段
      name_en: 'Amethyst Bracelet XVII (6mm)',
      name_cn: '紫水晶手镯 XVII (6mm)',
      description_en: 'Elegant amethyst bracelet with deep purple crystals',
      description_cn: '优雅的紫水晶手镯，具有深紫色水晶',
      dynasty_id: 5,
      shape_id: 5,
      dimensions: '6mm',
      weight: '16g',
      age: 'Vintage',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 9
    },
    {
      id: 6,
      name: 'Tiger Eye Bracelet I (6mm)',
      price: '$205',
      mainImage: '/src/assets/tea_image/16.png',
      thumbnails: [
        '/src/assets/tea_image/16.png',
        '/src/assets/tea_image/17.png',
        '/src/assets/tea_image/18.png'
      ],
      // 扩展字段
      name_en: 'Tiger Eye Bracelet I (6mm)',
      name_cn: '虎眼石手镯 I (6mm)',
      description_en: 'Striking tiger eye bracelet with golden brown bands',
      description_cn: '引人注目的虎眼石手镯，具有金棕色条纹',
      dynasty_id: 1,
      shape_id: 1,
      dimensions: '6mm',
      weight: '17g',
      age: 'Modern',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 7
    },
    {
      id: 7,
      name: 'Landscape Jasper Bracelet IV (4mm)',
      price: '$255',
      mainImage: '/src/assets/tea_image/20.png',
      thumbnails: [
        '/src/assets/tea_image/20.png',
        '/src/assets/tea_image/20.png',
        '/src/assets/tea_image/3.png'
      ],
      // 扩展字段
      name_en: 'Landscape Jasper Bracelet IV (4mm)',
      name_cn: '山水碧玉手镯 IV (4mm)',
      description_en: 'Refined landscape jasper bracelet with natural formations',
      description_cn: '精致的山水碧玉手镯，具有天然形态',
      dynasty_id: 2,
      shape_id: 2,
      dimensions: '4mm',
      weight: '13g',
      age: 'Antique',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 5
    },
    {
      id: 8,
      name: 'Dragon Blood Jasper V (4mm)',
      price: '$275',
      mainImage: '/src/assets/tea_image/21.png',
      thumbnails: [
        '/src/assets/tea_image/21.png',
        '/src/assets/tea_image/5.png',
        '/src/assets/tea_image/6.png'
      ],
      // 扩展字段
      name_en: 'Dragon Blood Jasper V (4mm)',
      name_cn: '龙血碧玉 V (4mm)',
      description_en: 'Rare dragon blood jasper bracelet with crimson patterns',
      description_cn: '稀有的龙血碧玉手镯，具有深红色图案',
      dynasty_id: 3,
      shape_id: 3,
      dimensions: '4mm',
      weight: '11g',
      age: 'Vintage',
      material: 'Premium Porcelain',
      origin: 'China',
      stock_quantity: 4
    }
  ])

  // Rare Dynasty Collection settings
  const rareDynastyCollection = ref({
    title: 'Rare Dynasty Collection',
    description: 'Crafted in small batches with rare find stones, each piece is made to stand out, just as unique as the person who wears it.',
    buttonText: 'EXPLORE COLLECTION',
    image: '/src/assets/tea_image/best.png'
  })

  // Hero Section settings
  const heroConfig = ref({
    title: 'Express Your Unique Style',
    subtitle: 'MOST TRUSTED SOURCE FOR AUTHENTIC CHINESE PORCELAIN MASTERPIECES',
    backgroundImage: '/src/assets/tea_image/background.png',
    features: [
      'Hand-crafted by Master Artisans',
      'Authenticity Guaranteed',
      'Centuries of Heritage'
    ]
  })

  // Heritage Story settings
  const heritageStory = ref({
    title: 'Forget mass-produced',
    description1: 'From our hands to yours. In China, the birthplace of porcelain, our family-owned business creates each piece with meticulous care, using only the finest materials and traditional techniques.',
    description2: 'A timeless design, authentic craftsmanship - a piece as unique as you are.',
    image: '/src/assets/tea_image/zhizuo.png',
    buttonText: 'Explore Collection'
  })

  // Products Management - Convert bestSellersProducts to products format
  const products = ref<Product[]>([])
  
  // Function to convert bestSellersProducts to products format
  function convertBestSellersToProducts() {
    const convertedProducts: Product[] = bestSellersProducts.value.map((bestSeller, index) => ({
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
      weight: bestSeller.weight || 'Lightweight',
      age: bestSeller.age || 'Modern',
      dynasty_id: bestSeller.dynasty_id || 1,
      shape_id: bestSeller.shape_id || 1,
      dynasty_name: bestSeller.dynasty_name || 'Tang Dynasty',
      shape_name: bestSeller.shape_name || 'Vase',
      primary_image: bestSeller.mainImage || bestSeller.primary_image || '/src/assets/tea_image/1.png',
      images: bestSeller.thumbnails ? bestSeller.thumbnails.map((thumb: string, imgIndex: number) => ({
        id: imgIndex + 1,
        image_path: thumb,
        is_primary: imgIndex === 0,
        sort_order: imgIndex + 1
      })) : [],
      videos: [],
      is_featured: bestSeller.is_featured || false,
      is_available: bestSeller.is_available !== false
    }))
    
    products.value = convertedProducts
    console.log('Converted bestSellersProducts to products:', convertedProducts.length)
  }
  
  // Initialize products from bestSellersProducts
  convertBestSellersToProducts()
  
  // Function to add product to bestsellers (max 8)
  function addProductToBestSellers(product: Product) {
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
      thumbnails: product.images?.map(img => img.image_path) || [product.primary_image],
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
  function removeProductFromBestSellers(productId: number) {
    const index = bestSellersProducts.value.findIndex(p => p.id === productId)
    if (index !== -1) {
      const removedProduct = bestSellersProducts.value.splice(index, 1)[0]
      
      // Update products list
      convertBestSellersToProducts()
      
      console.log('Removed product from bestsellers:', removedProduct.name)
      return true
    }
    return false
  }
  
  // Function to get available products for selection (products not in bestsellers)
  function getAvailableProductsForBestSellers() {
    const bestSellerIds = bestSellersProducts.value.map(p => p.id)
    return products.value.filter(p => !bestSellerIds.includes(p.id))
  }
  const dynasties = ref<Dynasty[]>([
    {
      id: 1,
      name: 'Tang Dynasty',
      name_cn: '唐朝',
      period: '618-907 AD',
      description: 'The golden age of Chinese civilization',
      image: '/src/assets/tea_image/tang.png',
      sort_order: 1,
      is_enabled: true
    },
    {
      id: 2,
      name: 'Song Dynasty',
      name_cn: '宋朝',
      period: '960-1279 AD',
      description: 'Known for refined aesthetics and innovation',
      image: '/src/assets/tea_image/song.png',
      sort_order: 2,
      is_enabled: true
    },
    {
      id: 3,
      name: 'Yuan Dynasty',
      name_cn: '元朝',
      period: '1271-1368 AD',
      description: 'Mongol rule brought new artistic influences',
      image: '/src/assets/tea_image/yuan.png',
      sort_order: 3,
      is_enabled: true
    },
    {
      id: 4,
      name: 'Ming Dynasty',
      name_cn: '明朝',
      period: '1368-1644 AD',
      description: 'Peak of Chinese porcelain craftsmanship',
      image: '/src/assets/tea_image/ming.png',
      sort_order: 4,
      is_enabled: true
    },
    {
      id: 5,
      name: 'Qing Dynasty',
      name_cn: '清朝',
      period: '1644-1912 AD',
      description: 'Imperial porcelain reached new heights',
      image: '/src/assets/tea_image/qing.png',
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
    id: number | string
    filename: string
    original_filename: string
    file_path: string
    file_url: string
    mime_type: string
    file_size: number
    width: number
    height: number
    alt_text: string
    caption: string
    tags: string
    is_public: boolean
    uploaded_by: number
    created_at: string
    is_existing?: boolean
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

  // Best Sellers Product Management - API based

  async function loadBestSellers() {
    try {
      const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          bestSellersProducts.value = result.data;
          console.log('Loaded Best Sellers from API:', bestSellersProducts.value.length, 'products');
        }
      } else {
        console.error('Failed to load Best Sellers from API');
        // Fallback to localStorage if API fails
        const savedBestSellers = localStorage.getItem('bestSellersProducts');
        if (savedBestSellers) {
          bestSellersProducts.value = JSON.parse(savedBestSellers);
        }
      }
    } catch (error) {
      console.error('Error loading Best Sellers from API:', error);
      // Fallback to localStorage if API fails
      const savedBestSellers = localStorage.getItem('bestSellersProducts');
      if (savedBestSellers) {
        bestSellersProducts.value = JSON.parse(savedBestSellers);
      }
    }
  }

  async function updateBestSellerName(index: number, newName: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      const product = bestSellersProducts.value[index];
      bestSellersProducts.value[index].name = newName;
      
      try {
        const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName })
        });

        if (response.ok) {
          // Also update localStorage as backup
          localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
        } else {
          console.error('Failed to update Best Seller name via API');
        }
      } catch (error) {
        console.error('Error updating Best Seller name:', error);
        // Fallback to localStorage
        localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
      }
    }
  }

  async function updateBestSellerPrice(index: number, newPrice: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      const product = bestSellersProducts.value[index];
      bestSellersProducts.value[index].price = newPrice;
      
      try {
        const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ price: newPrice })
        });

        if (response.ok) {
          // Also update localStorage as backup
          localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
        } else {
          console.error('Failed to update Best Seller price via API');
        }
      } catch (error) {
        console.error('Error updating Best Seller price:', error);
        // Fallback to localStorage
        localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
      }
    }
  }

  async function updateBestSellerMainImage(index: number, newImagePath: string) {
    if (index >= 0 && index < bestSellersProducts.value.length) {
      const product = bestSellersProducts.value[index];
      bestSellersProducts.value[index].mainImage = newImagePath;
      
      try {
        const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ mainImage: newImagePath })
        });

        if (response.ok) {
          // Also update localStorage as backup
          localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
        } else {
          console.error('Failed to update Best Seller image via API');
        }
      } catch (error) {
        console.error('Error updating Best Seller image:', error);
        // Fallback to localStorage
        localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
      }
    }
  }

  async function updateBestSellerThumbnail(productIndex: number, thumbnailIndex: number, newImagePath: string) {
    if (productIndex >= 0 && productIndex < bestSellersProducts.value.length &&
        thumbnailIndex >= 0 && thumbnailIndex < bestSellersProducts.value[productIndex].thumbnails.length) {
      bestSellersProducts.value[productIndex].thumbnails[thumbnailIndex] = newImagePath;
      
      // Update localStorage as backup (API doesn't handle thumbnails separately)
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
    }
  }

  async function saveBestSellersConfiguration() {
    try {
      const response = await fetch(`http://106.75.68.99:3000/api/admin/best-sellers`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bestSellers: bestSellersProducts.value })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('Best Sellers configuration saved to server');
          // Also update localStorage as backup
          localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
          return true;
        }
      } else {
        console.error('Failed to save Best Sellers configuration via API');
        // Fallback to localStorage
        localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
        return false;
      }
    } catch (error) {
      console.error('Error saving Best Sellers configuration:', error);
      // Fallback to localStorage
      localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersProducts.value));
      return false;
    }
    return false;
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

  // Hero Section Management
  function updateHeroTitle(newTitle: string) {
    heroConfig.value.title = newTitle
    localStorage.setItem('heroConfig', JSON.stringify(heroConfig.value))
  }

  function updateHeroSubtitle(newSubtitle: string) {
    heroConfig.value.subtitle = newSubtitle
    localStorage.setItem('heroConfig', JSON.stringify(heroConfig.value))
  }

  function updateHeroBackgroundImage(newImage: string) {
    heroConfig.value.backgroundImage = newImage
    localStorage.setItem('heroConfig', JSON.stringify(heroConfig.value))
  }

  function updateHeroFeatures(newFeatures: string[]) {
    heroConfig.value.features = newFeatures
    localStorage.setItem('heroConfig', JSON.stringify(heroConfig.value))
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

  function updateHeritageStoryButtonText(newButtonText: string) {
    heritageStory.value.buttonText = newButtonText
    localStorage.setItem('heritageStory', JSON.stringify(heritageStory.value))
  }

  async function loadSettings() {
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

    // Load bestsellers from localStorage first
    const savedBestSellers = localStorage.getItem('bestSellersProducts')
    if (savedBestSellers) {
      bestSellersProducts.value = JSON.parse(savedBestSellers)
      // Convert bestsellers to products format
      convertBestSellersToProducts()
      console.log('Using bestsellers from localStorage in loadSettings:', bestSellersProducts.value.length)
    } else {
      // If no localStorage data, try to load from API
      try {
        console.log('No localStorage data, loading from API...')
        await loadBestSellers()
        console.log('Loaded bestsellers from API in loadSettings:', bestSellersProducts.value.length)
      } catch (error) {
        console.error('Failed to load from API, using default products:', error)
        // Use default products if API fails
        console.log('Using default products in loadSettings (API failed):', products.value.length)
        localStorage.setItem('products', JSON.stringify(products.value))
      }
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
      const parsedProducts = JSON.parse(savedBestSellersProducts)
      // 确保每个产品都有扩展字段，如果没有则使用默认值
      bestSellersProducts.value = parsedProducts.map((product: any, index: number) => ({
        ...product,
        // 确保有扩展字段
        name_en: product.name_en || product.name || `Product ${index + 1}`,
        name_cn: product.name_cn || product.name || `产品 ${index + 1}`,
        description_en: product.description_en || `Description for ${product.name}`,
        description_cn: product.description_cn || `${product.name}的描述`,
        dynasty_id: product.dynasty_id || 1,
        shape_id: product.shape_id || 1,
        dimensions: product.dimensions || 'Various',
        weight: product.weight || 'Various',
        age: product.age || 'Modern',
        material: product.material || 'Premium Porcelain',
        origin: product.origin || 'China',
        stock_quantity: product.stock_quantity || 10
      }))
    }
    // bestSellersProducts already has default values, so no need to override

    // Always use default rare dynasty collection configuration for consistency
    const savedRareDynastyCollection = localStorage.getItem('rareDynastyCollection')
    if (savedRareDynastyCollection) {
      rareDynastyCollection.value = JSON.parse(savedRareDynastyCollection)
    }
    // rareDynastyCollection already has default values, so no need to override

    // Always use default hero configuration for consistency
    const savedHeroConfig = localStorage.getItem('heroConfig')
    if (savedHeroConfig) {
      heroConfig.value = JSON.parse(savedHeroConfig)
    }
    // heroConfig already has default values, so no need to override

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
    
    // 确保价格是数字类型
    if (productForStorage.price) {
      const priceStr = String(productForStorage.price).replace(/[^0-9.]/g, '')
      productForStorage.price = parseFloat(priceStr) || 0
    }
    
    console.log('Adding product with file objects:', {
      primary_image: productForStorage.primary_image,
      images_count: productForStorage.images?.length || 0,
      price: productForStorage.price,
      price_type: typeof productForStorage.price
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
  async function loadMediaLibrary() {
    try {
      const response = await fetch('http://106.75.68.99:3000/api/media-library', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        mediaLibrary.value = data.media || []
        console.log('媒体库数据已加载:', mediaLibrary.value.length, '个文件')
      } else {
        console.error('Failed to load media library:', response.statusText)
        // 使用默认数据
        mediaLibrary.value = []
      }
    } catch (error) {
      console.error('Error loading media library:', error as Error)
      // 使用默认数据
      mediaLibrary.value = []
    }
  }

  function addMediaFile(file: File, tags: string[] = []) {
    return new Promise<string>((resolve, reject) => {
      const newId = Math.max(...mediaLibrary.value.map(m => typeof m.id === 'number' ? m.id : 0), 0) + 1
      
      // Create a simple path identifier instead of storing base64
      const fileName = `media_${newId}_${Date.now()}.${file.name.split('.').pop()}`
      const localPath = `/media/${fileName}`
      
      const mediaItem = {
        id: newId,
        filename: file.name,
        original_filename: file.name,
        file_path: localPath,
        file_url: localPath,
        mime_type: file.type,
        file_size: file.size,
        width: 0,
        height: 0,
        alt_text: '',
        caption: '',
        tags: tags.join(','),
        is_public: true,
        uploaded_by: 1,
        created_at: new Date().toISOString(),
        is_existing: false
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

  // Load all data from API and localStorage
  async function loadAllData() {
    loadSettings()
    
    // loadSettings() already handles products loading, so no need to duplicate here
    // This ensures consistency between local and public access
    
    // Load Best Sellers data from API first, fallback to localStorage
    await loadBestSellers()
    
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
    heroConfig,
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
    updateHeroTitle,
    updateHeroSubtitle,
    updateHeroBackgroundImage,
    updateHeroFeatures,
    updateProductImagePath,
    updateDynastyImagePath,
    updateThumbnailImagePath,
    updateBestSellerMainImage,
    updateBestSellerThumbnail,
    loadMediaLibrary,
    updateBestSellerName,
    updateBestSellerPrice,
    loadBestSellers,
    saveBestSellersConfiguration,
    updateRareDynastyTitle,
    updateRareDynastyDescription,
    updateRareDynastyButtonText,
    updateRareDynastyImage,
    updateHeritageStoryTitle,
    updateHeritageStoryDescription1,
    updateHeritageStoryDescription2,
    updateHeritageStoryImage,
    updateHeritageStoryButtonText,
    loadSettings,
    
    // Product management functions
    convertBestSellersToProducts,
    addProductToBestSellers,
    removeProductFromBestSellers,
    getAvailableProductsForBestSellers,
    
    // Image processing utilities
    fileToCompressedBase64,
    
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
