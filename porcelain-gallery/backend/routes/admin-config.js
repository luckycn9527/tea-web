const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// 中间件：验证管理员权限
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    
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

// 获取所有配置数据
router.get('/config', requireAdmin, async (req, res) => {
  try {
    // 获取网站设置
    const [siteSettings] = await pool.execute('SELECT * FROM site_settings ORDER BY setting_key');
    
    // 获取内容区块
    const [contentSections] = await pool.execute('SELECT id, section_key as `key`, title_cn, content_cn, image_url, button_text_cn, is_active as is_enabled FROM content_sections ORDER BY section_key');
    
    // 获取热销产品
    const [bestSellers] = await pool.execute(`
      SELECT p.*, 
             pi.image_url as primary_image_url,
             GROUP_CONCAT(pi2.image_url) as additional_images
      FROM products p
      LEFT JOIN product_images pi ON p.primary_image_id = pi.id
      LEFT JOIN product_images pi2 ON p.id = pi2.product_id AND pi2.id != p.primary_image_id
      WHERE p.is_featured = 1
      GROUP BY p.id
      ORDER BY p.id
    `);
    
    // 获取朝代信息
    const [dynasties] = await pool.execute('SELECT * FROM dynasties WHERE is_enabled = 1 ORDER BY sort_order');
    
    // 获取器型信息
    const [shapes] = await pool.execute('SELECT * FROM shapes WHERE is_enabled = 1 ORDER BY sort_order');
    
    // 获取媒体库
    const [mediaLibrary] = await pool.execute('SELECT * FROM media_library ORDER BY created_at DESC');

    const responseData = {
      success: true,
      data: {
        siteSettings: siteSettings.map(setting => ({
          id: setting.id,
          key: setting.setting_key,
          value: setting.setting_value,
          type: setting.setting_type,
          description: setting.description
        })),
        contentSections: contentSections.map(section => {
          const result = {
            id: section.id,
            key: section.key,
            title_cn: section.title_cn,
            content_cn: section.content_cn,
            image_url: section.image_url,
            button_text_cn: section.button_text_cn,
            is_enabled: true  // 硬编码测试
          };
          console.log('Content section mapping result:', result);
          return result;
        }),
        bestSellers: bestSellers.map(product => {
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
        }),
        dynasties: dynasties.map(dynasty => ({
          id: dynasty.id,
          name: dynasty.name,
          name_cn: dynasty.name_cn,
          period: dynasty.period,
          description: dynasty.description,
          description_cn: dynasty.description_cn,
          image_url: dynasty.image_url,
          sort_order: dynasty.sort_order,
          is_enabled: Boolean(dynasty.is_enabled)
        })),
        shapes: shapes.map(shape => ({
          id: shape.id,
          name: shape.name,
          name_cn: shape.name_cn,
          description: shape.description,
          description_cn: shape.description_cn,
          image_url: shape.image_url,
          sort_order: shape.sort_order,
          is_enabled: Boolean(shape.is_enabled)
        })),
        mediaLibrary: mediaLibrary.map(media => ({
          id: media.id,
          filename: media.filename,
          original_name: media.original_name,
          file_path: media.file_path,
          file_url: media.file_url,
          file_type: media.file_type,
          file_size: media.file_size,
          width: media.width,
          height: media.height,
          alt_text: media.alt_text,
          caption: media.caption,
          category: media.category,
          created_at: media.created_at
        }))
      }
    };
    
    console.log('Final response contentSections:', JSON.stringify(responseData.data.contentSections, null, 2));
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch configuration data' 
    });
  }
});

// 更新网站设置
router.put('/config/site-settings', requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        error: 'Settings must be an array'
      });
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const setting of settings) {
        await connection.execute(
          'UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
          [setting.value, setting.key]
        );
      }
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Site settings updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update site settings' 
    });
  }
});

// 更新内容区块
router.put('/config/content-sections', requireAdmin, async (req, res) => {
  try {
    const { sections } = req.body;
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        error: 'Sections must be an array'
      });
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const section of sections) {
        await connection.execute(
          `UPDATE content_sections SET 
           title_en = ?, title_cn = ?, content_en = ?, content_cn = ?, 
           image_url = ?, button_text_en = ?, button_text_cn = ?, 
           is_active = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE section_key = ?`,
          [
            section.title, section.title_cn, section.content, section.content_cn,
            section.image_url, section.button_text, section.button_text_cn,
            section.is_enabled ? 1 : 0, section.key
          ]
        );
      }
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Content sections updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating content sections:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update content sections' 
    });
  }
});

// 更新热销产品
router.put('/config/best-sellers', requireAdmin, async (req, res) => {
  try {
    const { bestSellers } = req.body;
    
    if (!Array.isArray(bestSellers)) {
      return res.status(400).json({
        success: false,
        error: 'Best sellers must be an array'
      });
    }
    
    await pool.execute('START TRANSACTION');
    
    try {
      // 首先将所有产品设置为非热销
      await pool.execute('UPDATE products SET is_featured = 0');
      
      // 然后更新指定的产品为热销
      for (const seller of bestSellers) {
        if (seller.id) {
          await pool.execute(
            'UPDATE products SET is_featured = 1 WHERE id = ?',
            [seller.id]
          );
        }
      }
      
      await pool.execute('COMMIT');
      
      res.json({
        success: true,
        message: 'Best sellers updated successfully'
      });
    } catch (error) {
      await pool.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating best sellers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update best sellers' 
    });
  }
});

// 更新朝代信息
router.put('/config/dynasties', requireAdmin, async (req, res) => {
  try {
    const { dynasties } = req.body;
    
    if (!Array.isArray(dynasties)) {
      return res.status(400).json({
        success: false,
        error: 'Dynasties must be an array'
      });
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      for (const dynasty of dynasties) {
        await connection.execute(
          `UPDATE dynasties SET 
           name = ?, name_cn = ?, period = ?, description = ?, description_cn = ?, 
           image_url = ?, sort_order = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [
            dynasty.name, dynasty.name_cn, dynasty.period, dynasty.description, dynasty.description_cn,
            dynasty.image_url, dynasty.sort_order, dynasty.is_enabled ? 1 : 0, dynasty.id
          ]
        );
      }
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Dynasties updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating dynasties:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update dynasties' 
    });
  }
});

// 更新器型信息
router.put('/config/shapes', requireAdmin, async (req, res) => {
  try {
    const { shapes } = req.body;
    
    if (!Array.isArray(shapes)) {
      return res.status(400).json({
        success: false,
        error: 'Shapes must be an array'
      });
    }
    
    await pool.execute('START TRANSACTION');
    
    try {
      for (const shape of shapes) {
        await pool.execute(
          `UPDATE shapes SET 
           name = ?, name_cn = ?, description = ?, description_cn = ?, 
           image_url = ?, sort_order = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [
            shape.name, shape.name_cn, shape.description, shape.description_cn,
            shape.image_url, shape.sort_order, shape.is_enabled ? 1 : 0, shape.id
          ]
        );
      }
      
      await pool.execute('COMMIT');
      
      res.json({
        success: true,
        message: 'Shapes updated successfully'
      });
    } catch (error) {
      await pool.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating shapes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update shapes' 
    });
  }
});

module.exports = router;
