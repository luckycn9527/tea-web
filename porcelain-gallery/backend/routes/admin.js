const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const OSS = require('ali-oss');
const cacheManager = require('../utils/cache-manager');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
});

// OSS配置（可选）
let ossClient = null;
try {
  if (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
    ossClient = new OSS({
      region: process.env.OSS_REGION || 'oss-cn-hangzhou',
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET || 'tea-web'
    });
    console.log('OSS client initialized successfully');
  } else {
    console.log('OSS credentials not found, using local storage');
  }
} catch (error) {
  console.log('OSS client initialization failed, using local storage:', error.message);
}

// Multer configuration for memory storage (direct upload to OSS)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
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

// Create new product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const {
      name_en, name_cn, description_en, description_cn,
      craftsmanship_en, craftsmanship_cn, history_en, history_cn,
      price, dimensions, weight, age, dynasty_id, shape_id,
      is_featured, is_available
    } = req.body;

    const query = `
      INSERT INTO products (
        name_en, name_cn, description_en, description_cn,
        craftsmanship_en, craftsmanship_cn, history_en, history_cn,
        price, dimensions, weight, age, dynasty_id, shape_id,
        is_featured, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name_en, name_cn, description_en, description_cn,
      craftsmanship_en, craftsmanship_cn, history_en, history_cn,
      price, dimensions, weight, age, dynasty_id, shape_id,
      is_featured || false, is_available !== false
    ];

    const [result] = await pool.execute(query, values);
    
    res.json({ 
      message: 'Product created successfully', 
      productId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_en, name_cn, description_en, description_cn,
      craftsmanship_en, craftsmanship_cn, history_en, history_cn,
      price, dimensions, weight, age, dynasty_id, shape_id,
      is_featured, is_available
    } = req.body;

    const query = `
      UPDATE products SET
        name_en = ?, name_cn = ?, description_en = ?, description_cn = ?,
        craftsmanship_en = ?, craftsmanship_cn = ?, history_en = ?, history_cn = ?,
        price = ?, dimensions = ?, weight = ?, age = ?, dynasty_id = ?, shape_id = ?,
        is_featured = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      name_en, name_cn, description_en, description_cn,
      craftsmanship_en, craftsmanship_cn, history_en, history_cn,
      price, dimensions, weight, age, dynasty_id, shape_id,
      is_featured || false, is_available !== false, id
    ];

    const [result] = await pool.execute(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, delete associated images and videos
    await pool.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
    await pool.execute('DELETE FROM product_videos WHERE product_id = ?', [id]);
    
    // Then delete the product
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Upload single image (for admin preview)
router.post('/upload-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    res.json({ 
      message: 'Image uploaded successfully',
      imagePath: `/uploads/images/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload product images to OSS or local storage
router.post('/products/:id/images', adminAuth, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_primary } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedImages = [];
    
    for (const file of req.files) {
      try {
        let imageUrl;
        
        if (ossClient) {
          // 上传到OSS
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const filename = `product_${id}_${uniqueSuffix}${ext}`;
          const ossPath = `products/${id}/${filename}`;
          
          const ossResult = await ossClient.put(ossPath, file.buffer, {
            headers: {
              'Content-Type': file.mimetype,
            }
          });
          
          imageUrl = ossResult.url.replace('http://', 'https://');
        } else {
          // 使用本地存储
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const filename = `product_${id}_${uniqueSuffix}${ext}`;
          const uploadPath = path.join(__dirname, '../uploads/images');
          
          // 确保上传目录存在
          await fs.mkdir(uploadPath, { recursive: true });
          
          const filePath = path.join(uploadPath, filename);
          await fs.writeFile(filePath, file.buffer);
          
          imageUrl = `/uploads/images/${filename}`;
        }
        
        // 获取图片尺寸
        const sharp = require('sharp');
        const metadata = await sharp(file.buffer).metadata();
        
        // 保存到product_images表
        const [result] = await pool.execute(
          `INSERT INTO product_images (
            product_id, image_url, alt_text, is_primary, sort_order,
            file_size, mime_type, width, height
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            imageUrl,
            file.originalname,
            is_primary === 'true' && uploadedImages.length === 0 ? 1 : 0,
            uploadedImages.length,
            file.size,
            file.mimetype,
            metadata.width,
            metadata.height
          ]
        );
        
        uploadedImages.push({
          id: result.insertId,
          image_url: imageUrl,
          alt_text: file.originalname,
          is_primary: is_primary === 'true' && uploadedImages.length === 0 ? 1 : 0,
          sort_order: uploadedImages.length
        });
        
      } catch (fileError) {
        console.error('Error uploading file:', file.originalname, fileError);
        // 继续处理其他文件
      }
    }
    
    if (uploadedImages.length === 0) {
      return res.status(500).json({ error: 'Failed to upload any images' });
    }
    
    // 清除相关缓存
    if (cacheManager) {
      await cacheManager.clearProductCache(id)
    }
    console.log(`Product ${id} images updated, cache cleared`);
    
    res.json({ 
      success: true,
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Upload product videos
router.post('/products/:id/videos', adminAuth, upload.array('videos'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No videos uploaded' });
    }

    const videoRecords = req.files.map((file, index) => [
      id,
      `/uploads/videos/${file.filename}`,
      index
    ]);

    const query = 'INSERT INTO product_videos (product_id, video_path, sort_order) VALUES ?';
    await pool.query(query, [videoRecords]);
    
    res.json({ 
      message: 'Videos uploaded successfully',
      videos: req.files.map(file => `/uploads/videos/${file.filename}`)
    });
  } catch (error) {
    console.error('Error uploading videos:', error);
    res.status(500).json({ error: 'Failed to upload videos' });
  }
});

// Get all products (admin view)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, lang = 'en' } = req.query;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT p.*, 
             d.name_${lang} as dynasty_name, 
             s.name_${lang} as shape_name,
             (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count,
             (SELECT COUNT(*) FROM product_videos WHERE product_id = p.id) as video_count
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [products] = await pool.execute(query, [parseInt(limit), parseInt(offset)]);
    
    // Get total count
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM products');
    const total = countResult[0].total;
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Best Sellers Management API

// Get Best Sellers configuration
router.get('/best-sellers', adminAuth, async (req, res) => {
  try {
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

// Update Best Sellers configuration
router.put('/best-sellers', adminAuth, async (req, res) => {
  try {
    const { bestSellers } = req.body;
    
    console.log('Received bestSellers update request:', JSON.stringify(bestSellers, null, 2));
    
    if (!Array.isArray(bestSellers)) {
      console.log('Error: bestSellers is not an array:', typeof bestSellers);
      return res.status(400).json({
        success: false,
        error: 'Best sellers must be an array'
      });
    }
    
    // Start transaction
    await pool.execute('START TRANSACTION');
    
    try {
      // First, set all products as not featured
      console.log('Setting all products as not featured');
      await pool.execute('UPDATE products SET is_featured = 0');
      
      // Then update the specified products as featured
      for (const seller of bestSellers) {
        if (seller.id) {
          console.log('Setting product as featured:', seller.id);
          await pool.execute(
            'UPDATE products SET is_featured = 1 WHERE id = ?',
            [seller.id]
          );
        }
      }
      
      await pool.execute('COMMIT');
      console.log('Best sellers updated successfully');
      
      res.json({
        success: true,
        message: 'Best sellers updated successfully'
      });
    } catch (error) {
      await pool.execute('ROLLBACK');
      console.error('Database error during best sellers update:', error);
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

// Update individual Best Seller
router.put('/best-sellers/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_cn, price, mainImage, additionalImages, description, description_cn } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name_en = ?');
      values.push(name);
    }
    if (name_cn !== undefined) {
      updates.push('name_cn = ?');
      values.push(name_cn);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(parseFloat(price));
    }
    if (description !== undefined) {
      updates.push('description_en = ?');
      values.push(description);
    }
    if (description_cn !== undefined) {
      updates.push('description_cn = ?');
      values.push(description_cn);
    }
    
    // 处理主图更新
    if (mainImage !== undefined) {
      console.log('Main image update requested:', mainImage);
      // 查找或创建主图记录
      const [existingImages] = await pool.execute(
        'SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1',
        [id]
      );
      
      if (existingImages.length > 0) {
        // 更新现有主图
        await pool.execute(
          'UPDATE product_images SET image_url = ? WHERE id = ?',
          [mainImage, existingImages[0].id]
        );
      } else {
        // 创建新的主图记录
        const [result] = await pool.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, 1, 0)',
          [id, mainImage]
        );
        // 更新产品的primary_image_id
        await pool.execute(
          'UPDATE products SET primary_image_id = ? WHERE id = ?',
          [result.insertId, id]
        );
      }
    }
    
    // 处理附加图片
    if (additionalImages !== undefined && Array.isArray(additionalImages)) {
      console.log('Additional images update requested:', additionalImages);
      
      // 删除现有的非主图
      await pool.execute(
        'DELETE FROM product_images WHERE product_id = ? AND is_primary = 0',
        [id]
      );
      
      // 插入新的附加图片
      for (let i = 0; i < additionalImages.length; i++) {
        const image = additionalImages[i];
        const imageUrl = image.image_url || image.image_path || image;
        await pool.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order, alt_text) VALUES (?, ?, 0, ?, ?)',
          [id, imageUrl, i + 1, image.alt_text || `Additional image ${i + 1}`]
        );
      }
    }
    
    if (updates.length === 0 && mainImage === undefined && additionalImages === undefined) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    // 更新产品基本信息
    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
      await pool.execute(query, values);
    }
    
    res.json({
      success: true,
      message: 'Best seller updated successfully'
    });
  } catch (error) {
    console.error('Error updating best seller:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update best seller' 
    });
  }
});

module.exports = router;