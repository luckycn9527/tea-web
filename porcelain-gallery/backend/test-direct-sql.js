// Direct SQL test without parameters
require('dotenv').config();
const database = require('./config/database');

async function testDirectSQL() {
  try {
    console.log('Connecting to database...');
    await database.connect();
    console.log('Database connected successfully');
    
    // Test direct SQL without parameters
    console.log('\nTesting direct SQL...');
    const result = await database.query('SELECT * FROM products WHERE is_available = 1 LIMIT 5');
    console.log('Query result:', result.length, 'products');
    if (result.length > 0) {
      console.log('First product:', result[0]);
    }
    
    // Test with JOIN
    console.log('\nTesting JOIN query...');
    const joinResult = await database.query(`
      SELECT 
        p.*,
        d.name as dynasty_name,
        d.name_cn as dynasty_name_cn,
        s.name as shape_name,
        s.name_cn as shape_name_cn
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      WHERE p.is_available = 1
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    console.log('JOIN query result:', joinResult.length, 'products');
    if (joinResult.length > 0) {
      console.log('First product with JOIN:', joinResult[0]);
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await database.close();
    console.log('\nDatabase connection closed');
  }
}

testDirectSQL();
