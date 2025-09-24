// Test API directly
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testAPI() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL database');

    // Test the exact query from Dynasty.findAll
    const [rows] = await connection.execute(
      'SELECT * FROM dynasties WHERE 1=1 AND is_enabled = ? ORDER BY sort_order ASC',
      [1]
    );
    
    console.log('Query result:', rows.length, 'rows');
    console.log('First row:', rows[0]);

    await connection.end();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();





