// Test API route directly
require('dotenv').config();
const express = require('express');
const { Product } = require('./backend/models/Product');
const database = require('./backend/config/database');

const app = express();
app.use(express.json());

// Simple test route
app.get('/test-products', async (req, res) => {
  try {
    console.log('Test route called');
    const options = {
      page: 1,
      limit: 5,
      is_available: 1
    };
    
    console.log('Options:', options);
    const products = await Product.findAll(database, options);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

async function startTestServer() {
  try {
    await database.connect();
    console.log('Database connected');
    
    app.listen(3001, () => {
      console.log('Test server running on port 3001');
      console.log('Test URL: http://localhost:3001/test-products');
    });
  } catch (error) {
    console.error('Failed to start test server:', error);
  }
}

startTestServer();
