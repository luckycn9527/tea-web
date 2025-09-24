const express = require('express');
const multer = require('multer');
const path = require('path');
const ResourceManager = require('../services/resource-manager');
const ResourceTestService = require('../services/resource-test-service');
const { pool } = require('../server');

const router = express.Router();

// 初始化服务
const resourceManager = new ResourceManager();
const testService = new ResourceTestService();

// Multer配置 - 内存存储
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // 允许图片、视频、文档等文件
    const allowedTypes = [
      'image/', 'video/', 'audio/', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
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

/**
 * 上传资源
 * POST /api/resources/upload
 */
router.post('/upload', requireAdmin, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const { type = 'images', category = 'general' } = req.body;
    const uploadedResources = [];

    for (const file of req.files) {
      try {
        const result = await resourceManager.uploadResource(
          file.buffer,
          file.originalname,
          file.mimetype,
          type,
          category
        );

        if (result.success) {
          // 保存到数据库
          const [dbResult] = await pool.execute(
            `INSERT INTO resource_management (
              original_name, oss_path, oss_url, cdn_url, file_hash,
              file_type, file_size, width, height, format,
              resource_type, category, uploader_id, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              file.originalname,
              result.ossPath,
              result.ossUrl,
              result.cdnUrl,
              result.hash,
              file.mimetype,
              result.metadata.size,
              result.metadata.width,
              result.metadata.height,
              result.metadata.format,
              type,
              category,
              req.user.userId
            ]
          );

          uploadedResources.push({
            id: dbResult.insertId,
            originalName: file.originalname,
            cdnUrl: result.cdnUrl,
            ossUrl: result.ossUrl,
            hash: result.hash,
            metadata: result.metadata,
            upload: result.upload,
            cdnRefresh: result.cdnRefresh,
            availability: result.availability,
            consistency: result.consistency
          });
        } else {
          uploadedResources.push({
            originalName: file.originalname,
            error: result.error
          });
        }
      } catch (error) {
        console.error('上传文件失败:', file.originalname, error);
        uploadedResources.push({
          originalName: file.originalname,
          error: error.message
        });
      }
    }

    const successCount = uploadedResources.filter(r => r.cdnUrl).length;
    const failureCount = uploadedResources.length - successCount;

    res.json({
      success: true,
      message: `上传完成: ${successCount}个成功, ${failureCount}个失败`,
      data: uploadedResources,
      summary: {
        total: uploadedResources.length,
        success: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error('资源上传失败:', error);
    res.status(500).json({
      success: false,
      message: '资源上传失败',
      error: error.message
    });
  }
});

/**
 * 获取资源列表
 * GET /api/resources
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      category, 
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    let whereClause = '';
    let params = [];

    if (type) {
      whereClause += ' AND resource_type = ?';
      params.push(type);
    }

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND original_name LIKE ?';
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;

    // 获取资源列表
    const [resources] = await pool.execute(
      `SELECT * FROM resource_management 
       WHERE 1=1 ${whereClause}
       ORDER BY ${sort_by} ${sort_order}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM resource_management WHERE 1=1 ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('获取资源列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取资源列表失败',
      error: error.message
    });
  }
});

/**
 * 获取资源详情
 * GET /api/resources/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resources] = await pool.execute(
      'SELECT * FROM resource_management WHERE id = ?',
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: '资源不存在'
      });
    }

    const resource = resources[0];

    // 检查资源可用性
    const availability = await testService.testSingleResource(resource.cdn_url);

    res.json({
      success: true,
      data: {
        ...resource,
        availability
      }
    });
  } catch (error) {
    console.error('获取资源详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取资源详情失败',
      error: error.message
    });
  }
});

/**
 * 删除资源
 * DELETE /api/resources/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 获取资源信息
    const [resources] = await pool.execute(
      'SELECT * FROM resource_management WHERE id = ?',
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: '资源不存在'
      });
    }

    const resource = resources[0];

    // 从OSS删除文件
    if (resourceManager.isOSSEnabled()) {
      try {
        await resourceManager.ossClient.delete(resource.oss_path);
        console.log('OSS文件删除成功:', resource.oss_path);
      } catch (error) {
        console.warn('OSS文件删除失败:', error.message);
      }
    }

    // 从数据库删除记录
    await pool.execute(
      'DELETE FROM resource_management WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: '资源删除成功'
    });
  } catch (error) {
    console.error('删除资源失败:', error);
    res.status(500).json({
      success: false,
      message: '删除资源失败',
      error: error.message
    });
  }
});

/**
 * 批量测试资源
 * POST /api/resources/test
 */
router.post('/test', requireAdmin, async (req, res) => {
  try {
    const { urls, testType = 'comprehensive' } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要测试的URL列表'
      });
    }

    let results;

    switch (testType) {
      case 'availability':
        results = await testService.testAvailability(urls);
        break;
      case 'consistency':
        results = await testService.testConsistency(urls);
        break;
      case 'cache':
        results = await testService.validateCache(urls);
        break;
      case 'broken-links':
        results = await testService.detectBrokenLinks(urls);
        break;
      case 'performance':
        results = await testService.testPerformance(urls);
        break;
      case 'comprehensive':
      default:
        results = await testService.comprehensiveTest(urls);
        break;
    }

    res.json({
      success: true,
      testType,
      results
    });
  } catch (error) {
    console.error('资源测试失败:', error);
    res.status(500).json({
      success: false,
      message: '资源测试失败',
      error: error.message
    });
  }
});

/**
 * 生成测试报告
 * POST /api/resources/report
 */
router.post('/report', requireAdmin, async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要测试的URL列表'
      });
    }

    const results = await testService.comprehensiveTest(urls);
    const report = testService.generateReport(results);

    res.json({
      success: true,
      report,
      results
    });
  } catch (error) {
    console.error('生成测试报告失败:', error);
    res.status(500).json({
      success: false,
      message: '生成测试报告失败',
      error: error.message
    });
  }
});

/**
 * 刷新CDN缓存
 * POST /api/resources/refresh-cdn
 */
router.post('/refresh-cdn', requireAdmin, async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要刷新的URL列表'
      });
    }

    const result = await resourceManager.refreshCDN(urls);

    res.json({
      success: result.success,
      message: result.success ? 'CDN刷新成功' : 'CDN刷新失败',
      data: result
    });
  } catch (error) {
    console.error('CDN刷新失败:', error);
    res.status(500).json({
      success: false,
      message: 'CDN刷新失败',
      error: error.message
    });
  }
});

/**
 * 获取资源统计
 * GET /api/resources/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN resource_type = 'images' THEN 1 END) as images,
        COUNT(CASE WHEN resource_type = 'videos' THEN 1 END) as videos,
        COUNT(CASE WHEN resource_type = 'documents' THEN 1 END) as documents,
        SUM(file_size) as total_size,
        AVG(file_size) as avg_size
      FROM resource_management
    `);

    const [categoryStats] = await pool.execute(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM resource_management
      GROUP BY category
      ORDER BY count DESC
    `);

    const [typeStats] = await pool.execute(`
      SELECT 
        resource_type,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM resource_management
      GROUP BY resource_type
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        byCategory: categoryStats,
        byType: typeStats
      }
    });
  } catch (error) {
    console.error('获取资源统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取资源统计失败',
      error: error.message
    });
  }
});

module.exports = router;


