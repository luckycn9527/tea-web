#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;

/**
 * 网站资源可用性测试脚本
 */
class WebsiteResourceTester {
  constructor() {
    this.baseUrl = 'http://106.75.68.99:5173';
    this.apiUrl = 'http://localhost:3000/api';
    this.testTimeout = 10000;
    this.results = {
      pageLoad: null,
      images: [],
      apiEndpoints: [],
      errors: []
    };
  }

  /**
   * 运行完整测试
   */
  async runTests() {
    console.log('🚀 开始网站资源可用性测试...');
    console.log('='.repeat(60));
    
    try {
      // 1. 测试页面加载
      await this.testPageLoad();
      
      // 2. 测试API端点
      await this.testApiEndpoints();
      
      // 3. 测试图片资源
      await this.testImageResources();
      
      // 4. 生成报告
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 测试执行失败:', error.message);
      this.results.errors.push(error.message);
    }
  }

  /**
   * 测试页面加载
   */
  async testPageLoad() {
    console.log('📄 测试页面加载...');
    
    try {
      const startTime = Date.now();
      const response = await axios.get(this.baseUrl, {
        timeout: this.testTimeout,
        validateStatus: (status) => status < 500
      });
      
      const loadTime = Date.now() - startTime;
      
      this.results.pageLoad = {
        success: response.status === 200,
        status: response.status,
        loadTime,
        contentLength: response.headers['content-length'],
        contentType: response.headers['content-type']
      };
      
      console.log(`✅ 页面加载成功: ${loadTime}ms`);
      
    } catch (error) {
      console.error('❌ 页面加载失败:', error.message);
      this.results.pageLoad = {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 测试API端点
   */
  async testApiEndpoints() {
    console.log('🔌 测试API端点...');
    
    const endpoints = [
      '/test',
      '/settings?is_public=true',
      '/content-sections?is_active=true',
      '/dynasties?is_enabled=true',
      '/products?limit=10'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${this.apiUrl}${endpoint}`, {
          timeout: this.testTimeout,
          validateStatus: (status) => status < 500
        });
        
        const responseTime = Date.now() - startTime;
        
        this.results.apiEndpoints.push({
          endpoint,
          success: response.status === 200,
          status: response.status,
          responseTime,
          dataSize: JSON.stringify(response.data).length
        });
        
        console.log(`✅ ${endpoint}: ${response.status} (${responseTime}ms)`);
        
      } catch (error) {
        console.error(`❌ ${endpoint}: ${error.message}`);
        this.results.apiEndpoints.push({
          endpoint,
          success: false,
          error: error.message,
          status: error.response?.status || 0
        });
      }
    }
  }

  /**
   * 测试图片资源
   */
  async testImageResources() {
    console.log('🖼️ 测试图片资源...');
    
    // 常见的图片资源路径
    const imagePaths = [
      '/src/assets/tea_image/1.png',
      '/src/assets/tea_image/2.png',
      '/src/assets/tea_image/3.png',
      '/src/assets/tea_image/4.png',
      '/src/assets/tea_image/5.png',
      '/src/assets/tea_image/background.png',
      '/src/assets/tea_image/rare-dynasty.png',
      '/src/assets/tea_image/heritage.png'
    ];
    
    // OSS图片资源
    const ossImages = [
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/1.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/2.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/3.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/4.png',
      'https://tea-web.oss-cn-hangzhou.aliyuncs.com/tea_image/5.png'
    ];
    
    const allImages = [...imagePaths, ...ossImages];
    
    for (const imagePath of allImages) {
      try {
        const startTime = Date.now();
        const response = await axios.head(imagePath, {
          timeout: this.testTimeout,
          validateStatus: (status) => status < 500
        });
        
        const responseTime = Date.now() - startTime;
        
        this.results.images.push({
          path: imagePath,
          success: response.status === 200,
          status: response.status,
          responseTime,
          contentType: response.headers['content-type'],
          contentLength: response.headers['content-length'],
          cacheControl: response.headers['cache-control']
        });
        
        console.log(`✅ ${imagePath}: ${response.status} (${responseTime}ms)`);
        
      } catch (error) {
        console.error(`❌ ${imagePath}: ${error.message}`);
        this.results.images.push({
          path: imagePath,
          success: false,
          error: error.message,
          status: error.response?.status || 0
        });
      }
    }
  }

  /**
   * 生成测试报告
   */
  generateReport() {
    console.log('\n📊 测试报告:');
    console.log('='.repeat(60));
    
    // 页面加载结果
    if (this.results.pageLoad) {
      console.log('📄 页面加载:');
      if (this.results.pageLoad.success) {
        console.log(`   ✅ 成功 (${this.results.pageLoad.loadTime}ms)`);
      } else {
        console.log(`   ❌ 失败: ${this.results.pageLoad.error}`);
      }
    }
    
    // API端点结果
    console.log('\n🔌 API端点:');
    const apiSuccess = this.results.apiEndpoints.filter(r => r.success).length;
    const apiTotal = this.results.apiEndpoints.length;
    console.log(`   成功率: ${apiSuccess}/${apiTotal} (${(apiSuccess/apiTotal*100).toFixed(1)}%)`);
    
    this.results.apiEndpoints.forEach(endpoint => {
      if (endpoint.success) {
        console.log(`   ✅ ${endpoint.endpoint}: ${endpoint.status} (${endpoint.responseTime}ms)`);
      } else {
        console.log(`   ❌ ${endpoint.endpoint}: ${endpoint.error}`);
      }
    });
    
    // 图片资源结果
    console.log('\n🖼️ 图片资源:');
    const imageSuccess = this.results.images.filter(r => r.success).length;
    const imageTotal = this.results.images.length;
    console.log(`   成功率: ${imageSuccess}/${imageTotal} (${(imageSuccess/imageTotal*100).toFixed(1)}%)`);
    
    this.results.images.forEach(image => {
      if (image.success) {
        console.log(`   ✅ ${image.path}: ${image.status} (${image.responseTime}ms)`);
      } else {
        console.log(`   ❌ ${image.path}: ${image.error}`);
      }
    });
    
    // 错误汇总
    if (this.results.errors.length > 0) {
      console.log('\n❌ 错误汇总:');
      this.results.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    
    // 建议
    console.log('\n💡 修复建议:');
    this.generateRecommendations();
  }

  /**
   * 生成修复建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    // API端点建议
    const failedApis = this.results.apiEndpoints.filter(r => !r.success);
    if (failedApis.length > 0) {
      recommendations.push('修复失败的API端点:');
      failedApis.forEach(api => {
        recommendations.push(`  - ${api.endpoint}: ${api.error}`);
      });
    }
    
    // 图片资源建议
    const failedImages = this.results.images.filter(r => !r.success);
    if (failedImages.length > 0) {
      recommendations.push('修复失败的图片资源:');
      failedImages.forEach(image => {
        recommendations.push(`  - ${image.path}: ${image.error}`);
      });
    }
    
    // 性能建议
    const slowApis = this.results.apiEndpoints.filter(r => r.success && r.responseTime > 2000);
    if (slowApis.length > 0) {
      recommendations.push('优化慢速API端点:');
      slowApis.forEach(api => {
        recommendations.push(`  - ${api.endpoint}: ${api.responseTime}ms`);
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push('所有资源都正常工作，无需修复');
    }
    
    recommendations.forEach(rec => console.log(`   ${rec}`));
  }
}

// 主函数
async function main() {
  const tester = new WebsiteResourceTester();
  await tester.runTests();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = WebsiteResourceTester;


