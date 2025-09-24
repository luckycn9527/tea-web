// Test database connection
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL database');

    // Test query
    const [rows] = await connection.execute('SELECT * FROM dynasties LIMIT 3');
    console.log('Dynasties:', rows);

    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Database test error:', error.message);
  }
}

testDatabase();





