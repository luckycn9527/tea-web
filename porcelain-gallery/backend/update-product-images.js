// Update product images with local paths
require('dotenv').config();
const database = require('./config/database');

async function updateProductImages() {
  try {
    console.log('Connecting to database...');
    await database.connect();
    console.log('Database connected successfully');
    
    // Update products with local image paths
    const products = [
      {
        id: 1,
        name_en: 'Blue and White Porcelain Vase',
        name_cn: '青花瓷花瓶',
        primary_image_url: '/src/assets/tea_image/1.png',
        dynasty_name: 'Ming Dynasty',
        dynasty_name_cn: '明朝',
        shape_name: 'Vase',
        shape_name_cn: '花瓶'
      },
      {
        id: 2,
        name_en: 'Celadon Tea Set',
        name_cn: '青瓷茶具',
        primary_image_url: '/src/assets/tea_image/2.png',
        dynasty_name: 'Song Dynasty',
        dynasty_name_cn: '宋朝',
        shape_name: 'Tea Set',
        shape_name_cn: '茶具'
      }
    ];
    
    for (const product of products) {
      // First insert product image
      await database.query(`
        INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        image_url = VALUES(image_url),
        alt_text = VALUES(alt_text),
        is_primary = VALUES(is_primary)
      `, [
        product.id,
        product.id,
        product.primary_image_url,
        product.name_en,
        1, // is_primary
        1, // sort_order
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]);
      
      // Then update product with image ID
      await database.query(
        'UPDATE products SET primary_image_id = ? WHERE id = ?',
        [product.id, product.id]
      );
      
      console.log(`Updated product ${product.id}: ${product.name_en}`);
    }
    
    // Update dynasties with local image paths
    const dynasties = [
      {
        id: 1,
        name: 'Tang Dynasty',
        name_cn: '唐朝',
        image_url: '/src/assets/tea_image/tang.png'
      },
      {
        id: 2,
        name: 'Song Dynasty', 
        name_cn: '宋朝',
        image_url: '/src/assets/tea_image/song.png'
      },
      {
        id: 3,
        name: 'Ming Dynasty',
        name_cn: '明朝',
        image_url: '/src/assets/tea_image/ming.png'
      }
    ];
    
    for (const dynasty of dynasties) {
      await database.query(
        'UPDATE dynasties SET image_url = ? WHERE id = ?',
        [dynasty.image_url, dynasty.id]
      );
      console.log(`Updated dynasty ${dynasty.id}: ${dynasty.name}`);
    }
    
    console.log('\nAll updates completed successfully!');
    
  } catch (error) {
    console.error('Error updating product images:', error);
  } finally {
    await database.close();
    console.log('Database connection closed');
  }
}

updateProductImages();
