// Products API routes
const express = require('express');
const router = express.Router();
const { Product, ProductImage, ProductVideo, ProductAttribute, ProductTag } = require('../models/Product');
const database = require('../config/database');

// Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      dynasty_id,
      shape_id,
      category_id,
      is_featured,
      is_available = true,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      dynasty_id: dynasty_id ? parseInt(dynasty_id) : undefined,
      shape_id: shape_id ? parseInt(shape_id) : undefined,
      category_id: category_id ? parseInt(category_id) : undefined,
      is_featured: is_featured !== undefined ? (is_featured === 'true' ? 1 : 0) : undefined,
      is_available: is_available === 'true' ? 1 : 0,
      search,
      sort_by,
      sort_order
    };

    const products = await Product.findAll(database, options);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE is_available = 1';
    const countParams = [];
    
    if (dynasty_id) {
      countSql += ' AND dynasty_id = ?';
      countParams.push(parseInt(dynasty_id));
    }
    if (shape_id) {
      countSql += ' AND shape_id = ?';
      countParams.push(parseInt(shape_id));
    }
    if (category_id) {
      countSql += ' AND category_id = ?';
      countParams.push(parseInt(category_id));
    }
    if (is_featured !== undefined) {
      countSql += ' AND is_featured = ?';
      countParams.push(is_featured === 'true' ? 1 : 0);
    }
    if (search) {
      countSql += ' AND (name_en LIKE ? OR name_cn LIKE ? OR description_en LIKE ? OR description_cn LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const countResult = await database.queryOne(countSql, countParams);
    const total = countResult.total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
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

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(database, parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViewCount(database);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findBySlug(database, slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViewCount(database);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.findFeatured(database, parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;
    
    const product = await Product.findById(database, parseInt(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await product.getRelated(database, parseInt(limit));

    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message
    });
  }
});

// Create new product (Admin only)
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(database, productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(database, parseInt(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await product.update(database, updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(database, parseInt(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.delete(database);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// Add product image (Admin only)
router.post('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = {
      ...req.body,
      product_id: parseInt(id)
    };

    const imageId = await ProductImage.create(database, imageData);

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: { id: imageId }
    });
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product image',
      error: error.message
    });
  }
});

// Delete product image (Admin only)
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    await ProductImage.delete(database, parseInt(imageId));

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product image',
      error: error.message
    });
  }
});

// Get product images
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await ProductImage.findByProductId(database, parseInt(id));

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product images',
      error: error.message
    });
  }
});

// Get product videos
router.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await ProductVideo.findByProductId(database, parseInt(id));

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching product videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product videos',
      error: error.message
    });
  }
});

// Get product attributes
router.get('/:id/attributes', async (req, res) => {
  try {
    const { id } = req.params;
    const attributes = await ProductAttribute.findByProductId(database, parseInt(id));

    res.json({
      success: true,
      data: attributes
    });
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product attributes',
      error: error.message
    });
  }
});

// Get product tags
router.get('/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const tags = await ProductTag.findByProductId(database, parseInt(id));

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Error fetching product tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product tags',
      error: error.message
    });
  }
});

module.exports = router;