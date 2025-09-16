const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// 中间件：验证管理员权限
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
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

// 确保uploads目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
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

// 获取所有媒体文件（包括现有图片）
router.get('/', requireAdmin, async (req, res) => {
  try {
    // 从数据库获取已上传的媒体文件
    const [media] = await pool.execute(`
      SELECT 
        id,
        filename,
        original_filename,
        file_path,
        file_url,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        tags,
        is_public,
        uploaded_by,
        created_at
      FROM media_library 
      ORDER BY created_at DESC
    `);

    // 扫描现有图片目录
    const existingImages = await scanExistingImages();
    
    // 合并数据库中的媒体文件和现有图片
    const allMedia = [...media, ...existingImages];

    res.json({
      success: true,
      media: allMedia
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: '获取媒体文件失败'
    });
  }
});

// 扫描现有图片目录的函数
async function scanExistingImages() {
  const fs = require('fs');
  const path = require('path');
  const sharp = require('sharp');
  
  const teaImageDir = path.join(__dirname, '../../frontend/src/assets/tea_image');
  const existingImages = [];
  
  try {
    if (!fs.existsSync(teaImageDir)) {
      console.log('Tea image directory does not exist:', teaImageDir);
      return existingImages;
    }
    
    const files = fs.readdirSync(teaImageDir);
    
    for (const file of files) {
      const filePath = path.join(teaImageDir, file);
      const stat = fs.statSync(filePath);
      
      // 只处理图片文件
      if (stat.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        try {
          // 获取图片信息
          const metadata = await sharp(filePath).metadata();
          const fileSize = stat.size;
          
          // 生成文件URL（相对于前端assets目录）
          const fileUrl = `/src/assets/tea_image/${file}`;
          
          existingImages.push({
            id: `existing_${file}`, // 使用特殊ID标识现有图片
            filename: file,
            original_filename: file,
            file_path: filePath,
            file_url: fileUrl,
            mime_type: `image/${metadata.format}`,
            file_size: fileSize,
            width: metadata.width || 0,
            height: metadata.height || 0,
            alt_text: file.replace(/\.[^/.]+$/, ''), // 移除扩展名作为alt文本
            caption: '',
            tags: 'existing,tea_image',
            is_public: true,
            uploaded_by: 0, // 0表示系统现有文件
            created_at: stat.birthtime.toISOString(),
            is_existing: true // 标记为现有文件
          });
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
    }
    
    console.log(`Scanned ${existingImages.length} existing images from tea_image directory`);
  } catch (error) {
    console.error('Error scanning existing images:', error);
  }
  
  return existingImages;
}

// 上传媒体文件
router.post('/upload', requireAdmin, upload.array('file', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const uploadedFiles = [];
    
    for (const file of req.files) {
      // 获取图片尺寸
      const sharp = require('sharp');
      const metadata = await sharp(file.path).metadata();
      
      // 生成文件URL
      const fileUrl = `/uploads/${file.filename}`;
      
      // 保存到数据库
      const [result] = await pool.execute(`
        INSERT INTO media_library (
          filename, original_filename, file_path, file_url, 
          mime_type, file_size, width, height, 
          alt_text, caption, tags, is_public, uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        file.filename,
        file.originalname,
        file.path,
        fileUrl,
        file.mimetype,
        file.size,
        metadata.width || 0,
        metadata.height || 0,
        req.body.alt_text || file.originalname,
        req.body.caption || '',
        req.body.tags || '',
        req.body.is_public === 'true' ? 1 : 0,
        req.user.userId
      ]);

      uploadedFiles.push({
        id: result.insertId,
        filename: file.filename,
        original_filename: file.originalname,
        file_url: fileUrl,
        mime_type: file.mimetype,
        file_size: file.size,
        width: metadata.width || 0,
        height: metadata.height || 0
      });
    }

    res.json({
      success: true,
      message: `成功上传 ${uploadedFiles.length} 个文件`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    
    // 清理已上传的文件
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: '上传文件失败'
    });
  }
});

// 获取单个媒体文件详情
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    const [media] = await pool.execute(`
      SELECT 
        id,
        filename,
        original_filename,
        file_path,
        file_url,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        caption,
        tags,
        is_public,
        uploaded_by,
        created_at
      FROM media_library 
      WHERE id = ?
    `, [mediaId]);

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: '媒体文件不存在'
      });
    }

    res.json({
      success: true,
      media: media[0]
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
      success: false,
      message: '获取媒体文件失败'
    });
  }
});

// 更新媒体文件信息
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const mediaId = req.params.id;
    const { alt_text, caption, tags, is_public } = req.body;
    
    await pool.execute(`
      UPDATE media_library 
      SET alt_text = ?, caption = ?, tags = ?, is_public = ?
      WHERE id = ?
    `, [alt_text, caption, tags, is_public ? 1 : 0, mediaId]);

    res.json({
      success: true,
      message: '媒体文件信息已更新'
    });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({
      success: false,
      message: '更新媒体文件失败'
    });
  }
});

// 删除媒体文件
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    // 获取文件信息
    const [media] = await pool.execute(
      'SELECT file_path FROM media_library WHERE id = ?',
      [mediaId]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: '媒体文件不存在'
      });
    }

    // 删除数据库记录
    await pool.execute('DELETE FROM media_library WHERE id = ?', [mediaId]);

    // 删除物理文件
    const filePath = media[0].file_path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: '媒体文件已删除'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: '删除媒体文件失败'
    });
  }
});

// 切换媒体文件可见性
router.patch('/:id/toggle-visibility', requireAdmin, async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    // 获取当前可见性状态
    const [media] = await pool.execute(
      'SELECT is_public FROM media_library WHERE id = ?',
      [mediaId]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: '媒体文件不存在'
      });
    }

    // 切换可见性
    const newVisibility = !media[0].is_public;
    await pool.execute(
      'UPDATE media_library SET is_public = ? WHERE id = ?',
      [newVisibility ? 1 : 0, mediaId]
    );

    res.json({
      success: true,
      message: `媒体文件已设为${newVisibility ? '公开' : '私有'}`,
      is_public: newVisibility
    });
  } catch (error) {
    console.error('Error toggling media visibility:', error);
    res.status(500).json({
      success: false,
      message: '切换媒体文件可见性失败'
    });
  }
});

module.exports = router;
