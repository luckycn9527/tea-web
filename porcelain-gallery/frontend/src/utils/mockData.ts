// Initialize admin store with database data
import { useAdminStore } from '@/stores/admin-new'

// Mock data based on database content
const mockProducts = [];

const mockDynasties = [
  {
    "id": 1,
    "name": "Han Dynasty",
    "name_cn": "汉朝",
    "period": "206 BC - 220 AD",
    "description": "Early ceramic development and proto-porcelain",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 2,
    "name": "Three Kingdoms",
    "name_cn": "三国",
    "period": "220-280 AD",
    "description": "Regional ceramic styles development",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 3,
    "name": "Jin Dynasty",
    "name_cn": "晋朝",
    "period": "265-420 AD",
    "description": "Transitional period ceramics",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 4,
    "name": "Northern and Southern Dynasties",
    "name_cn": "南北朝",
    "period": "420-589 AD",
    "description": "Buddhist influence on ceramics",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 5,
    "name": "Sui Dynasty",
    "name_cn": "隋朝",
    "period": "581-618 AD",
    "description": "Unification of ceramic styles",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 6,
    "name": "Five Dynasties",
    "name_cn": "五代十国",
    "period": "907-960 AD",
    "description": "Regional kiln development",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 7,
    "name": "Liao Dynasty",
    "name_cn": "辽朝",
    "period": "907-1125 AD",
    "description": "Nomadic influenced ceramics",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 8,
    "name": "Western Xia",
    "name_cn": "西夏",
    "period": "1038-1227 AD",
    "description": "Tangut ethnic ceramics",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 9,
    "name": "Jin Dynasty (1115)",
    "name_cn": "金朝",
    "period": "1115-1234 AD",
    "description": "Jurchen influenced porcelain",
    "description_cn": null,
    "image_url": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  }
];

const mockShapes = [
  {
    "id": 1,
    "name": "Jar",
    "name_cn": "罐",
    "description": "Cylindrical container with wide mouth",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 2,
    "name": "Censer",
    "name_cn": "炉",
    "description": "Incense burner for religious ceremonies",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 3,
    "name": "Ewer",
    "name_cn": "执壶",
    "description": "Pouring vessel with handle and spout",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 4,
    "name": "Dish",
    "name_cn": "碟",
    "description": "Small shallow plate",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 5,
    "name": "Cup",
    "name_cn": "杯",
    "description": "Drinking vessel",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 6,
    "name": "Saucer",
    "name_cn": "茶托",
    "description": "Small plate for holding tea cup",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 7,
    "name": "Box",
    "name_cn": "盒",
    "description": "Container with lid",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 8,
    "name": "Vessel",
    "name_cn": "器",
    "description": "General term for containers",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 9,
    "name": "Ornament",
    "name_cn": "摆件",
    "description": "Decorative object",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  },
  {
    "id": 10,
    "name": "Sculpture",
    "name_cn": "雕塑",
    "description": "Three-dimensional art piece",
    "description_cn": null,
    "sort_order": 0,
    "is_enabled": 1,
    "created_at": "2025-09-17T02:37:14.000Z",
    "updated_at": "2025-09-17T02:37:14.000Z"
  }
];

const mockContentSections = [];

const mockSiteSettings = [];

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
