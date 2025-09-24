const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const router = express.Router();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
});

// 获取媒体库数据 - 不需要认证
router.get('/', async (req, res) => {
  try {
    console.log('媒体库数据API被调用');
    
    const [media] = await pool.execute(`
      SELECT 
        id,
        filename,
        original_filename,
        file_path,
        file_url,
        oss_url,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        tags,
        category,
        is_public,
        uploaded_by,
        created_at
      FROM media_library 
      ORDER BY created_at DESC
    `);
    
    console.log('查询成功，返回', media.length, '个文件');
    
    res.json({
      success: true,
      media: media,
      total: media.length
    });
  } catch (error) {
    console.error('媒体库数据API错误:', error);
    res.status(500).json({
      success: false,
      message: '获取媒体文件失败',
      error: error.message
    });
  }
});

module.exports = router;
