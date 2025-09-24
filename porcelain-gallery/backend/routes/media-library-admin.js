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

// 简化的认证中间件
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    
    // 检查用户是否为管理员
    const [users] = await pool.execute(
      'SELECT role FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: '权限不足' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ success: false, message: '无效的认证令牌' });
  }
};

// 获取所有媒体文件
router.get('/', requireAdmin, async (req, res) => {
  try {
    console.log('媒体库API被调用');
    
    const { category, page = 1, limit = 20 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);
    
    let query = `
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
    `;
    
    if (category && category !== 'all') {
      query += ` WHERE tags LIKE '%"${category}"%'`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${limitValue} OFFSET ${offset}`;
    
    const [media] = await pool.query(query);
    
    // 获取总数
    let countQuery = `SELECT COUNT(*) as total FROM media_library`;
    if (category && category !== 'all') {
      countQuery += ` WHERE tags LIKE '%"${category}"%'`;
    }
    const [countResult] = await pool.query(countQuery);
    
    const total = countResult[0].total;
    
    console.log('查询成功，返回', media.length, '个文件');
    
    res.json({
      success: true,
      media: media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      },
      categories: {
        'product': '产品图片',
        'dynasty': '朝代图片', 
        'shape': '器型图片',
        'category': '分类图片',
        'banner': '横幅图片',
        'gallery': '画廊图片',
        'other': '其他图片'
      }
    });
  } catch (error) {
    console.error('媒体库API错误:', error);
    res.status(500).json({
      success: false,
      message: '获取媒体文件失败',
      error: error.message
    });
  }
});

// 删除媒体文件
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM media_library WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: '文件删除成功' });
    } else {
      res.status(404).json({ success: false, message: '文件不存在' });
    }
  } catch (error) {
    console.error('删除媒体文件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文件失败',
      error: error.message
    });
  }
});

// 更新媒体文件信息
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, caption, tags, category, is_public } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE media_library SET alt_text = ?, caption = ?, tags = ?, category = ?, is_public = ? WHERE id = ?',
      [alt_text, caption, tags, category, is_public, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: '文件信息更新成功' });
    } else {
      res.status(404).json({ success: false, message: '文件不存在' });
    }
  } catch (error) {
    console.error('更新媒体文件失败:', error);
    res.status(500).json({
      success: false,
      message: '更新文件失败',
      error: error.message
    });
  }
});

module.exports = router;