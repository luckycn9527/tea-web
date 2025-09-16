// Comprehensive data synchronization script
// This script will sync all frontend mock data to the database

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

// Mock data from frontend
const mockProducts = [
  {
    id: 1,
    name_en: 'Blue and White Porcelain Vase',
    name_cn: '青花瓷花瓶',
    slug: 'blue-white-porcelain-vase',
    description_en: 'Classic blue and white porcelain vase from the Ming Dynasty, featuring traditional Chinese motifs and exquisite craftsmanship.',
    description_cn: '明代经典青花瓷花瓶，采用传统中国图案，工艺精湛。',
    craftsmanship_en: 'Hand-painted with cobalt blue underglaze on white porcelain body.',
    craftsmanship_cn: '在白瓷胎上手工绘制钴蓝釉下彩。',
    history_en: 'Blue and white porcelain originated in the Tang Dynasty and reached its peak during the Ming Dynasty.',
    history_cn: '青花瓷起源于唐代，在明代达到鼎盛。',
    price: 255.00,
    original_price: 300.00,
    dimensions: 'Height: 25cm, Width: 15cm',
    weight: '1.2kg',
    age: 'Antique',
    material: 'Porcelain',
    color: 'Blue and White',
    dynasty_id: 4,
    shape_id: 1,
    category_id: null,
    primary_image_id: 1,
    sku: 'BWV-001',
    stock_quantity: 5,
    is_featured: true,
    is_available: true,
    is_digital: false,
    meta_title: 'Blue and White Porcelain Vase - Ming Dynasty',
    meta_description: 'Authentic Ming Dynasty blue and white porcelain vase',
    meta_keywords: 'porcelain, vase, blue, white, ming dynasty',
    view_count: 0,
    primary_image_url: '/src/assets/tea_image/1.png',
    images: ['/src/assets/tea_image/1.png', '/src/assets/tea_image/2.png']
  },
  {
    id: 2,
    name_en: 'Celadon Tea Set',
    name_cn: '青瓷茶具',
    slug: 'celadon-tea-set',
    description_en: 'Elegant celadon tea set from the Song Dynasty, known for its jade-like color and delicate form.',
    description_cn: '宋代优雅青瓷茶具，以其玉般的颜色和精致的造型而闻名。',
    craftsmanship_en: 'Fired at high temperature with iron-rich glaze creating the characteristic celadon color.',
    craftsmanship_cn: '高温烧制，富含铁的釉料创造出特有的青瓷颜色。',
    history_en: 'Celadon ware was highly prized during the Song Dynasty for its aesthetic beauty.',
    history_cn: '青瓷在宋代因其美学价值而备受推崇。',
    price: 180.00,
    original_price: 220.00,
    dimensions: 'Teapot: 15cm height, Cups: 6cm height',
    weight: '0.8kg',
    age: 'Antique',
    material: 'Celadon',
    color: 'Celadon Green',
    dynasty_id: 2,
    shape_id: 2,
    category_id: null,
    primary_image_id: 2,
    sku: 'CTS-002',
    stock_quantity: 3,
    is_featured: true,
    is_available: true,
    is_digital: false,
    meta_title: 'Celadon Tea Set - Song Dynasty',
    meta_description: 'Authentic Song Dynasty celadon tea set',
    meta_keywords: 'celadon, tea set, song dynasty, green',
    view_count: 0,
    primary_image_url: '/src/assets/tea_image/3.png',
    images: ['/src/assets/tea_image/3.png', '/src/assets/tea_image/4.png']
  },
  {
    id: 3,
    name_en: 'Tang Dynasty Horse Figurine',
    name_cn: '唐代马俑',
    slug: 'tang-dynasty-horse-figurine',
    description_en: 'Exquisite Tang Dynasty horse figurine, symbolizing prosperity and power in ancient China.',
    description_cn: '精美的唐代马俑，象征着古代中国的繁荣和权力。',
    craftsmanship_en: 'Hand-molded terracotta with detailed carving and painted decoration.',
    craftsmanship_cn: '手工塑造的陶器，带有精细的雕刻和彩绘装饰。',
    history_en: 'Tang Dynasty horses were symbols of wealth and military power.',
    history_cn: '唐代马匹是财富和军事实力的象征。',
    price: 320.00,
    original_price: 380.00,
    dimensions: 'Height: 20cm, Length: 25cm',
    weight: '1.5kg',
    age: 'Antique',
    material: 'Terracotta',
    color: 'Earthenware',
    dynasty_id: 1,
    shape_id: 3,
    category_id: null,
    primary_image_id: 3,
    sku: 'THF-003',
    stock_quantity: 2,
    is_featured: true,
    is_available: true,
    is_digital: false,
    meta_title: 'Tang Dynasty Horse Figurine',
    meta_description: 'Authentic Tang Dynasty horse figurine',
    meta_keywords: 'tang dynasty, horse, figurine, terracotta',
    view_count: 0,
    primary_image_url: '/src/assets/tea_image/5.png',
    images: ['/src/assets/tea_image/5.png', '/src/assets/tea_image/6.png']
  }
];

const mockDynasties = [
  {
    id: 1,
    name: 'Tang Dynasty',
    name_cn: '唐朝',
    period: '618-907',
    description: 'The Tang Dynasty was a golden age of Chinese civilization.',
    description_cn: '唐朝是中国文明的黄金时代。',
    image_url: '/src/assets/tea_image/tang.png',
    sort_order: 1,
    is_enabled: true
  },
  {
    id: 2,
    name: 'Song Dynasty',
    name_cn: '宋朝',
    period: '960-1279',
    description: 'The Song Dynasty was known for its cultural achievements and technological innovations.',
    description_cn: '宋朝以其文化成就和技术创新而闻名。',
    image_url: '/src/assets/tea_image/song.png',
    sort_order: 2,
    is_enabled: true
  },
  {
    id: 3,
    name: 'Ming Dynasty',
    name_cn: '明朝',
    period: '1368-1644',
    description: 'The Ming Dynasty was a period of great cultural and artistic achievement.',
    description_cn: '明朝是文化和艺术成就的伟大时期。',
    image_url: '/src/assets/tea_image/ming.png',
    sort_order: 3,
    is_enabled: true
  },
  {
    id: 4,
    name: 'Qing Dynasty',
    name_cn: '清朝',
    period: '1644-1912',
    description: 'The Qing Dynasty was the last imperial dynasty of China.',
    description_cn: '清朝是中国最后一个封建王朝。',
    image_url: '/src/assets/tea_image/qing.png',
    sort_order: 4,
    is_enabled: true
  }
];

const mockShapes = [
  {
    id: 1,
    name: 'Vase',
    name_cn: '花瓶',
    description: 'Traditional Chinese vase for decoration and display.',
    description_cn: '传统中国花瓶，用于装饰和展示。',
    sort_order: 1,
    is_enabled: true
  },
  {
    id: 2,
    name: 'Tea Set',
    name_cn: '茶具',
    description: 'Complete tea set including teapot and cups.',
    description_cn: '完整茶具，包括茶壶和茶杯。',
    sort_order: 2,
    is_enabled: true
  },
  {
    id: 3,
    name: 'Figurine',
    name_cn: '雕像',
    description: 'Decorative figurines and sculptures.',
    description_cn: '装饰性雕像和雕塑。',
    sort_order: 3,
    is_enabled: true
  }
];

const mockContentSections = [
  {
    id: 1,
    section_key: 'best_sellers',
    title_en: 'Best Sellers',
    title_cn: '热销产品',
    content_en: 'Discover our most popular porcelain pieces',
    content_cn: '发现我们最受欢迎的瓷器作品',
    image_url: '/src/assets/tea_image/best-sellers.png',
    button_text_en: 'View All',
    button_text_cn: '查看全部',
    sort_order: 1,
    is_active: true
  },
  {
    id: 2,
    section_key: 'rare_dynasty',
    title_en: 'Explore by Dynasty',
    title_cn: '按朝代探索',
    content_en: 'Exclusive pieces from ancient Chinese dynasties',
    content_cn: '来自中国古代朝代的独家作品',
    image_url: '/src/assets/tea_image/rare-dynasty.png',
    button_text_en: 'Explore Collection',
    button_text_cn: '探索收藏',
    sort_order: 2,
    is_active: true
  },
  {
    id: 3,
    section_key: 'heritage_story',
    title_en: 'Forget mass-produced',
    title_cn: '忘记批量生产',
    content_en: 'Discover the rich history and craftsmanship behind each piece',
    content_cn: '发现每件作品背后的丰富历史和工艺',
    image_url: '/src/assets/tea_image/heritage.png',
    button_text_en: 'Learn More',
    button_text_cn: '了解更多',
    sort_order: 3,
    is_active: true
  }
];

const mockSiteSettings = [
  {
    id: 1,
    setting_key: 'site_title',
    setting_value: 'Porcelain Gallery',
    setting_type: 'text',
    is_public: true
  },
  {
    id: 2,
    setting_key: 'site_description',
    setting_value: 'Discover the beauty of Chinese porcelain art',
    setting_type: 'text',
    is_public: true
  },
  {
    id: 3,
    setting_key: 'site_phone',
    setting_value: '+86 123 4567 8900',
    setting_type: 'text',
    is_public: true
  },
  {
    id: 4,
    setting_key: 'site_email',
    setting_value: 'info@porcelain-gallery.com',
    setting_type: 'text',
    is_public: true
  }
];

async function syncDataToDatabase() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM product_images WHERE id > 0');
    await connection.execute('DELETE FROM products WHERE id > 0');
    await connection.execute('DELETE FROM content_sections WHERE id > 0');
    await connection.execute('DELETE FROM site_settings WHERE id > 0');
    await connection.execute('DELETE FROM dynasties WHERE id > 0');
    await connection.execute('DELETE FROM shapes WHERE id > 0');
    console.log('Existing data cleared');

    // Insert dynasties
    console.log('Inserting dynasties...');
    for (const dynasty of mockDynasties) {
      await connection.execute(`
        INSERT INTO dynasties (id, name, name_cn, period, description, description_cn, image_url, sort_order, is_enabled, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        dynasty.id,
        dynasty.name,
        dynasty.name_cn,
        dynasty.period,
        dynasty.description,
        dynasty.description_cn,
        dynasty.image_url,
        dynasty.sort_order,
        dynasty.is_enabled
      ]);
    }
    console.log(`${mockDynasties.length} dynasties inserted`);

    // Insert shapes
    console.log('Inserting shapes...');
    for (const shape of mockShapes) {
      await connection.execute(`
        INSERT INTO shapes (id, name, name_cn, description, description_cn, sort_order, is_enabled, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        shape.id,
        shape.name,
        shape.name_cn,
        shape.description,
        shape.description_cn,
        shape.sort_order,
        shape.is_enabled
      ]);
    }
    console.log(`${mockShapes.length} shapes inserted`);

    // Insert site settings
    console.log('Inserting site settings...');
    for (const setting of mockSiteSettings) {
      await connection.execute(`
        INSERT INTO site_settings (id, setting_key, setting_value, setting_type, is_public, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        setting.id,
        setting.setting_key,
        setting.setting_value,
        setting.setting_type,
        setting.is_public
      ]);
    }
    console.log(`${mockSiteSettings.length} site settings inserted`);

    // Insert content sections
    console.log('Inserting content sections...');
    for (const section of mockContentSections) {
      await connection.execute(`
        INSERT INTO content_sections (id, section_key, title_en, title_cn, content_en, content_cn, image_url, button_text_en, button_text_cn, sort_order, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        section.id,
        section.section_key,
        section.title_en,
        section.title_cn,
        section.content_en,
        section.content_cn,
        section.image_url,
        section.button_text_en,
        section.button_text_cn,
        section.sort_order,
        section.is_active
      ]);
    }
    console.log(`${mockContentSections.length} content sections inserted`);

    // Insert products and their images
    console.log('Inserting products and images...');
    for (const product of mockProducts) {
      // First insert the product
      await connection.execute(`
        INSERT INTO products (
          id, name_en, name_cn, slug, description_en, description_cn, craftsmanship_en, craftsmanship_cn,
          history_en, history_cn, price, original_price, dimensions, weight, age, material, color,
          dynasty_id, shape_id, category_id, sku, stock_quantity, is_featured, is_available,
          is_digital, meta_title, meta_description, meta_keywords, view_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        product.id,
        product.name_en,
        product.name_cn,
        product.slug,
        product.description_en,
        product.description_cn,
        product.craftsmanship_en,
        product.craftsmanship_cn,
        product.history_en,
        product.history_cn,
        product.price,
        product.original_price,
        product.dimensions,
        product.weight,
        product.age,
        product.material,
        product.color,
        product.dynasty_id,
        product.shape_id,
        product.category_id,
        product.sku,
        product.stock_quantity,
        product.is_featured,
        product.is_available,
        product.is_digital,
        product.meta_title,
        product.meta_description,
        product.meta_keywords,
        product.view_count
      ]);

      // Insert product images
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i];
        const isPrimary = i === 0;
        
        await connection.execute(`
          INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order, created_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [
          product.id,
          imageUrl,
          `${product.name_en} - Image ${i + 1}`,
          isPrimary,
          i + 1
        ]);

        // Update product's primary_image_id if this is the primary image
        if (isPrimary) {
          const [imageResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
          await connection.execute(`
            UPDATE products SET primary_image_id = ? WHERE id = ?
          `, [imageResult[0].id, product.id]);
        }
      }
    }
    console.log(`${mockProducts.length} products and their images inserted`);

    console.log('✅ Data synchronization completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${mockDynasties.length} dynasties`);
    console.log(`- ${mockShapes.length} shapes`);
    console.log(`- ${mockSiteSettings.length} site settings`);
    console.log(`- ${mockContentSections.length} content sections`);
    console.log(`- ${mockProducts.length} products with images`);

  } catch (error) {
    console.error('❌ Error synchronizing data:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the synchronization
if (require.main === module) {
  syncDataToDatabase()
    .then(() => {
      console.log('\n🎉 All frontend data has been synchronized to the database!');
      console.log('You can now access the admin page at: http://localhost:5174/admin');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to synchronize data:', error);
      process.exit(1);
    });
}

module.exports = { syncDataToDatabase };
