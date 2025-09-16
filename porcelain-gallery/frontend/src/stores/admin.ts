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
    image: '/src/assets/tea_image/zhizuo.png'
  })

  // Products Management
  const products = ref<Product[]>([
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
        { id: 2, image_path: "/src/assets/tea_image/2.png", is_primary: false, sort_order: 2 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 2,
      name_en: "Celadon Tea Set",
      name_cn: "青瓷茶具",
      description_en: "Elegant celadon tea set from the Song Dynasty, known for its jade-like color and delicate form.",
      description_cn: "宋代优雅青瓷茶具，以其玉般的颜色和精致的造型而闻名。",
      craftsmanship_en: "Fired at high temperature with iron-rich glaze creating the characteristic celadon color.",
      craftsmanship_cn: "高温烧制，富含铁的釉料创造出特有的青瓷颜色。",
      history_en: "Celadon ware was highly prized during the Song Dynasty for its aesthetic beauty.",
      history_cn: "青瓷在宋代因其美学价值而备受推崇。",
      price: 180,
      dimensions: "Teapot: 15cm height, Cups: 6cm height",
      weight: "0.8kg",
      age: "Antique",
      dynasty_id: 2,
      shape_id: 2,
      dynasty_name: "Song Dynasty",
      shape_name: "Tea Set",
      primary_image: "/src/assets/tea_image/3.png",
      images: [
        { id: 3, image_path: "/src/assets/tea_image/3.png", is_primary: true, sort_order: 1 },
        { id: 4, image_path: "/src/assets/tea_image/4.png", is_primary: false, sort_order: 2 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 3,
      name_en: "Tang Dynasty Horse Figurine",
      name_cn: "唐代马俑",
      description_en: "Exquisite Tang Dynasty horse figurine, symbolizing prosperity and power in ancient China.",
      description_cn: "精美的唐代马俑，象征着古代中国的繁荣和权力。",
      craftsmanship_en: "Hand-molded terracotta with detailed carving and painted decoration.",
      craftsmanship_cn: "手工塑造的陶器，带有精细的雕刻和彩绘装饰。",
      history_en: "Tang Dynasty horses were symbols of wealth and military power.",
      history_cn: "唐代马匹是财富和军事实力的象征。",
      price: 320,
      dimensions: "Height: 20cm, Length: 25cm",
      weight: "1.5kg",
      age: "Antique",
      dynasty_id: 1,
      shape_id: 3,
      dynasty_name: "Tang Dynasty",
      shape_name: "Figurine",
      primary_image: "/src/assets/tea_image/5.png",
      images: [
        { id: 5, image_path: "/src/assets/tea_image/5.png", is_primary: true, sort_order: 1 },
        { id: 6, image_path: "/src/assets/tea_image/6.png", is_primary: false, sort_order: 2 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 4,
      name_en: "Yuan Dynasty Blue and White Bowl",
      name_cn: "元代青花碗",
      description_en: "Exquisite blue and white bowl from the Yuan Dynasty, showcasing the early development of blue and white porcelain.",
      description_cn: "元代精美的青花碗，展示了青花瓷的早期发展。",
      craftsmanship_en: "Hand-painted cobalt blue designs on white porcelain with traditional Chinese motifs.",
      craftsmanship_cn: "在白瓷上手工绘制钴蓝图案，采用传统中国纹样。",
      history_en: "The Yuan Dynasty marked the beginning of blue and white porcelain production in China.",
      history_cn: "元代标志着中国青花瓷生产的开始。",
      price: 180,
      dimensions: "Diameter: 20cm, Height: 8cm",
      weight: "0.8kg",
      age: "Antique",
      dynasty_id: 3,
      shape_id: 4,
      dynasty_name: "Yuan Dynasty",
      shape_name: "Bowl",
      primary_image: "/src/assets/tea_image/7.png",
      images: [
        { id: 7, image_path: "/src/assets/tea_image/7.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 5,
      name_en: "Ming Dynasty Celadon Vase",
      name_cn: "明代青瓷花瓶",
      description_en: "Beautiful celadon vase from the Ming Dynasty, featuring the characteristic jade-like green glaze.",
      description_cn: "明代美丽的青瓷花瓶，具有特有的玉绿色釉面。",
      craftsmanship_en: "High-fired celadon with iron-rich glaze creating the characteristic green color.",
      craftsmanship_cn: "高温烧制的青瓷，富含铁的釉料创造出特有的绿色。",
      history_en: "Celadon ware was highly prized during the Ming Dynasty for its aesthetic beauty.",
      history_cn: "青瓷在明代因其美学价值而备受推崇。",
      price: 320,
      dimensions: "Height: 30cm, Width: 18cm",
      weight: "1.5kg",
      age: "Antique",
      dynasty_id: 4,
      shape_id: 1,
      dynasty_name: "Ming Dynasty",
      shape_name: "Vase",
      primary_image: "/src/assets/tea_image/8.png",
      images: [
        { id: 8, image_path: "/src/assets/tea_image/8.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 6,
      name_en: "Song Dynasty White Porcelain Plate",
      name_cn: "宋代白瓷盘",
      description_en: "Elegant white porcelain plate from the Song Dynasty, known for its pure white color and refined craftsmanship.",
      description_cn: "宋代优雅的白瓷盘，以其纯白色和精湛工艺而闻名。",
      craftsmanship_en: "High-fired white porcelain with pure white glaze and delicate form.",
      craftsmanship_cn: "高温烧制的白瓷，具有纯白釉面和精致造型。",
      history_en: "White porcelain reached its peak during the Song Dynasty.",
      history_cn: "白瓷在宋代达到鼎盛。",
      price: 150,
      dimensions: "Diameter: 25cm, Height: 3cm",
      weight: "0.6kg",
      age: "Antique",
      dynasty_id: 2,
      shape_id: 5,
      dynasty_name: "Song Dynasty",
      shape_name: "Plate",
      primary_image: "/src/assets/tea_image/9.png",
      images: [
        { id: 9, image_path: "/src/assets/tea_image/9.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 7,
      name_en: "Qing Dynasty Famille Rose Vase",
      name_cn: "清代粉彩花瓶",
      description_en: "Exquisite famille rose vase from the Qing Dynasty, featuring vibrant colors and intricate designs.",
      description_cn: "清代精美的粉彩花瓶，具有鲜艳的色彩和复杂的设计。",
      craftsmanship_en: "Hand-painted with famille rose enamels over white porcelain.",
      craftsmanship_cn: "在白瓷上手工绘制粉彩釉料。",
      history_en: "Famille rose was a distinctive Qing Dynasty innovation in Chinese porcelain.",
      history_cn: "粉彩是清代中国瓷器的独特创新。",
      price: 450,
      dimensions: "Height: 35cm, Width: 20cm",
      weight: "2.0kg",
      age: "Antique",
      dynasty_id: 5,
      shape_id: 1,
      dynasty_name: "Qing Dynasty",
      shape_name: "Vase",
      primary_image: "/src/assets/tea_image/10.png",
      images: [
        { id: 10, image_path: "/src/assets/tea_image/10.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: true,
      is_available: true
    },
    {
      id: 8,
      name_en: "Tang Dynasty Sancai Pottery",
      name_cn: "唐代三彩陶器",
      description_en: "Colorful sancai pottery from the Tang Dynasty, known for its three-color glaze technique.",
      description_cn: "唐代彩色三彩陶器，以其三色釉技术而闻名。",
      craftsmanship_en: "Three-color glaze technique with yellow, green, and white glazes.",
      craftsmanship_cn: "三色釉技术，使用黄、绿、白三色釉料。",
      history_en: "Sancai pottery was a hallmark of Tang Dynasty ceramic art.",
      history_cn: "三彩陶器是唐代陶瓷艺术的标志。",
      price: 280,
      dimensions: "Height: 22cm, Width: 16cm",
      weight: "1.3kg",
      age: "Antique",
      dynasty_id: 1,
      shape_id: 2,
      dynasty_name: "Tang Dynasty",
      shape_name: "Tea Set",
      primary_image: "/src/assets/tea_image/11.png",
      images: [
        { id: 11, image_path: "/src/assets/tea_image/11.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: false,
      is_available: true
    },
    {
      id: 9,
      name_en: "Ming Dynasty Blue and White Plate",
      name_cn: "明代青花盘",
      description_en: "Classic blue and white plate from the Ming Dynasty, featuring traditional dragon motifs.",
      description_cn: "明代经典青花盘，采用传统龙纹图案。",
      craftsmanship_en: "Hand-painted cobalt blue dragon designs on white porcelain.",
      craftsmanship_cn: "在白瓷上手工绘制钴蓝龙纹图案。",
      history_en: "Dragon motifs were symbols of imperial power in Ming Dynasty porcelain.",
      history_cn: "龙纹图案是明代瓷器中皇权的象征。",
      price: 200,
      dimensions: "Diameter: 30cm, Height: 4cm",
      weight: "1.0kg",
      age: "Antique",
      dynasty_id: 4,
      shape_id: 5,
      dynasty_name: "Ming Dynasty",
      shape_name: "Plate",
      primary_image: "/src/assets/tea_image/12.png",
      images: [
        { id: 12, image_path: "/src/assets/tea_image/12.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: false,
      is_available: true
    },
    {
      id: 10,
      name_en: "Song Dynasty Ding Ware Bowl",
      name_cn: "宋代定窑碗",
      description_en: "Elegant Ding ware bowl from the Song Dynasty, known for its pure white color and thin walls.",
      description_cn: "宋代优雅的定窑碗，以其纯白色和薄壁而闻名。",
      craftsmanship_en: "High-fired white porcelain with extremely thin walls and pure white glaze.",
      craftsmanship_cn: "高温烧制的白瓷，具有极薄的壁和纯白釉面。",
      history_en: "Ding ware was one of the five great kilns of the Song Dynasty.",
      history_cn: "定窑是宋代五大名窑之一。",
      price: 220,
      dimensions: "Diameter: 18cm, Height: 6cm",
      weight: "0.7kg",
      age: "Antique",
      dynasty_id: 2,
      shape_id: 4,
      dynasty_name: "Song Dynasty",
      shape_name: "Bowl",
      primary_image: "/src/assets/tea_image/13.png",
      images: [
        { id: 13, image_path: "/src/assets/tea_image/13.png", is_primary: true, sort_order: 1 }
      ],
      videos: [],
      is_featured: false,
      is_available: true
    }
  ])
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

    // Load products from localStorage to ensure admin and frontend sync
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      // Use existing products from localStorage (preserves user operations)
      products.value = JSON.parse(savedProducts)
      console.log('Using products from localStorage in loadSettings:', products.value.length)
    } else {
      // Only use default products if localStorage is empty (first time load)
      console.log('Using default products in loadSettings (first load):', products.value.length)
      localStorage.setItem('products', JSON.stringify(products.value))
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
      const response = await fetch('http://localhost:3000/api/media-library', {
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
      console.error('Error loading media library:', error)
      // 使用默认数据
      mediaLibrary.value = []
    }
  }

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
    
    // loadSettings() already handles products loading, so no need to duplicate here
    // This ensures consistency between local and public access
    
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
    updateRareDynastyTitle,
    updateRareDynastyDescription,
    updateRareDynastyButtonText,
    updateRareDynastyImage,
    updateHeritageStoryTitle,
    updateHeritageStoryDescription1,
    updateHeritageStoryDescription2,
    updateHeritageStoryImage,
    loadSettings,
    
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
