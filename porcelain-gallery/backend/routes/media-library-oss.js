const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const OSS = require('ali-oss');
require('dotenv').config();

const router = express.Router();

// OSS配置（可选）
let ossClient = null;
try {
  if (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
    ossClient = new OSS({
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET || 'tea-web',
      region: process.env.OSS_REGION || 'oss-cn-hangzhou',
      endpoint: process.env.OSS_ENDPOINT || 'oss-cn-hangzhou.aliyuncs.com',
    });
    console.log('✅ OSS客户端初始化成功');
  } else {
    console.log('⚠️ OSS环境变量未配置，将使用本地存储');
  }
} catch (error) {
  console.error('❌ OSS客户端初始化失败:', error.message);
}

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'porcelain123',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4'
};

// 文件上传配置
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件 (JPEG, JPG, PNG, GIF, WebP)'));
    }
  }
});

// 获取媒体库列表
router.get('/media-library', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT 
        id,
        filename,
        original_name,
        file_path,
        file_size,
        mime_type,
        upload_time,
        is_featured,
        category,
        description,
        tags
      FROM media_library 
      ORDER BY upload_time DESC
    `);
    
    await connection.end();
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
    
  } catch (error) {
    console.error('获取媒体库失败:', error);
    res.status(500).json({
      success: false,
      message: '获取媒体库失败',
      error: error.message
    });
  }
});

// 上传文件到媒体库
router.post('/media-library/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const file = req.file;
    const { category = 'general', description = '', tags = '' } = req.body;
    
    let fileUrl = '';
    let ossPath = '';
    
    // 如果配置了OSS，上传到OSS
    if (ossClient) {
      try {
        const fileName = `${Date.now()}-${file.originalname}`;
        ossPath = `media-library/${fileName}`;
        
        const result = await ossClient.put(ossPath, file.path);
        fileUrl = result.url;
        
        console.log(`✅ 文件已上传到OSS: ${fileUrl}`);
      } catch (ossError) {
        console.error('OSS上传失败:', ossError);
        // OSS上传失败时使用本地路径
        fileUrl = `/uploads/${file.filename}`;
      }
    } else {
      // 使用本地存储
      fileUrl = `/uploads/${file.filename}`;
    }
    
    // 保存到数据库
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(`
      INSERT INTO media_library (
        filename, original_name, file_path, file_size, 
        mime_type, category, description, tags, upload_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      file.filename,
      file.originalname,
      fileUrl,
      file.size,
      file.mimetype,
      category,
      description,
      tags
    ]);
    
    await connection.end();
    
    // 删除临时文件（如果上传到OSS成功）
    if (ossClient && fileUrl.startsWith('http')) {
      fs.unlinkSync(file.path);
    }
    
    res.json({
      success: true,
      message: '文件上传成功',
      data: {
        id: result.insertId,
        filename: file.filename,
        originalName: file.originalname,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        category: category,
        description: description,
        tags: tags
      }
    });
    
  } catch (error) {
    console.error('文件上传失败:', error);
    
    // 清理临时文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message
    });
  }
});

// 删除媒体库文件
router.delete('/media-library/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // 获取文件信息
    const [rows] = await connection.execute(
      'SELECT file_path FROM media_library WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }
    
    const filePath = rows[0].file_path;
    
    // 从数据库删除记录
    await connection.execute(
      'DELETE FROM media_library WHERE id = ?',
      [id]
    );
    
    await connection.end();
    
    // 如果是OSS文件，尝试从OSS删除
    if (ossClient && filePath.startsWith('http')) {
      try {
        const ossPath = filePath.split('/').slice(-2).join('/'); // 获取OSS路径
        await ossClient.delete(ossPath);
        console.log(`✅ 已从OSS删除文件: ${ossPath}`);
      } catch (ossError) {
        console.error('从OSS删除文件失败:', ossError);
      }
    } else if (filePath.startsWith('/uploads/')) {
      // 删除本地文件
      const localPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        console.log(`✅ 已删除本地文件: ${localPath}`);
      }
    }
    
    res.json({
      success: true,
      message: '文件删除成功'
    });
    
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文件失败',
      error: error.message
    });
  }
});

// 更新媒体库文件信息
router.put('/media-library/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, tags, is_featured } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(`
      UPDATE media_library 
      SET category = ?, description = ?, tags = ?, is_featured = ?
      WHERE id = ?
    `, [category, description, tags, is_featured, id]);
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }
    
    res.json({
      success: true,
      message: '文件信息更新成功'
    });
    
  } catch (error) {
    console.error('更新文件信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新文件信息失败',
      error: error.message
    });
  }
});

// 获取特色图片
router.get('/media-library/featured', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT 
        id,
        filename,
        original_name,
        file_path,
        file_size,
        mime_type,
        upload_time,
        category,
        description,
        tags
      FROM media_library 
      WHERE is_featured = 1
      ORDER BY upload_time DESC
    `);
    
    await connection.end();
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('获取特色图片失败:', error);
    res.status(500).json({
      success: false,
      message: '获取特色图片失败',
      error: error.message
    });
  }
});

// 批量设置特色图片
router.post('/media-library/batch-featured', async (req, res) => {
  try {
    const { ids, is_featured } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的文件ID列表'
      });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await connection.execute(`
      UPDATE media_library 
      SET is_featured = ?
      WHERE id IN (${placeholders})
    `, [is_featured, ...ids]);
    
    await connection.end();
    
    res.json({
      success: true,
      message: `已${is_featured ? '设置' : '取消'} ${result.affectedRows} 个文件的特色状态`
    });
    
  } catch (error) {
    console.error('批量设置特色图片失败:', error);
    res.status(500).json({
      success: false,
      message: '批量设置特色图片失败',
      error: error.message
    });
  }
});

module.exports = router;
