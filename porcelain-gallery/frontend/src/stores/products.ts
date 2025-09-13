import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import axios from 'axios'

// const API_BASE_URL = 'http://localhost:3000/api'

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

export interface Filter {
  dynasty_id?: number
  shape_id?: number
  is_featured?: boolean
}

// Static product data matching Aurum Brothers style
const staticProducts: Product[] = [
  {
    id: 1,
    name_en: "Blue and White Porcelain Vase",
    name_cn: "青花瓷花瓶",
    description_en: "Classic blue and white porcelain vase from the Ming Dynasty, featuring traditional Chinese motifs and exquisite craftsmanship.",
    description_cn: "明代经典青花瓷花瓶，采用传统中国图案，工艺精湛。",
    craftsmanship_en: "Hand-painted with cobalt blue underglaze on white porcelain body.",
    craftsmanship_cn: "在白瓷胎上手工绘制钴蓝釉下彩。",
    history_en: "Blue and white porcelain originated in the Tang Dynasty and reached its peak during the Ming Dynasty.",
    history_cn: "青花瓷起源于唐代，在明代达到鼎盛。",
    price: 255,
    dimensions: "Height: 25cm, Width: 15cm",
    weight: "1.2kg",
    age: "Antique",
    dynasty_id: 4,
    shape_id: 1,
    dynasty_name: "Ming Dynasty",
    shape_name: "Vase",
    primary_image: "/src/assets/tea_image/1.png",
    images: [
      { id: 1, image_path: "/src/assets/tea_image/1.png", is_primary: true, sort_order: 1 },
      { id: 2, image_path: "/src/assets/tea_image/2.png", is_primary: false, sort_order: 2 },
      { id: 3, image_path: "/src/assets/tea_image/3.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: true,
    is_available: true
  },
  {
    id: 2,
    name_en: "Famille Rose Tea Bowl",
    name_cn: "粉彩茶碗",
    description_en: "Elegant famille rose tea bowl with delicate floral patterns, perfect for traditional tea ceremonies.",
    description_cn: "优雅的粉彩茶碗，带有精美的花卉图案，非常适合传统茶道。",
    craftsmanship_en: "Hand-painted with famille rose enamels over white porcelain.",
    craftsmanship_cn: "在白瓷上手工绘制粉彩釉料。",
    history_en: "Famille rose technique was developed during the Qing Dynasty.",
    history_cn: "粉彩技术发展于清代。",
    price: 275,
    dimensions: "Diameter: 12cm, Height: 6cm",
    weight: "0.3kg",
    age: "Antique",
    dynasty_id: 5,
    shape_id: 2,
    dynasty_name: "Qing Dynasty",
    shape_name: "Bowl",
    primary_image: "/src/assets/tea_image/4.png",
    images: [
      { id: 4, image_path: "/src/assets/tea_image/4.png", is_primary: true, sort_order: 1 },
      { id: 5, image_path: "/src/assets/tea_image/5.png", is_primary: false, sort_order: 2 },
      { id: 6, image_path: "/src/assets/tea_image/6.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: true,
    is_available: true
  },
  {
    id: 3,
    name_en: "Celadon Glazed Plate",
    name_cn: "青瓷盘",
    description_en: "Beautiful celadon glazed plate with subtle green tones, representing the pinnacle of Song Dynasty ceramics.",
    description_cn: "美丽的青瓷盘，带有淡雅的绿色调，代表了宋代陶瓷的巅峰。",
    craftsmanship_en: "Fired with celadon glaze to achieve the characteristic jade-like appearance.",
    craftsmanship_cn: "采用青瓷釉烧制，达到玉质般的外观。",
    history_en: "Celadon ware was highly prized during the Song Dynasty for its refined beauty.",
    history_cn: "青瓷在宋代因其精致的美感而备受推崇。",
    price: 285,
    dimensions: "Diameter: 20cm, Height: 3cm",
    weight: "0.8kg",
    age: "Antique",
    dynasty_id: 2,
    shape_id: 3,
    dynasty_name: "Song Dynasty",
    shape_name: "Plate",
    primary_image: "/src/assets/tea_image/7.png",
    images: [
      { id: 7, image_path: "/src/assets/tea_image/7.png", is_primary: true, sort_order: 1 },
      { id: 8, image_path: "/src/assets/tea_image/8.png", is_primary: false, sort_order: 2 },
      { id: 9, image_path: "/src/assets/tea_image/9.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: true,
    is_available: true
  },
  {
    id: 4,
    name_en: "Tang Dynasty Tri-color Pottery",
    name_cn: "唐三彩陶器",
    description_en: "Vibrant Tang Dynasty tri-color pottery featuring traditional Chinese patterns and bold colors.",
    description_cn: "色彩鲜艳的唐三彩陶器，具有传统中国图案和大胆的色彩。",
    craftsmanship_en: "Fired with lead-glazed earthenware in three primary colors.",
    craftsmanship_cn: "采用铅釉陶器烧制，使用三种主要颜色。",
    history_en: "Tri-color pottery was a hallmark of Tang Dynasty ceramic art.",
    history_cn: "三彩陶器是唐代陶瓷艺术的标志。",
    price: 185,
    dimensions: "Height: 18cm, Width: 12cm",
    weight: "0.9kg",
    age: "Antique",
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: "Tang Dynasty",
    shape_name: "Vase",
    primary_image: "/src/assets/tea_image/10.png",
    images: [
      { id: 10, image_path: "/src/assets/tea_image/10.png", is_primary: true, sort_order: 1 },
      { id: 11, image_path: "/src/assets/tea_image/11.png", is_primary: false, sort_order: 2 },
      { id: 12, image_path: "/src/assets/tea_image/12.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: true,
    is_available: true
  },
  {
    id: 5,
    name_en: "Amethyst Bracelet XVII (6mm)",
    name_cn: "紫水晶手链 XVII (6mm)",
    description_en: "Deep purple amethyst beads in a classic bracelet design. Known for its calming and spiritual properties.",
    description_cn: "经典手链设计中的深紫色紫水晶珠子。以其镇静和精神特性而闻名。",
    craftsmanship_en: "Premium amethyst beads with sterling silver accents.",
    craftsmanship_cn: "优质紫水晶珠子配纯银装饰。",
    history_en: "Amethyst has been associated with spirituality and protection since ancient times.",
    history_cn: "紫水晶自古以来就与灵性和保护联系在一起。",
    price: 195,
    dimensions: "6mm beads",
    weight: "24g",
    age: "Modern",
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: "Modern",
    shape_name: "Bracelet",
    primary_image: "/src/assets/tea_image/13.png",
    images: [
      { id: 13, image_path: "/src/assets/tea_image/13.png", is_primary: true, sort_order: 1 },
      { id: 14, image_path: "/src/assets/tea_image/14.png", is_primary: false, sort_order: 2 },
      { id: 15, image_path: "/src/assets/tea_image/15.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: true,
    is_available: true
  },
  {
    id: 6,
    name_en: "Tiger Eye Bracelet I (6mm)",
    name_cn: "虎眼石手链 I (6mm)",
    description_en: "Golden tiger eye beads with their characteristic chatoyancy effect. Perfect for confidence and focus.",
    description_cn: "金色虎眼石珠子具有其特征性的猫眼效应。非常适合自信和专注。",
    craftsmanship_en: "Each bead showcases the natural tiger eye pattern.",
    craftsmanship_cn: "每颗珠子都展示了天然的虎眼石图案。",
    history_en: "Tiger Eye has been used for protection and courage throughout history.",
    history_cn: "虎眼石在历史上一直被用于保护和勇气。",
    price: 165,
    dimensions: "6mm beads",
    weight: "26g",
    age: "Modern",
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: "Modern",
    shape_name: "Bracelet",
    primary_image: "/src/assets/tea_image/16.png",
    images: [
      { id: 16, image_path: "/src/assets/tea_image/16.png", is_primary: true, sort_order: 1 },
      { id: 17, image_path: "/src/assets/tea_image/17.png", is_primary: false, sort_order: 2 },
      { id: 18, image_path: "/src/assets/tea_image/18.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: false,
    is_available: true
  },
  {
    id: 7,
    name_en: "Black Onyx Bracelet II (4mm)",
    name_cn: "黑玛瑙手链 II (4mm)",
    description_en: "Elegant black onyx beads in a sophisticated bracelet design. Perfect for formal occasions.",
    description_cn: "精致手链设计中的优雅黑玛瑙珠子。非常适合正式场合。",
    craftsmanship_en: "High-quality onyx with perfect polish and finish.",
    craftsmanship_cn: "高品质玛瑙，抛光完美，饰面精美。",
    history_en: "Onyx has been prized for its elegance and protective properties.",
    history_cn: "玛瑙因其优雅和保护特性而受到珍视。",
    price: 145,
    dimensions: "4mm beads",
    weight: "18g",
    age: "Modern",
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: "Modern",
    shape_name: "Bracelet",
    primary_image: "/src/assets/tea_image/19.png",
    images: [
      { id: 19, image_path: "/src/assets/tea_image/19.png", is_primary: true, sort_order: 1 },
      { id: 20, image_path: "/src/assets/tea_image/1.png", is_primary: false, sort_order: 2 },
      { id: 21, image_path: "/src/assets/tea_image/2.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: false,
    is_available: true
  },
  {
    id: 8,
    name_en: "Yuan Dynasty Blue Glazed Teapot",
    name_cn: "元代蓝釉茶壶",
    description_en: "Rare Yuan Dynasty blue glazed teapot with single image documentation, showcasing the unique ceramic techniques of the period.",
    description_cn: "罕见的元代蓝釉茶壶，单张图片记录，展示了该时期独特的陶瓷技术。",
    craftsmanship_en: "Hand-thrown pottery with distinctive blue glaze firing technique.",
    craftsmanship_cn: "手工拉坯陶器，采用独特的蓝釉烧制技术。",
    history_en: "Yuan Dynasty ceramics marked a transition period in Chinese pottery development.",
    history_cn: "元代陶瓷标志着中国陶器发展的过渡期。",
    price: 100,
    dimensions: "Height: 15cm, Width: 12cm",
    weight: "0.5kg",
    age: "Antique",
    dynasty_id: 3,
    shape_id: 4,
    dynasty_name: "Yuan Dynasty",
    shape_name: "Teapot",
    primary_image: "/src/assets/tea_image/20.png",
    images: [
      { id: 22, image_path: "/src/assets/tea_image/20.png", is_primary: true, sort_order: 1 }
    ],
    videos: [],
    is_featured: false,
    is_available: true
  },
  {
    id: 9,
    name_en: "Lapis Lazuli Bracelet III (6mm)",
    name_cn: "青金石手链 III (6mm)",
    description_en: "Deep blue lapis lazuli beads with golden pyrite inclusions. A stone of wisdom and truth.",
    description_cn: "深蓝色青金石珠子带有金色黄铁矿包裹体。智慧与真理之石。",
    craftsmanship_en: "Authentic lapis lazuli with natural pyrite flecks.",
    craftsmanship_cn: "天然青金石带有天然黄铁矿斑点。",
    history_en: "Lapis lazuli has been used in jewelry for over 6000 years.",
    history_cn: "青金石在珠宝中的使用已有6000多年的历史。",
    price: 225,
    dimensions: "6mm beads",
    weight: "27g",
    age: "Modern",
    dynasty_id: 1,
    shape_id: 1,
    dynasty_name: "Modern",
    shape_name: "Bracelet",
    primary_image: "/src/assets/tea_image/3.png",
    images: [
      { id: 22, image_path: "/src/assets/tea_image/3.png", is_primary: true, sort_order: 1 },
      { id: 23, image_path: "/src/assets/tea_image/4.png", is_primary: false, sort_order: 2 },
      { id: 24, image_path: "/src/assets/tea_image/5.png", is_primary: false, sort_order: 3 }
    ],
    videos: [],
    is_featured: false,
    is_available: true
  }
]

export const useProductsStore = defineStore('products', () => {
  // Initialize with empty array - all products should come from adminStore
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<Filter>({})
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(staticProducts.length)
  const itemsPerPage = ref(12)

  const filteredProducts = computed(() => {
    let filtered = products.value

    if (filters.value.dynasty_id) {
      filtered = filtered.filter(p => p.dynasty_id === filters.value.dynasty_id)
    }

    if (filters.value.shape_id) {
      filtered = filtered.filter(p => p.shape_id === filters.value.shape_id)
    }

    if (filters.value.is_featured) {
      filtered = filtered.filter(p => p.is_featured)
    }

    return filtered
  })

  const featuredProducts = computed(() => 
    products.value.filter(p => p.is_featured)
  )

  async function fetchProducts(page = 1, limit = 12) {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Products should come from adminStore, not static data
      // This function is kept for compatibility but should not be used
      console.warn('fetchProducts called on productsStore - products should come from adminStore')
      
      products.value = []
      currentPage.value = page
      totalPages.value = 0
      totalItems.value = 0
      itemsPerPage.value = limit
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: number) {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Products should come from adminStore, not static data
      console.warn('fetchProduct called on productsStore - products should come from adminStore')
      
      currentProduct.value = null
      error.value = 'Product not found - use adminStore instead'
    } catch (err) {
      error.value = 'Failed to fetch product'
      console.error('Error fetching product:', err)
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Filter) {
    filters.value = { ...newFilters }
    currentPage.value = 1
  }

  function clearFilters() {
    filters.value = {}
    currentPage.value = 1
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    filteredProducts,
    featuredProducts,
    fetchProducts,
    fetchProduct,
    setFilters,
    clearFilters
  }
})