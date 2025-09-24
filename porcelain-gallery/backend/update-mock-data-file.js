// Script to update frontend mockData.ts file with database data
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function updateMockDataFile() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');

    // Fetch all data from database
    const [products] = await connection.execute(`
      SELECT p.*, 
             pi.image_url as primary_image_url,
             GROUP_CONCAT(pi2.image_url) as additional_images
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id AND pi2.id != p.primary_image_id
      GROUP BY p.id
      ORDER BY p.id
    `);

    const [dynasties] = await connection.execute('SELECT * FROM dynasties ORDER BY id');
    const [shapes] = await connection.execute('SELECT * FROM shapes ORDER BY id');
    const [contentSections] = await connection.execute('SELECT * FROM content_sections ORDER BY id');
    const [siteSettings] = await connection.execute('SELECT * FROM site_settings ORDER BY id');

    console.log(`Fetched data: ${products.length} products, ${dynasties.length} dynasties, ${shapes.length} shapes`);

    // Process dynasties data
    const processedDynasties = dynasties.map(dynasty => ({
      ...dynasty,
      is_enabled: Boolean(dynasty.is_enabled)
    }));

    // Process shapes data
    const processedShapes = shapes.map(shape => ({
      ...shape,
      is_enabled: Boolean(shape.is_enabled)
    }));

    // Process content sections data
    const processedContentSections = contentSections.map(section => ({
      ...section,
      button_url: section.button_url || undefined,
      is_active: Boolean(section.is_active)
    }));

    // Process site settings data
    const processedSiteSettings = siteSettings.map(setting => ({
      ...setting,
      description: setting.description || undefined,
      is_public: Boolean(setting.is_public),
      setting_type: setting.setting_type
    }));

    // Process products data
    const processedProducts = products.map(product => {
      const additionalImages = product.additional_images ? 
        product.additional_images.split(',').map(img => img.trim()) : [];
      
      return {
        id: product.id,
        name_en: product.name_en,
        name_cn: product.name_cn,
        slug: product.slug,
        description_en: product.description_en,
        description_cn: product.description_cn,
        craftsmanship_en: product.craftsmanship_en,
        craftsmanship_cn: product.craftsmanship_cn,
        history_en: product.history_en,
        history_cn: product.history_cn,
        price: parseFloat(product.price),
        original_price: parseFloat(product.original_price),
        dimensions: product.dimensions,
        weight: product.weight,
        age: product.age,
        material: product.material,
        color: product.color,
        dynasty_id: product.dynasty_id,
        shape_id: product.shape_id,
        category_id: product.category_id || undefined,
        primary_image_id: product.primary_image_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        is_featured: Boolean(product.is_featured),
        is_available: Boolean(product.is_available),
        is_digital: Boolean(product.is_digital),
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        meta_keywords: product.meta_keywords,
        view_count: product.view_count,
        created_at: product.created_at,
        updated_at: product.updated_at,
        primary_image_url: product.primary_image_url,
        images: [product.primary_image_url, ...additionalImages].filter(Boolean)
      };
    });

    // Generate mockData.ts content
    const mockDataContent = `// Initialize admin store with database data
import { useAdminStore } from '@/stores/admin-new'

// Mock data based on database content
const mockProducts = ${JSON.stringify(processedProducts, null, 2)};

const mockDynasties = ${JSON.stringify(processedDynasties, null, 2)};

const mockShapes = ${JSON.stringify(processedShapes, null, 2)};

const mockContentSections = ${JSON.stringify(processedContentSections, null, 2)};

const mockSiteSettings = ${JSON.stringify(processedSiteSettings, null, 2)};

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

    // Write to mockData.ts file
    const mockDataPath = path.join(__dirname, '../frontend/src/utils/mockData.ts');
    fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
    
    console.log('✅ MockData file updated successfully!');
    console.log(`📁 File path: ${mockDataPath}`);
    console.log(`📊 Updated with ${processedProducts.length} products, ${dynasties.length} dynasties, ${shapes.length} shapes`);

  } catch (error) {
    console.error('❌ Error updating mockData file:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the update
updateMockDataFile()
  .then(() => {
    console.log('🎉 MockData file update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to update mockData file:', error);
    process.exit(1);
  });