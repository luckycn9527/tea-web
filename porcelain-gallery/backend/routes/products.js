const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'porcelain123',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
});

// 获取产品列表
router.get('/', async (req, res) => {
  try {
    const { is_featured, limit = 8 } = req.query;
    
    // 确保pool已初始化
    if (!pool) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available'
      });
    }
    
    let whereClause = '';
    let params = [];
    
    if (is_featured !== undefined) {
      whereClause = 'WHERE p.is_featured = ?';
      params.push(is_featured === 'true' ? 1 : 0);
    }
    
    // 查询产品数据
    const [products] = await pool.execute(`
      SELECT 
        p.id,
        p.name_en,
        p.name_cn,
        p.description_en,
        p.description_cn,
        p.price,
        p.dynasty_id,
        p.shape_id,
        p.category_id,
        p.is_featured,
        p.is_available,
        p.created_at,
        p.updated_at,
        pi.image_url as primary_image_url
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      ${whereClause}
      ORDER BY p.id
      LIMIT ?
    `, [...params, parseInt(limit)]);

    // 为每个产品获取所有图片
    for (let product of products) {
      const [images] = await pool.execute(`
        SELECT id, image_url, alt_text, is_primary, sort_order
        FROM product_images 
        WHERE product_id = ?
        ORDER BY is_primary DESC, sort_order ASC
      `, [product.id]);
      
      product.images = images;
    }

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

module.exports = router;
