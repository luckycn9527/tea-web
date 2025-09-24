// Test Product.findAll method directly
require('dotenv').config();
const { Product } = require('./models/Product');
const database = require('./config/database');

async function testProductFindAll() {
  try {
    console.log('Connecting to database...');
    await database.connect();
    console.log('Database connected successfully');
    
    console.log('\nTesting Product.findAll...');
    const products = await Product.findAll(database, {
      page: 1,
      limit: 5,
      is_available: true
    });
    
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('First product:', products[0]);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await database.close();
    console.log('\nDatabase connection closed');
  }
}

testProductFindAll();
