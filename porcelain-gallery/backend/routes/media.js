// Media and Image Management API routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const database = require('../config/database');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Media Library model
class MediaLibrary {
  constructor(data) {
    this.id = data.id;
    this.filename = data.filename;
    this.original_filename = data.original_filename;
    this.file_path = data.file_path;
    this.file_url = data.file_url;
    this.mime_type = data.mime_type;
    this.file_size = data.file_size;
    this.width = data.width;
    this.height = data.height;
    this.alt_text = data.alt_text;
    this.caption = data.caption;
    this.tags = data.tags;
    this.is_public = data.is_public;
    this.uploaded_by = data.uploaded_by;
    this.created_at = data.created_at;
  }

  static async findAll(db, options = {}) {
    const { is_public = true, limit = 50, offset = 0, search } = options;
    
    let sql = 'SELECT * FROM media_library WHERE 1=1';
    const params = [];

    if (is_public !== undefined) {
      sql += ' AND is_public = ?';
      params.push(is_public);
    }

    if (search) {
      sql += ' AND (original_filename LIKE ? OR alt_text LIKE ? OR caption LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const media = await db.query(sql, params);
    return media.map(m => new MediaLibrary(m));
  }

  static async findById(db, id) {
    const sql = 'SELECT * FROM media_library WHERE id = ?';
    const media = await db.queryOne(sql, [id]);
    return media ? new MediaLibrary(media) : null;
  }

  static async create(db, mediaData) {
    const sql = `
      INSERT INTO media_library (
        filename, original_filename, file_path, file_url, mime_type,
        file_size, width, height, alt_text, caption, tags, is_public, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      mediaData.filename,
      mediaData.original_filename,
      mediaData.file_path,
      mediaData.file_url,
      mediaData.mime_type,
      mediaData.file_size,
      mediaData.width,
      mediaData.height,
      mediaData.alt_text,
      mediaData.caption,
      mediaData.tags,
      mediaData.is_public !== undefined ? mediaData.is_public : 1,
      mediaData.uploaded_by
    ];

    const id = await db.insert(sql, params);
    return MediaLibrary.findById(db, id);
  }

  async update(db, updateData) {
    const sql = `
      UPDATE media_library SET
        alt_text = ?, caption = ?, tags = ?, is_public = ?
      WHERE id = ?
    `;

    const params = [
      updateData.alt_text || this.alt_text,
      updateData.caption || this.caption,
      updateData.tags || this.tags,
      updateData.is_public !== undefined ? updateData.is_public : this.is_public,
      this.id
    ];

    await db.update(sql, params);
    return MediaLibrary.findById(db, this.id);
  }

  async delete(db) {
    // Delete file from filesystem
    try {
      if (fs.existsSync(this.file_path)) {
        fs.unlinkSync(this.file_path);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete from database
    const sql = 'DELETE FROM media_library WHERE id = ?';
    return await db.delete(sql, [this.id]);
  }
}

// Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const file = req.file;
    const { alt_text, caption, tags, is_public = true } = req.body;

    // Get image dimensions using sharp
    let width, height;
    try {
      const metadata = await sharp(file.path).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch (error) {
      console.error('Error getting image metadata:', error);
      width = null;
      height = null;
    }

    // Generate file URL
    const fileUrl = `/uploads/images/${file.filename}`;

    // Save to database
    const mediaData = {
      filename: file.filename,
      original_filename: file.originalname,
      file_path: file.path,
      file_url: fileUrl,
      mime_type: file.mimetype,
      file_size: file.size,
      width,
      height,
      alt_text,
      caption,
      tags: tags ? JSON.stringify(tags.split(',')) : null,
      is_public: is_public === 'true',
      uploaded_by: req.user ? req.user.id : null
    };

    const media = await MediaLibrary.create(database, mediaData);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: media.id,
        filename: media.filename,
        original_filename: media.original_filename,
        file_url: media.file_url,
        width: media.width,
        height: media.height,
        file_size: media.file_size,
        mime_type: media.mime_type
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const { alt_text, caption, tags, is_public = true } = req.body;
    const uploadedImages = [];

    for (const file of req.files) {
      try {
        // Get image dimensions using sharp
        let width, height;
        try {
          const metadata = await sharp(file.path).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (error) {
          console.error('Error getting image metadata:', error);
          width = null;
          height = null;
        }

        // Generate file URL
        const fileUrl = `/uploads/images/${file.filename}`;

        // Save to database
        const mediaData = {
          filename: file.filename,
          original_filename: file.originalname,
          file_path: file.path,
          file_url: fileUrl,
          mime_type: file.mimetype,
          file_size: file.size,
          width,
          height,
          alt_text,
          caption,
          tags: tags ? JSON.stringify(tags.split(',')) : null,
          is_public: is_public === 'true',
          uploaded_by: req.user ? req.user.id : null
        };

        const media = await MediaLibrary.create(database, mediaData);

        uploadedImages.push({
          id: media.id,
          filename: media.filename,
          original_filename: media.original_filename,
          file_url: media.file_url,
          width: media.width,
          height: media.height,
          file_size: media.file_size,
          mime_type: media.mime_type
        });
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
        
        // Clean up file if database save failed
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    
    // Clean up uploaded files if error occurred
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Get media library
router.get('/media', async (req, res) => {
  try {
    const { 
      is_public = true, 
      limit = 50, 
      offset = 0, 
      search 
    } = req.query;

    const media = await MediaLibrary.findAll(database, {
      is_public: is_public === 'true',
      limit: parseInt(limit),
      offset: parseInt(offset),
      search
    });

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media library:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media library',
      error: error.message
    });
  }
});

// Get media by ID
router.get('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await MediaLibrary.findById(database, parseInt(id));

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media',
      error: error.message
    });
  }
});

// Update media (Admin only)
router.put('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await MediaLibrary.findById(database, parseInt(id));

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    const updatedMedia = await media.update(database, req.body);

    res.json({
      success: true,
      message: 'Media updated successfully',
      data: updatedMedia
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update media',
      error: error.message
    });
  }
});

// Delete media (Admin only)
router.delete('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await MediaLibrary.findById(database, parseInt(id));

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    await media.delete(database);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media',
      error: error.message
    });
  }
});

// Generate image thumbnails
router.post('/generate-thumbnails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sizes = [150, 300, 600] } = req.body;
    
    const media = await MediaLibrary.findById(database, parseInt(id));
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    const thumbnails = [];
    const basePath = path.dirname(media.file_path);
    const ext = path.extname(media.filename);
    const name = path.basename(media.filename, ext);

    for (const size of sizes) {
      try {
        const thumbnailFilename = `${name}_${size}${ext}`;
        const thumbnailPath = path.join(basePath, 'thumbnails', thumbnailFilename);
        const thumbnailUrl = `/uploads/images/thumbnails/${thumbnailFilename}`;

        // Create thumbnails directory if it doesn't exist
        const thumbnailDir = path.dirname(thumbnailPath);
        if (!fs.existsSync(thumbnailDir)) {
          fs.mkdirSync(thumbnailDir, { recursive: true });
        }

        // Generate thumbnail
        await sharp(media.file_path)
          .resize(size, size, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);

        thumbnails.push({
          size,
          filename: thumbnailFilename,
          path: thumbnailPath,
          url: thumbnailUrl
        });
      } catch (error) {
        console.error(`Error generating thumbnail for size ${size}:`, error);
      }
    }

    res.json({
      success: true,
      message: 'Thumbnails generated successfully',
      data: thumbnails
    });
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate thumbnails',
      error: error.message
    });
  }
});

module.exports = router;

