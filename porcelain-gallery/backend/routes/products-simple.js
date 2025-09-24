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
    const { limit = 10, is_featured } = req.query;
    
    console.log('Products API called, limit:', limit, 'is_featured:', is_featured);
    
    // 使用最简单的SQL查询
    let sql = 'SELECT id, name_en, name_cn, price, is_featured, is_available FROM products';
    
    if (is_featured !== undefined) {
      const featuredValue = is_featured === 'true' ? 1 : 0;
      sql += ` WHERE is_featured = ${featuredValue}`;
    }
    
    sql += ' ORDER BY id DESC';
    
    if (limit) {
      const limitValue = parseInt(limit) || 10;
      sql += ` LIMIT ${limitValue}`;
    }
    
    console.log('SQL:', sql);
    
    const connection = await pool.getConnection();
    const [products] = await connection.query(sql);
    connection.release();
    
    console.log('Products found:', products.length);
    
    res.json({
      success: true,
      data: products,
      message: 'Products API working'
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