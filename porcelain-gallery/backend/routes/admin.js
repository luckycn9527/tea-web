const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('image/') 
      ? path.join(__dirname, '../uploads/images')
      : path.join(__dirname, '../uploads/videos');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Admin authentication middleware (simplified for now)
const adminAuth = (req, res, next) => {
  // For now, we'll skip authentication
  // In production, implement proper JWT authentication
  next();
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

// Upload product images
router.post('/products/:id/images', adminAuth, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_primary } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const imageRecords = req.files.map((file, index) => [
      id,
      `/uploads/images/${file.filename}`,
      is_primary === 'true' && index === 0 ? 1 : 0,
      index
    ]);

    const query = 'INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES ?';
    await pool.query(query, [imageRecords]);
    
    res.json({ 
      message: 'Images uploaded successfully',
      images: req.files.map(file => `/uploads/images/${file.filename}`)
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

module.exports = router;