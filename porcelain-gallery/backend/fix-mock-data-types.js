// Fix type conversions for database data to match frontend interfaces
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

// Type conversion functions
function convertProductData(product) {
  return {
    ...product,
    price: parseFloat(product.price) || 0,
    original_price: parseFloat(product.original_price) || 0,
    stock_quantity: parseInt(product.stock_quantity) || 0,
    view_count: parseInt(product.view_count) || 0,
    is_featured: Boolean(product.is_featured),
    is_available: Boolean(product.is_available),
    is_digital: Boolean(product.is_digital),
    dynasty_id: product.dynasty_id ? parseInt(product.dynasty_id) : undefined,
    shape_id: product.shape_id ? parseInt(product.shape_id) : undefined,
    category_id: product.category_id ? parseInt(product.category_id) : undefined,
    primary_image_id: product.primary_image_id ? parseInt(product.primary_image_id) : undefined,
    // Convert images array to proper format
    images: product.images ? product.images.map(img => ({
      ...img,
      id: parseInt(img.id),
      product_id: parseInt(img.product_id),
      is_primary: Boolean(img.is_primary),
      sort_order: parseInt(img.sort_order) || 0,
      file_size: img.file_size ? parseInt(img.file_size) : undefined,
      width: img.width ? parseInt(img.width) : undefined,
      height: img.height ? parseInt(img.height) : undefined,
      caption: img.caption || undefined,
      mime_type: img.mime_type || undefined
    })) : []
  };
}

function convertDynastyData(dynasty) {
  return {
    ...dynasty,
    is_enabled: Boolean(dynasty.is_enabled),
    sort_order: parseInt(dynasty.sort_order) || 0
  };
}

function convertShapeData(shape) {
  return {
    ...shape,
    is_enabled: Boolean(shape.is_enabled),
    sort_order: parseInt(shape.sort_order) || 0
  };
}

function convertContentSectionData(section) {
  return {
    ...section,
    is_active: Boolean(section.is_active),
    sort_order: parseInt(section.sort_order) || 0,
    button_url: section.button_url || undefined
  };
}

function convertSiteSettingData(setting) {
  // Ensure setting_type is one of the expected values
  const validTypes = ['text', 'number', 'boolean', 'image', 'json'];
  const settingType = validTypes.includes(setting.setting_type) ? setting.setting_type : 'text';
  
  return {
    ...setting,
    is_public: Boolean(setting.is_public),
    setting_type: settingType,
    description: setting.description || undefined
  };
}

async function updateMockDataFileWithTypeConversion() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database for data fetch');

    // Fetch all data from database
    const [products] = await connection.execute(`
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn,
        pi.image_url as primary_image_url,
        pi.alt_text as primary_image_alt
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      ORDER BY p.id
    `);

    const [dynasties] = await connection.execute('SELECT * FROM dynasties ORDER BY sort_order');
    const [shapes] = await connection.execute('SELECT * FROM shapes ORDER BY sort_order');
    const [contentSections] = await connection.execute('SELECT * FROM content_sections ORDER BY sort_order');
    const [siteSettings] = await connection.execute('SELECT * FROM site_settings ORDER BY id');

    // Fetch product images for each product
    for (const product of products) {
      const [images] = await connection.execute(`
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY sort_order
      `, [product.id]);
      product.images = images;
    }

    console.log('Data fetched from database:');
    console.log(`- ${products.length} products`);
    console.log(`- ${dynasties.length} dynasties`);
    console.log(`- ${shapes.length} shapes`);
    console.log(`- ${contentSections.length} content sections`);
    console.log(`- ${siteSettings.length} site settings`);

    // Convert data types to match frontend interfaces
    const convertedProducts = products.map(convertProductData);
    const convertedDynasties = dynasties.map(convertDynastyData);
    const convertedShapes = shapes.map(convertShapeData);
    const convertedContentSections = contentSections.map(convertContentSectionData);
    const convertedSiteSettings = siteSettings.map(convertSiteSettingData);

    console.log('Data types converted for frontend compatibility');

    // Generate the new mock data file content
    const mockDataContent = `// Initialize admin store with database data
import { useAdminStore } from '@/stores/admin-new'

// Mock data based on database content
const mockProducts = ${JSON.stringify(convertedProducts, null, 2)} as any;

const mockDynasties = ${JSON.stringify(convertedDynasties, null, 2)} as any;

const mockShapes = ${JSON.stringify(convertedShapes, null, 2)} as any;

const mockContentSections = ${JSON.stringify(convertedContentSections, null, 2)} as any;

const mockSiteSettings = ${JSON.stringify(convertedSiteSettings, null, 2)} as any;

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
`;

    // Write the updated mock data file
    const frontendPath = path.join(__dirname, '../frontend/src/utils/mockData.ts');
    fs.writeFileSync(frontendPath, mockDataContent, 'utf8');
    
    console.log('✅ Mock data file updated with type conversions!');
    console.log(`File written to: ${frontendPath}`);

  } catch (error) {
    console.error('Error updating mock data file:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  updateMockDataFileWithTypeConversion()
    .then(() => {
      console.log('\n🎉 Frontend mock data has been updated with proper type conversions!');
      console.log('The admin page at http://localhost:5174/admin should now work correctly.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to update mock data file:', error);
      process.exit(1);
    });
}

module.exports = { updateMockDataFileWithTypeConversion };
