const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// Public Best Sellers API (no authentication required)
router.get('/', async (req, res) => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306
    });

    // Get featured products from database with dynasty and shape names
    const query = `
      SELECT p.*, 
             pi.image_url as primary_image_url,
             GROUP_CONCAT(pi2.image_url) as additional_images,
             d.name as dynasty_name,
             s.name as shape_name
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id AND pi2.id != p.primary_image_id
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      WHERE p.is_featured = 1
      GROUP BY p.id
      ORDER BY p.id
    `;
    
    const [products] = await pool.execute(query);
    
    // Transform to match frontend format
    const bestSellers = products.map(product => {
      const additionalImages = product.additional_images ? 
        product.additional_images.split(',').map(img => img.trim()) : [];
      
      return {
        id: product.id,
        name: product.name_en,
        name_cn: product.name_cn,
        name_en: product.name_en,
        price: product.price.toString(),
        mainImage: product.primary_image_url || '',
        thumbnails: [product.primary_image_url, ...additionalImages].filter(Boolean),
        description: product.description_en,
        description_cn: product.description_cn,
        description_en: product.description_en,
        craftsmanship_en: product.craftsmanship_en,
        craftsmanship_cn: product.craftsmanship_cn,
        history_en: product.history_en,
        history_cn: product.history_cn,
        dimensions: product.dimensions,
        material: product.material,
        weight: product.weight,
        age: product.age,
        dynasty_id: product.dynasty_id,
        shape_id: product.shape_id,
        dynasty_name: product.dynasty_name,
        shape_name: product.shape_name,
        is_featured: Boolean(product.is_featured),
        is_available: Boolean(product.is_available)
      };
    });
    
    await pool.end();
    
    res.json({
      success: true,
      data: bestSellers
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch best sellers' 
    });
  }
});

module.exports = router;
