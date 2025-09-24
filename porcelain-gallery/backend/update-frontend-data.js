// Update frontend admin store to use real database data
// This script will replace mock data with actual database data

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function fetchDatabaseData() {
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

    return {
      products,
      dynasties,
      shapes,
      contentSections,
      siteSettings
    };

  } catch (error) {
    console.error('Error fetching database data:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Generate TypeScript/JavaScript code for the frontend
function generateFrontendData(data) {
  const { products, dynasties, shapes, contentSections, siteSettings } = data;

  // Generate products data
  const productsCode = `const mockProducts = ${JSON.stringify(products, null, 2)};`;

  // Generate dynasties data
  const dynastiesCode = `const mockDynasties = ${JSON.stringify(dynasties, null, 2)};`;

  // Generate shapes data
  const shapesCode = `const mockShapes = ${JSON.stringify(shapes, null, 2)};`;

  // Generate content sections data
  const contentSectionsCode = `const mockContentSections = ${JSON.stringify(contentSections, null, 2)};`;

  // Generate site settings data
  const siteSettingsCode = `const mockSiteSettings = ${JSON.stringify(siteSettings, null, 2)};`;

  return {
    productsCode,
    dynastiesCode,
    shapesCode,
    contentSectionsCode,
    siteSettingsCode
  };
}

async function updateFrontendData() {
  try {
    console.log('Fetching data from database...');
    const data = await fetchDatabaseData();
    
    console.log('Generating frontend data code...');
    const codes = generateFrontendData(data);
    
    console.log('✅ Database data fetched and converted to frontend format');
    console.log('\nGenerated data:');
    console.log('Products:', codes.productsCode.substring(0, 100) + '...');
    console.log('Dynasties:', codes.dynastiesCode.substring(0, 100) + '...');
    console.log('Shapes:', codes.shapesCode.substring(0, 100) + '...');
    console.log('Content Sections:', codes.contentSectionsCode.substring(0, 100) + '...');
    console.log('Site Settings:', codes.siteSettingsCode.substring(0, 100) + '...');
    
    return codes;
  } catch (error) {
    console.error('Failed to update frontend data:', error);
    throw error;
  }
}

if (require.main === module) {
  updateFrontendData()
    .then(() => {
      console.log('\n🎉 Frontend data update completed!');
      console.log('The admin page at http://localhost:5174/admin should now show real database data.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to update frontend data:', error);
      process.exit(1);
    });
}

module.exports = { updateFrontendData, fetchDatabaseData };

