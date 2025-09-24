// Simple database test
require('dotenv').config();
const database = require('./config/database');

async function testDatabase() {
  try {
    console.log('Connecting to database...');
    await database.connect();
    console.log('Database connected successfully');
    
    // Test basic query
    console.log('\nTesting basic queries...');
    
    // Check if tables exist
    const tables = await database.query('SHOW TABLES');
    console.log('Available tables:', tables.map(t => Object.values(t)[0]));
    
    // Check dynasties table
    try {
      const dynasties = await database.query('SELECT * FROM dynasties LIMIT 3');
      console.log('Dynasties found:', dynasties.length);
      if (dynasties.length > 0) {
        console.log('First dynasty:', dynasties[0]);
      }
    } catch (error) {
      console.log('Dynasties table error:', error.message);
    }
    
    // Check products table
    try {
      const products = await database.query('SELECT * FROM products LIMIT 3');
      console.log('Products found:', products.length);
      if (products.length > 0) {
        console.log('First product:', products[0]);
      }
    } catch (error) {
      console.log('Products table error:', error.message);
    }
    
    // Test simple query first
    try {
      const sql = 'SELECT * FROM products WHERE is_available = ? LIMIT ?';
      const params = [1, 5];
      console.log('\nTesting simple query...');
      console.log('SQL:', sql);
      console.log('Params:', params);
      
      const result = await database.query(sql, params);
      console.log('Query result:', result.length, 'products');
      if (result.length > 0) {
        console.log('First product from query:', result[0]);
      }
    } catch (error) {
      console.log('Simple query error:', error.message);
    }
    
    // Test the exact query from Product.findAll
    try {
      const sql = `
        SELECT 
          p.*,
          d.name as dynasty_name,
          d.name_cn as dynasty_name_cn,
          s.name as shape_name,
          s.name_cn as shape_name_cn,
          c.name as category_name,
          c.name_cn as category_name_cn,
          pi.image_url as primary_image_url,
          pi.alt_text as primary_image_alt
        FROM products p
        LEFT JOIN dynasties d ON p.dynasty_id = d.id
        LEFT JOIN shapes s ON p.shape_id = s.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.primary_image_id = pi.id
        WHERE p.is_available = ?
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      
      const params = [1, 5];
      console.log('\nTesting Product.findAll query (without OFFSET)...');
      console.log('SQL:', sql);
      console.log('Params:', params);
      
      const result = await database.query(sql, params);
      console.log('Query result:', result.length, 'products');
      if (result.length > 0) {
        console.log('First product from query:', result[0]);
      }
    } catch (error) {
      console.log('Product.findAll query error:', error.message);
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await database.close();
    console.log('\nDatabase connection closed');
  }
}

testDatabase();
