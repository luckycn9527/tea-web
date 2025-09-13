const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// Get all products with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, dynasty_id, shape_id, is_featured, lang = 'en' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, 
             d.name_${lang} as dynasty_name, 
             s.name_${lang} as shape_name,
             (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      WHERE p.is_available = 1
    `;
    
    const params = [];
    
    if (dynasty_id) {
      query += ' AND p.dynasty_id = ?';
      params.push(dynasty_id);
    }
    
    if (shape_id) {
      query += ' AND p.shape_id = ?';
      params.push(shape_id);
    }
    
    if (is_featured) {
      query += ' AND p.is_featured = 1';
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [products] = await pool.execute(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_available = 1';
    const countParams = [];
    
    if (dynasty_id) {
      countQuery += ' AND dynasty_id = ?';
      countParams.push(dynasty_id);
    }
    
    if (shape_id) {
      countQuery += ' AND shape_id = ?';
      countParams.push(shape_id);
    }
    
    if (is_featured) {
      countQuery += ' AND is_featured = 1';
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
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

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lang = 'en' } = req.query;
    
    const query = `
      SELECT p.*, 
             d.name_${lang} as dynasty_name, 
             s.name_${lang} as shape_name
      FROM products p
      LEFT JOIN dynasties d ON p.dynasty_id = d.id
      LEFT JOIN shapes s ON p.shape_id = s.id
      WHERE p.id = ? AND p.is_available = 1
    `;
    
    const [products] = await pool.execute(query, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = products[0];
    
    // Get all images for this product
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order, is_primary DESC',
      [id]
    );
    
    // Get all videos for this product
    const [videos] = await pool.execute(
      'SELECT * FROM product_videos WHERE product_id = ? ORDER BY sort_order',
      [id]
    );
    
    product.images = images;
    product.videos = videos;
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all dynasties
router.get('/filters/dynasties', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const [dynasties] = await pool.execute(`SELECT id, name_${lang} as name, period FROM dynasties ORDER BY name_${lang}`);
    res.json(dynasties);
  } catch (error) {
    console.error('Error fetching dynasties:', error);
    res.status(500).json({ error: 'Failed to fetch dynasties' });
  }
});

// Get all shapes
router.get('/filters/shapes', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const [shapes] = await pool.execute(`SELECT id, name_${lang} as name FROM shapes ORDER BY name_${lang}`);
    res.json(shapes);
  } catch (error) {
    console.error('Error fetching shapes:', error);
    res.status(500).json({ error: 'Failed to fetch shapes' });
  }
});

module.exports = router;