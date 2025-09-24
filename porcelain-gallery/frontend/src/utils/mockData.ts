// Initialize admin store with database data
import { useAdminStore } from '@/stores/admin-new'

// Mock data based on database content
const mockProducts = [
  {
    "id": 1,
    "name_en": "Blue and White Porcelain Vase",
    "name_cn": "青花瓷花瓶",
    "slug": "blue-white-porcelain-vase",
    "description_en": "Classic blue and white porcelain vase from the Ming Dynasty, featuring traditional Chinese motifs and exquisite craftsmanship.",
    "description_cn": "明代经典青花瓷花瓶，采用传统中国图案，工艺精湛。",
    "craftsmanship_en": "Hand-painted with cobalt blue underglaze on white porcelain body.",
    "craftsmanship_cn": "在白瓷胎上手工绘制钴蓝釉下彩。",
    "history_en": "Blue and white porcelain originated in the Tang Dynasty and reached its peak during the Ming Dynasty.",
    "history_cn": "青花瓷起源于唐代，在明代达到鼎盛。",
    "price": 255,
    "original_price": 300,
    "dimensions": "Height: 25cm, Width: 15cm",
    "weight": "1.2kg",
    "age": "Antique",
    "material": "Porcelain",
    "color": "Blue and White",
    "dynasty_id": 4,
    "shape_id": 1,
    "primary_image_id": 7,
    "sku": "BWV-001",
    "stock_quantity": 5,
    "is_featured": true,
    "is_available": true,
    "is_digital": false,
    "meta_title": "Blue and White Porcelain Vase - Ming Dynasty",
    "meta_description": "Authentic Ming Dynasty blue and white porcelain vase",
    "meta_keywords": "porcelain, vase, blue, white, ming dynasty",
    "view_count": 0,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z",
    "primary_image_url": "/src/assets/tea_image/1.png",
    "images": [
      {
        id: 1,
        product_id: 1,
        image_url: "/src/assets/tea_image/1.png",
        image_path: "/src/assets/tea_image/1.png",
        alt_text: "Blue and White Porcelain Vase",
        caption: "Classic blue and white porcelain vase",
        is_primary: true,
        sort_order: 1,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      },
      {
        id: 2,
        product_id: 1,
        image_url: "/src/assets/tea_image/2.png",
        image_path: "/src/assets/tea_image/2.png",
        alt_text: "Blue and White Porcelain Vase Detail",
        caption: "Detail view of the vase",
        is_primary: false,
        sort_order: 2,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      }
    ]
  },
  {
    "id": 2,
    "name_en": "Celadon Tea Set",
    "name_cn": "青瓷茶具",
    "slug": "celadon-tea-set",
    "description_en": "Elegant celadon tea set from the Song Dynasty, known for its jade-like color and delicate form.",
    "description_cn": "宋代优雅青瓷茶具，以其玉般的颜色和精致的造型而闻名。",
    "craftsmanship_en": "Fired at high temperature with iron-rich glaze creating the characteristic celadon color.",
    "craftsmanship_cn": "高温烧制，富含铁的釉料创造出特有的青瓷颜色。",
    "history_en": "Celadon ware was highly prized during the Song Dynasty for its aesthetic beauty.",
    "history_cn": "青瓷在宋代因其美学价值而备受推崇。",
    "price": 180,
    "original_price": 220,
    "dimensions": "Teapot: 15cm height, Cups: 6cm height",
    "weight": "0.8kg",
    "age": "Antique",
    "material": "Celadon",
    "color": "Celadon Green",
    "dynasty_id": 2,
    "shape_id": 2,
    "primary_image_id": 9,
    "sku": "CTS-002",
    "stock_quantity": 3,
    "is_featured": true,
    "is_available": true,
    "is_digital": false,
    "meta_title": "Celadon Tea Set - Song Dynasty",
    "meta_description": "Authentic Song Dynasty celadon tea set",
    "meta_keywords": "celadon, tea set, song dynasty, green",
    "view_count": 0,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z",
    "primary_image_url": "/src/assets/tea_image/3.png",
    "images": [
      {
        id: 3,
        product_id: 2,
        image_url: "/src/assets/tea_image/3.png",
        image_path: "/src/assets/tea_image/3.png",
        alt_text: "Celadon Tea Set",
        caption: "Authentic Song Dynasty celadon tea set",
        is_primary: true,
        sort_order: 1,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      },
      {
        id: 4,
        product_id: 2,
        image_url: "/src/assets/tea_image/4.png",
        image_path: "/src/assets/tea_image/4.png",
        alt_text: "Celadon Tea Set Detail",
        caption: "Detail view of the tea set",
        is_primary: false,
        sort_order: 2,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      }
    ]
  },
  {
    "id": 3,
    "name_en": "Tang Dynasty Horse Figurine",
    "name_cn": "唐代马俑",
    "slug": "tang-dynasty-horse-figurine",
    "description_en": "Exquisite Tang Dynasty horse figurine, symbolizing prosperity and power in ancient China.",
    "description_cn": "精美的唐代马俑，象征着古代中国的繁荣和权力。",
    "craftsmanship_en": "Hand-molded terracotta with detailed carving and painted decoration.",
    "craftsmanship_cn": "手工塑造的陶器，带有精细的雕刻和彩绘装饰。",
    "history_en": "Tang Dynasty horses were symbols of wealth and military power.",
    "history_cn": "唐代马匹是财富和军事实力的象征。",
    "price": 320,
    "original_price": 380,
    "dimensions": "Height: 20cm, Length: 25cm",
    "weight": "1.5kg",
    "age": "Antique",
    "material": "Terracotta",
    "color": "Earthenware",
    "dynasty_id": 1,
    "shape_id": 3,
    "primary_image_id": 11,
    "sku": "THF-003",
    "stock_quantity": 2,
    "is_featured": true,
    "is_available": true,
    "is_digital": false,
    "meta_title": "Tang Dynasty Horse Figurine",
    "meta_description": "Authentic Tang Dynasty horse figurine",
    "meta_keywords": "tang dynasty, horse, figurine, terracotta",
    "view_count": 0,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z",
    "primary_image_url": "/src/assets/tea_image/5.png",
    "images": [
      {
        id: 5,
        product_id: 3,
        image_url: "/src/assets/tea_image/5.png",
        image_path: "/src/assets/tea_image/5.png",
        alt_text: "Tang Dynasty Horse Figurine",
        caption: "Ancient Tang Dynasty horse figurine",
        is_primary: true,
        sort_order: 1,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      },
      {
        id: 6,
        product_id: 3,
        image_url: "/src/assets/tea_image/6.png",
        image_path: "/src/assets/tea_image/6.png",
        alt_text: "Tang Dynasty Horse Figurine Detail",
        caption: "Detail view of the horse figurine",
        is_primary: false,
        sort_order: 2,
        width: 800,
        height: 600,
        file_size: 1024000,
        created_at: "2025-09-17T06:48:58.000Z"
      }
    ]
  }
];

const mockDynasties = [
  {
    "id": 1,
    "name": "Tang Dynasty",
    "name_cn": "唐朝",
    "period": "618-907",
    "description": "The Tang Dynasty was a golden age of Chinese civilization.",
    "description_cn": "唐朝是中国文明的黄金时代。",
    "image_url": "/src/assets/tea_image/tang.png",
    "sort_order": 1,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 2,
    "name": "Song Dynasty",
    "name_cn": "宋朝",
    "period": "960-1279",
    "description": "The Song Dynasty was known for its cultural achievements and technological innovations.",
    "description_cn": "宋朝以其文化成就和技术创新而闻名。",
    "image_url": "/src/assets/tea_image/song.png",
    "sort_order": 2,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 3,
    "name": "Ming Dynasty",
    "name_cn": "明朝",
    "period": "1368-1644",
    "description": "The Ming Dynasty was a period of great cultural and artistic achievement.",
    "description_cn": "明朝是文化和艺术成就的伟大时期。",
    "image_url": "/src/assets/tea_image/ming.png",
    "sort_order": 3,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 4,
    "name": "Qing Dynasty",
    "name_cn": "清朝",
    "period": "1644-1912",
    "description": "The Qing Dynasty was the last imperial dynasty of China.",
    "description_cn": "清朝是中国最后一个封建王朝。",
    "image_url": "/src/assets/tea_image/qing.png",
    "sort_order": 4,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  }
];

const mockShapes = [
  {
    "id": 1,
    "name": "Vase",
    "name_cn": "花瓶",
    "description": "Traditional Chinese vase for decoration and display.",
    "description_cn": "传统中国花瓶，用于装饰和展示。",
    "sort_order": 1,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 2,
    "name": "Tea Set",
    "name_cn": "茶具",
    "description": "Complete tea set including teapot and cups.",
    "description_cn": "完整茶具，包括茶壶和茶杯。",
    "sort_order": 2,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 3,
    "name": "Figurine",
    "name_cn": "雕像",
    "description": "Decorative figurines and sculptures.",
    "description_cn": "装饰性雕像和雕塑。",
    "sort_order": 3,
    "is_enabled": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  }
];

const mockContentSections = [
  {
    "id": 1,
    "section_key": "best_sellers",
    "title_en": "Best Sellers",
    "title_cn": "热销产品",
    "content_en": "Discover our most popular porcelain pieces",
    "content_cn": "发现我们最受欢迎的瓷器作品",
    "image_url": "/src/assets/tea_image/best-sellers.png",
    "button_text_en": "View All",
    "button_text_cn": "查看全部",
    "sort_order": 1,
    "is_active": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 2,
    "section_key": "rare_dynasty",
    "title_en": "Explore by Dynasty",
    "title_cn": "按朝代探索",
    "content_en": "Exclusive pieces from ancient Chinese dynasties",
    "content_cn": "来自中国古代朝代的独家作品",
    "image_url": "/src/assets/tea_image/rare-dynasty.png",
    "button_text_en": "Explore Collection",
    "button_text_cn": "探索收藏",
    "sort_order": 2,
    "is_active": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 3,
    "section_key": "heritage_story",
    "title_en": "Forget mass-produced",
    "title_cn": "忘记批量生产",
    "content_en": "Discover the rich history and craftsmanship behind each piece",
    "content_cn": "发现每件作品背后的丰富历史和工艺",
    "image_url": "/src/assets/tea_image/heritage.png",
    "button_text_en": "Learn More",
    "button_text_cn": "了解更多",
    "sort_order": 3,
    "is_active": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  }
];

const mockSiteSettings = [
  {
    "id": 1,
    "setting_key": "site_title",
    "setting_value": "Porcelain Gallery",
    "setting_type": "text" as const,
    "is_public": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 2,
    "setting_key": "site_description",
    "setting_value": "Discover the beauty of Chinese porcelain art",
    "setting_type": "text" as const,
    "is_public": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 3,
    "setting_key": "site_phone",
    "setting_value": "+86 123 4567 8900",
    "setting_type": "text" as const,
    "is_public": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  },
  {
    "id": 4,
    "setting_key": "site_email",
    "setting_value": "info@porcelain-gallery.com",
    "setting_type": "text" as const,
    "is_public": true,
    "created_at": "2025-09-17T06:48:58.000Z",
    "updated_at": "2025-09-17T06:48:58.000Z"
  }
];

// Initialize admin store with mock data
export function initializeAdminStore() {
  const adminStore = useAdminStore()
  
  // Set products
  adminStore.products = mockProducts
  adminStore.bestSellersProducts = mockProducts.filter(p => p.is_featured)
  
  // Set dynasties and shapes
  adminStore.dynasties = mockDynasties
  adminStore.shapes = mockShapes
  
  // Set content sections
  adminStore.contentSections = mockContentSections
  adminStore.rareDynastyCollection = mockContentSections.find(c => c.section_key === 'rare_dynasty') || null
  adminStore.heritageStory = mockContentSections.find(c => c.section_key === 'heritage_story') || null
  
  // Set site settings
  adminStore.siteSettings = mockSiteSettings
  
  // Set dynasty images
  adminStore.dynastyImages = mockDynasties.map(d => d.image_url)
  
  console.log('Admin store initialized with database data:', {
    products: adminStore.products.length,
    dynasties: adminStore.dynasties.length,
    shapes: adminStore.shapes.length,
    contentSections: adminStore.contentSections.length,
    siteSettings: adminStore.siteSettings.length
  })
}

// Export mock data for use in components
export { mockProducts, mockDynasties, mockShapes, mockContentSections, mockSiteSettings }
