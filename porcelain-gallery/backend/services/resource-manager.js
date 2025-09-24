const OSS = require('ali-oss');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const axios = require('axios');

/**
 * 统一资源管理服务
 * 实现：OSS上传 → CDN刷新 → 统一域名访问 → 测试验证
 */
class ResourceManager {
  constructor() {
    this.ossClient = null;
    this.cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.zaopic.cn';
    this.ossBucket = process.env.OSS_BUCKET || 'tea-web';
    this.ossRegion = process.env.OSS_REGION || 'oss-cn-hangzhou';
    this.cdnRefreshUrl = process.env.CDN_REFRESH_URL;
    this.cdnRefreshToken = process.env.CDN_REFRESH_TOKEN;
    
    this.initializeOSS();
  }

  /**
   * 初始化OSS客户端
   */
  initializeOSS() {
    try {
      if (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
        this.ossClient = new OSS({
          region: this.ossRegion,
          accessKeyId: process.env.OSS_ACCESS_KEY_ID,
          accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
          bucket: this.ossBucket
        });
        console.log('✅ OSS客户端初始化成功');
      } else {
        console.log('⚠️ OSS凭据未找到，使用本地存储');
      }
    } catch (error) {
      console.error('❌ OSS客户端初始化失败:', error.message);
    }
  }

  /**
   * 生成文件hash（用于版本管理）
   * @param {Buffer} buffer 文件内容
   * @returns {string} hash值
   */
  generateFileHash(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
  }

  /**
   * 生成统一目录结构
   * @param {string} type 资源类型 (images, videos, documents, etc.)
   * @param {string} category 分类 (products, banners, avatars, etc.)
   * @param {string} filename 文件名
   * @param {string} hash 文件hash
   * @returns {string} OSS路径
   */
  generateOSSPath(type, category, filename, hash) {
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const timestamp = Date.now();
    
    // 统一目录结构：type/category/year/month/filename-hash-timestamp.ext
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    return `${type}/${category}/${year}/${month}/${nameWithoutExt}-${hash}-${timestamp}${ext}`;
  }

  /**
   * 上传文件到OSS
   * @param {Buffer} fileBuffer 文件内容
   * @param {string} originalName 原始文件名
   * @param {string} mimeType MIME类型
   * @param {string} type 资源类型
   * @param {string} category 分类
   * @returns {Object} 上传结果
   */
  async uploadToOSS(fileBuffer, originalName, mimeType, type = 'images', category = 'general') {
    try {
      if (!this.ossClient) {
        throw new Error('OSS客户端未初始化');
      }

      // 生成文件hash
      const hash = this.generateFileHash(fileBuffer);
      
      // 生成OSS路径
      const ossPath = this.generateOSSPath(type, category, originalName, hash);
      
      // 上传到OSS
      const result = await this.ossClient.put(ossPath, fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'max-age=31536000', // 1年缓存
          'Content-Disposition': `inline; filename="${originalName}"`
        }
      });

      // 生成CDN URL
      const cdnUrl = `${this.cdnBaseUrl}/${ossPath}`;
      
      // 获取文件元数据
      const metadata = await this.getFileMetadata(fileBuffer, mimeType);

      return {
        success: true,
        ossPath,
        ossUrl: result.url.replace('http://', 'https://'),
        cdnUrl,
        hash,
        metadata,
        size: fileBuffer.length
      };
    } catch (error) {
      console.error('OSS上传失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取文件元数据
   * @param {Buffer} buffer 文件内容
   * @param {string} mimeType MIME类型
   * @returns {Object} 元数据
   */
  async getFileMetadata(buffer, mimeType) {
    const metadata = {
      size: buffer.length,
      mimeType,
      width: null,
      height: null,
      format: null
    };

    try {
      if (mimeType.startsWith('image/')) {
        const imageMetadata = await sharp(buffer).metadata();
        metadata.width = imageMetadata.width;
        metadata.height = imageMetadata.height;
        metadata.format = imageMetadata.format;
      }
    } catch (error) {
      console.warn('获取图片元数据失败:', error.message);
    }

    return metadata;
  }

  /**
   * 触发CDN刷新
   * @param {string|Array} urls 需要刷新的URL
   * @returns {Object} 刷新结果
   */
  async refreshCDN(urls) {
    try {
      if (!this.cdnRefreshUrl || !this.cdnRefreshToken) {
        console.warn('CDN刷新配置未设置，跳过刷新');
        return { success: true, message: 'CDN刷新配置未设置' };
      }

      const urlList = Array.isArray(urls) ? urls : [urls];
      
      const response = await axios.post(this.cdnRefreshUrl, {
        urls: urlList,
        type: 'refresh' // 刷新缓存
      }, {
        headers: {
          'Authorization': `Bearer ${this.cdnRefreshToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return {
        success: true,
        data: response.data,
        refreshedUrls: urlList
      };
    } catch (error) {
      console.error('CDN刷新失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检查资源可用性
   * @param {string} url 资源URL
   * @returns {Object} 检查结果
   */
  async checkResourceAvailability(url) {
    try {
      const startTime = Date.now();
      const response = await axios.head(url, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: response.status === 200,
        status: response.status,
        responseTime,
        headers: {
          'content-type': response.headers['content-type'],
          'content-length': response.headers['content-length'],
          'cache-control': response.headers['cache-control'],
          'etag': response.headers['etag']
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 0
      };
    }
  }

  /**
   * 批量检查资源可用性
   * @param {Array} urls 资源URL数组
   * @returns {Array} 检查结果数组
   */
  async batchCheckAvailability(urls) {
    const results = [];
    
    for (const url of urls) {
      const result = await this.checkResourceAvailability(url);
      results.push({
        url,
        ...result
      });
    }
    
    return results;
  }

  /**
   * 验证缓存一致性
   * @param {string} url 资源URL
   * @returns {Object} 验证结果
   */
  async validateCacheConsistency(url) {
    try {
      // 第一次请求
      const response1 = await axios.head(url, { timeout: 10000 });
      const etag1 = response1.headers['etag'];
      const lastModified1 = response1.headers['last-modified'];
      
      // 等待1秒后第二次请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response2 = await axios.head(url, { timeout: 10000 });
      const etag2 = response2.headers['etag'];
      const lastModified2 = response2.headers['last-modified'];
      
      return {
        success: true,
        consistent: etag1 === etag2 && lastModified1 === lastModified2,
        etag1,
        etag2,
        lastModified1,
        lastModified2
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 检测断链
   * @param {Array} urls 资源URL数组
   * @returns {Array} 断链检测结果
   */
  async detectBrokenLinks(urls) {
    const results = [];
    
    for (const url of urls) {
      const availability = await this.checkResourceAvailability(url);
      results.push({
        url,
        isBroken: !availability.success,
        status: availability.status,
        error: availability.error
      });
    }
    
    return results;
  }

  /**
   * 完整的资源上传流程
   * @param {Buffer} fileBuffer 文件内容
   * @param {string} originalName 原始文件名
   * @param {string} mimeType MIME类型
   * @param {string} type 资源类型
   * @param {string} category 分类
   * @returns {Object} 完整流程结果
   */
  async uploadResource(fileBuffer, originalName, mimeType, type = 'images', category = 'general') {
    const result = {
      upload: null,
      cdnRefresh: null,
      availability: null,
      consistency: null
    };

    try {
      // 1. 上传到OSS
      console.log('📤 开始上传资源到OSS...');
      result.upload = await this.uploadToOSS(fileBuffer, originalName, mimeType, type, category);
      
      if (!result.upload.success) {
        throw new Error(`OSS上传失败: ${result.upload.error}`);
      }

      // 2. 触发CDN刷新
      console.log('🔄 触发CDN刷新...');
      result.cdnRefresh = await this.refreshCDN(result.upload.cdnUrl);
      
      // 等待CDN刷新完成
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. 检查资源可用性
      console.log('✅ 检查资源可用性...');
      result.availability = await this.checkResourceAvailability(result.upload.cdnUrl);
      
      // 4. 验证缓存一致性
      console.log('🔍 验证缓存一致性...');
      result.consistency = await this.validateCacheConsistency(result.upload.cdnUrl);

      return {
        success: true,
        cdnUrl: result.upload.cdnUrl,
        ossUrl: result.upload.ossUrl,
        hash: result.upload.hash,
        metadata: result.upload.metadata,
        ...result
      };
    } catch (error) {
      console.error('资源上传流程失败:', error);
      return {
        success: false,
        error: error.message,
        ...result
      };
    }
  }

  /**
   * 获取CDN基础URL
   * @returns {string} CDN基础URL
   */
  getCDNBaseUrl() {
    return this.cdnBaseUrl;
  }

  /**
   * 检查是否使用OSS
   * @returns {boolean} 是否使用OSS
   */
  isOSSEnabled() {
    return !!this.ossClient;
  }
}

module.exports = ResourceManager;


