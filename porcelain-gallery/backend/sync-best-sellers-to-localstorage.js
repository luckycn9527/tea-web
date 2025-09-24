// Script to sync Best Sellers data from database to localStorage
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  charset: 'utf8mb4'
};

async function syncBestSellersToLocalStorage() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');

    // Get featured products from database
    const query = `
      SELECT p.*, 
             pi.image_url as primary_image_url,
             GROUP_CONCAT(pi2.image_url) as additional_images
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id AND pi2.id != p.primary_image_id
      WHERE p.is_featured = 1
      GROUP BY p.id
      ORDER BY p.id
    `;
    
    const [products] = await connection.execute(query);
    
    // Transform to match frontend format
    const bestSellers = products.map(product => {
      const additionalImages = product.additional_images ? 
        product.additional_images.split(',').map(img => img.trim()) : [];
      
      return {
        id: product.id,
        name: product.name_en,
        name_cn: product.name_cn,
        price: product.price.toString(),
        mainImage: product.primary_image_url || '',
        thumbnails: [product.primary_image_url, ...additionalImages].filter(Boolean),
        description: product.description_en,
        description_cn: product.description_cn,
        is_featured: Boolean(product.is_featured)
      };
    });

    // Create a simple HTML file that will sync data to localStorage
    const syncScript = `
<!DOCTYPE html>
<html>
<head>
    <title>Data Sync</title>
</head>
<body>
    <h1>Syncing Best Sellers Data...</h1>
    <div id="status">Please wait...</div>
    
    <script>
        // Best Sellers data from database
        const bestSellersData = ${JSON.stringify(bestSellers, null, 2)};
        
        // Sync to localStorage
        try {
            localStorage.setItem('bestSellersProducts', JSON.stringify(bestSellersData));
            document.getElementById('status').innerHTML = 
                '<p style="color: green;">✅ Best Sellers data synced successfully!</p>' +
                '<p>Synced ' + bestSellersData.length + ' products to localStorage.</p>' +
                '<p><a href="https://www.zaopic.cn/">Go to Website</a></p>';
        } catch (error) {
            document.getElementById('status').innerHTML = 
                '<p style="color: red;">❌ Error syncing data: ' + error.message + '</p>';
        }
    </script>
</body>
</html>`;

    // Write sync script to a file that can be accessed via web
    const fs = require('fs');
    const path = require('path');
    const syncFilePath = path.join(__dirname, '../frontend/dist/sync-data.html');
    fs.writeFileSync(syncFilePath, syncScript, 'utf8');
    
    console.log('✅ Best Sellers data sync script created!');
    console.log(`📁 File path: ${syncFilePath}`);
    console.log(`📊 Synced ${bestSellers.length} Best Sellers products`);
    console.log('🌐 Access via: https://www.zaopic.cn/sync-data.html');

  } catch (error) {
    console.error('❌ Error syncing Best Sellers data:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the sync
syncBestSellersToLocalStorage()
  .then(() => {
    console.log('🎉 Best Sellers data sync completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to sync Best Sellers data:', error);
    process.exit(1);
  });

