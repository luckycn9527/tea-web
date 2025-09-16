// Update frontend mock data with real database data
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

async function updateMockDataFile() {
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

    // Generate the new mock data file content
    const mockDataContent = `// Initialize admin store with database data
import { useAdminStore } from '@/stores/admin-new'

// Mock data based on database content
const mockProducts = ${JSON.stringify(products, null, 2)};

const mockDynasties = ${JSON.stringify(dynasties, null, 2)};

const mockShapes = ${JSON.stringify(shapes, null, 2)};

const mockContentSections = ${JSON.stringify(contentSections, null, 2)};

const mockSiteSettings = ${JSON.stringify(siteSettings, null, 2)};

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
    
    console.log('✅ Mock data file updated successfully!');
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
  updateMockDataFile()
    .then(() => {
      console.log('\n🎉 Frontend mock data has been updated with real database data!');
      console.log('The admin page at http://localhost:5174/admin should now show real database data.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to update mock data file:', error);
      process.exit(1);
    });
}

module.exports = { updateMockDataFile };

