// Common API routes (Dynasties, Shapes, Categories, Settings, Content)
const express = require('express');
const router = express.Router();
const { Dynasty, Shape, Category, SiteSettings, ContentSection } = require('../models/Common');
const database = require('../config/database');

// ==================== DYNASTIES ====================

// Get all dynasties
router.get('/dynasties', async (req, res) => {
  try {
    console.log('Dynasties API called');
    const { is_enabled = 'true' } = req.query;
    console.log('is_enabled param:', is_enabled);
    
    const dynasties = await Dynasty.findAll(database, { is_enabled: is_enabled === 'true' });
    console.log('Dynasties found:', dynasties.length);

    res.json({
      success: true,
      data: dynasties
    });
  } catch (error) {
    console.error('Error fetching dynasties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dynasties',
      error: error.message
    });
  }
});

// Get dynasty by ID
router.get('/dynasties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dynasty = await Dynasty.findById(database, parseInt(id));

    if (!dynasty) {
      return res.status(404).json({
        success: false,
        message: 'Dynasty not found'
      });
    }

    res.json({
      success: true,
      data: dynasty
    });
  } catch (error) {
    console.error('Error fetching dynasty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dynasty',
      error: error.message
    });
  }
});

// Create dynasty (Admin only)
router.post('/dynasties', async (req, res) => {
  try {
    const dynasty = await Dynasty.create(database, req.body);

    res.status(201).json({
      success: true,
      message: 'Dynasty created successfully',
      data: dynasty
    });
  } catch (error) {
    console.error('Error creating dynasty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dynasty',
      error: error.message
    });
  }
});

// Update dynasty (Admin only)
router.put('/dynasties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dynasty = await Dynasty.findById(database, parseInt(id));

    if (!dynasty) {
      return res.status(404).json({
        success: false,
        message: 'Dynasty not found'
      });
    }

    const updatedDynasty = await dynasty.update(database, req.body);

    res.json({
      success: true,
      message: 'Dynasty updated successfully',
      data: updatedDynasty
    });
  } catch (error) {
    console.error('Error updating dynasty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dynasty',
      error: error.message
    });
  }
});

// Delete dynasty (Admin only)
router.delete('/dynasties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dynasty = await Dynasty.findById(database, parseInt(id));

    if (!dynasty) {
      return res.status(404).json({
        success: false,
        message: 'Dynasty not found'
      });
    }

    await dynasty.delete(database);

    res.json({
      success: true,
      message: 'Dynasty deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dynasty:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete dynasty',
      error: error.message
    });
  }
});

// ==================== SHAPES ====================

// Get all shapes
router.get('/shapes', async (req, res) => {
  try {
    const { is_enabled = true } = req.query;
    const shapes = await Shape.findAll(database, { is_enabled: is_enabled === 'true' });

    res.json({
      success: true,
      data: shapes
    });
  } catch (error) {
    console.error('Error fetching shapes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shapes',
      error: error.message
    });
  }
});

// Get shape by ID
router.get('/shapes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await Shape.findById(database, parseInt(id));

    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    res.json({
      success: true,
      data: shape
    });
  } catch (error) {
    console.error('Error fetching shape:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shape',
      error: error.message
    });
  }
});

// Create shape (Admin only)
router.post('/shapes', async (req, res) => {
  try {
    const shape = await Shape.create(database, req.body);

    res.status(201).json({
      success: true,
      message: 'Shape created successfully',
      data: shape
    });
  } catch (error) {
    console.error('Error creating shape:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shape',
      error: error.message
    });
  }
});

// Update shape (Admin only)
router.put('/shapes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await Shape.findById(database, parseInt(id));

    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    const updatedShape = await shape.update(database, req.body);

    res.json({
      success: true,
      message: 'Shape updated successfully',
      data: updatedShape
    });
  } catch (error) {
    console.error('Error updating shape:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shape',
      error: error.message
    });
  }
});

// Delete shape (Admin only)
router.delete('/shapes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await Shape.findById(database, parseInt(id));

    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    await shape.delete(database);

    res.json({
      success: true,
      message: 'Shape deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shape:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shape',
      error: error.message
    });
  }
});

// ==================== CATEGORIES ====================

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const { is_enabled = true, parent_id } = req.query;
    const categories = await Category.findAll(database, { 
      is_enabled: is_enabled === 'true',
      parent_id: parent_id ? parseInt(parent_id) : undefined
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(database, parseInt(id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

// Create category (Admin only)
router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(database, req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// Update category (Admin only)
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(database, parseInt(id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updatedCategory = await category.update(database, req.body);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// Delete category (Admin only)
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(database, parseInt(id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.delete(database);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// ==================== SITE SETTINGS ====================

// Get all site settings
router.get('/settings', async (req, res) => {
  try {
    const { is_public } = req.query;
    const settings = await SiteSettings.findAll(database, { 
      is_public: is_public !== undefined ? is_public === 'true' : undefined
    });

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message
    });
  }
});

// Get site setting by key
router.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SiteSettings.findByKey(database, key);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Error fetching site setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site setting',
      error: error.message
    });
  }
});

// Create site setting (Admin only)
router.post('/settings', async (req, res) => {
  try {
    const setting = await SiteSettings.create(database, req.body);

    res.status(201).json({
      success: true,
      message: 'Setting created successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error creating site setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create site setting',
      error: error.message
    });
  }
});

// Update site setting (Admin only)
router.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SiteSettings.findByKey(database, key);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    const updatedSetting = await setting.update(database, req.body);

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: updatedSetting
    });
  } catch (error) {
    console.error('Error updating site setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site setting',
      error: error.message
    });
  }
});

// ==================== CONTENT SECTIONS ====================

// Get all content sections
router.get('/content-sections', async (req, res) => {
  try {
    const { is_active = true } = req.query;
    const sections = await ContentSection.findAll(database, { 
      is_active: is_active === 'true'
    });

    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching content sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content sections',
      error: error.message
    });
  }
});

// Get content section by key
router.get('/content-sections/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const section = await ContentSection.findByKey(database, key);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Content section not found'
      });
    }

    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching content section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content section',
      error: error.message
    });
  }
});

// Create content section (Admin only)
router.post('/content-sections', async (req, res) => {
  try {
    const section = await ContentSection.create(database, req.body);

    res.status(201).json({
      success: true,
      message: 'Content section created successfully',
      data: section
    });
  } catch (error) {
    console.error('Error creating content section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content section',
      error: error.message
    });
  }
});

// Update content section (Admin only)
router.put('/content-sections/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const section = await ContentSection.findByKey(database, key);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Content section not found'
      });
    }

    const updatedSection = await section.update(database, req.body);

    res.json({
      success: true,
      message: 'Content section updated successfully',
      data: updatedSection
    });
  } catch (error) {
    console.error('Error updating content section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content section',
      error: error.message
    });
  }
});

module.exports = router;
