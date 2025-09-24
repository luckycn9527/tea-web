// Check database schema
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function checkSchema() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');

    // Check dynasties table schema
    console.log('\n=== DYNASTIES TABLE SCHEMA ===');
    const [dynastyColumns] = await connection.execute('DESCRIBE dynasties');
    dynastyColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Check shapes table schema
    console.log('\n=== SHAPES TABLE SCHEMA ===');
    const [shapeColumns] = await connection.execute('DESCRIBE shapes');
    shapeColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Check products table schema
    console.log('\n=== PRODUCTS TABLE SCHEMA ===');
    const [productColumns] = await connection.execute('DESCRIBE products');
    productColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Check content_sections table schema
    console.log('\n=== CONTENT_SECTIONS TABLE SCHEMA ===');
    const [contentColumns] = await connection.execute('DESCRIBE content_sections');
    contentColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Check site_settings table schema
    console.log('\n=== SITE_SETTINGS TABLE SCHEMA ===');
    const [settingsColumns] = await connection.execute('DESCRIBE site_settings');
    settingsColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Check product_images table schema
    console.log('\n=== PRODUCT_IMAGES TABLE SCHEMA ===');
    const [imageColumns] = await connection.execute('DESCRIBE product_images');
    imageColumns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkSchema();
