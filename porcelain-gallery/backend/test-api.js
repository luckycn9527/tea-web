// Simple test API
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Test database connection
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'porcelain_gallery',
    port: process.env.DB_PORT || 3306
  });
  console.log('Database pool created');
}

// Test API endpoint
app.get('/api/test-dynasties', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM dynasties LIMIT 3');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Health check
app.get('/api/test-health', (req, res) => {
  res.json({
    success: true,
    message: 'Test server running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
});





