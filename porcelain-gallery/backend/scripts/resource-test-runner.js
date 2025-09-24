#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

/**
 * 资源管理自动化测试脚本
 * 实现：可用性测试、一致性测试、缓存验证、断链检测
 */

class ResourceTestRunner {
  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
    this.cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.zaopic.cn';
    this.testTimeout = 10000;
    this.maxConcurrent = 10;
    this.results = {
      availability: null,
      consistency: null,
      cache: null,
      brokenLinks: null,
      performance: null,
      summary: null
    };
  }

  /**
   * 运行所有测试
   */
  async runAllTests() {
    console.log('🚀 开始资源管理自动化测试...');
    console.log('='.repeat(60));
    
    try {
      // 1. 获取资源列表
      const resources = await this.getResourceList();
      if (!resources.length) {
        console.log('⚠️ 没有找到资源，跳过测试');
        return;
      }
      
      const urls = resources.map(r => r.cdn_url);
      console.log(`📊 找到 ${urls.length} 个资源，开始测试...`);
      
      // 2. 并行执行所有测试
      const [
        availability,
        consistency,
        cache,
        brokenLinks,
        performance
      ] = await Promise.all([
        this.testAvailability(urls),
        this.testConsistency(urls),
        this.validateCache(urls),
        this.detectBrokenLinks(urls),
        this.testPerformance(urls)
      ]);
      
      this.results.availability = availability;
      this.results.consistency = consistency;
      this.results.cache = cache;
      this.results.brokenLinks = brokenLinks;
      this.results.performance = performance;
      
      // 3. 生成综合报告
      this.results.summary = this.generateSummary();
      
      // 4. 输出结果
      this.printResults();
      
      // 5. 保存报告
      await this.saveReport();
      
      // 6. 检查是否需要告警
      this.checkAlerts();
      
    } catch (error) {
      console.error('❌ 测试执行失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 获取资源列表
   */
  async getResourceList() {
    try {
      const response = await axios.get(`${this.baseUrl}/resources?limit=100`);
      return response.data.data || [];
    } catch (error) {
      console.error('获取资源列表失败:', error.message);
      return [];
    }
  }

  /**
   * 可用性测试
   */
  async testAvailability(urls) {
    console.log('✅ 开始可用性测试...');
    const results = [];
    
    for (let i = 0; i < urls.length; i += this.maxConcurrent) {
      const batch = urls.slice(i, i + this.maxConcurrent);
      const batchPromises = batch.map(url => this.testSingleAvailability(url));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    return {
      total: results.length,
      success: successCount,
      failed: failureCount,
      successRate: (successCount / results.length * 100).toFixed(2) + '%',
      results
    };
  }

  /**
   * 测试单个资源可用性
   */
  async testSingleAvailability(url) {
    const startTime = Date.now();
    
    try {
      const response = await axios.head(url, {
        timeout: this.testTimeout,
        validateStatus: (status) => status < 500
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        url,
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
        url,
        success: false,
        status: error.response?.status || 0,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * 一致性测试
   */
  async testConsistency(urls) {
    console.log('🔄 开始一致性测试...');
    const results = [];
    
    for (const url of urls) {
      const result = await this.testSingleConsistency(url);
      results.push(result);
    }
    
    const consistentCount = results.filter(r => r.consistent).length;
    const inconsistentCount = results.length - consistentCount;
    
    return {
      total: results.length,
      consistent: consistentCount,
      inconsistent: inconsistentCount,
      consistencyRate: (consistentCount / results.length * 100).toFixed(2) + '%',
      results
    };
  }

  /**
   * 测试单个资源一致性
   */
  async testSingleConsistency(url) {
    try {
      // 第一次请求
      const response1 = await axios.head(url, { timeout: this.testTimeout });
      const etag1 = response1.headers['etag'];
      const lastModified1 = response1.headers['last-modified'];
      
      // 等待2秒后第二次请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response2 = await axios.head(url, { timeout: this.testTimeout });
      const etag2 = response2.headers['etag'];
      const lastModified2 = response2.headers['last-modified'];
      
      const consistent = etag1 === etag2 && lastModified1 === lastModified2;
      
      return {
        url,
        consistent,
        etag1,
        etag2,
        lastModified1,
        lastModified2
      };
    } catch (error) {
      return {
        url,
        consistent: false,
        error: error.message
      };
    }
  }

  /**
   * 缓存验证
   */
  async validateCache(urls) {
    console.log('💾 开始缓存验证...');
    const results = [];
    
    for (const url of urls) {
      const result = await this.validateSingleCache(url);
      results.push(result);
    }
    
    const cachedCount = results.filter(r => r.cached).length;
    const notCachedCount = results.length - cachedCount;
    
    return {
      total: results.length,
      cached: cachedCount,
      notCached: notCachedCount,
      cacheRate: (cachedCount / results.length * 100).toFixed(2) + '%',
      results
    };
  }

  /**
   * 验证单个资源缓存
   */
  async validateSingleCache(url) {
    try {
      const response = await axios.head(url, { timeout: this.testTimeout });
      
      const cacheControl = response.headers['cache-control'];
      const etag = response.headers['etag'];
      const lastModified = response.headers['last-modified'];
      const expires = response.headers['expires'];
      
      const cached = !!(cacheControl || etag || lastModified || expires);
      
      return {
        url,
        cached,
        cacheControl,
        etag,
        lastModified,
        expires
      };
    } catch (error) {
      return {
        url,
        cached: false,
        error: error.message
      };
    }
  }

  /**
   * 断链检测
   */
  async detectBrokenLinks(urls) {
    console.log('🔗 开始断链检测...');
    const results = [];
    
    for (let i = 0; i < urls.length; i += this.maxConcurrent) {
      const batch = urls.slice(i, i + this.maxConcurrent);
      const batchPromises = batch.map(url => this.checkSingleLink(url));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    const workingCount = results.filter(r => r.working).length;
    const brokenCount = results.length - workingCount;
    
    return {
      total: results.length,
      working: workingCount,
      broken: brokenCount,
      brokenRate: (brokenCount / results.length * 100).toFixed(2) + '%',
      results
    };
  }

  /**
   * 检查单个链接
   */
  async checkSingleLink(url) {
    try {
      const response = await axios.head(url, {
        timeout: this.testTimeout,
        validateStatus: (status) => status < 500
      });
      
      return {
        url,
        working: response.status === 200,
        status: response.status
      };
    } catch (error) {
      return {
        url,
        working: false,
        status: error.response?.status || 0,
        error: error.message
      };
    }
  }

  /**
   * 性能测试
   */
  async testPerformance(urls) {
    console.log('⚡ 开始性能测试...');
    const results = [];
    
    for (const url of urls) {
      const result = await this.testSinglePerformance(url);
      results.push(result);
    }
    
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const maxResponseTime = Math.max(...results.map(r => r.responseTime));
    const minResponseTime = Math.min(...results.map(r => r.responseTime));
    
    return {
      total: results.length,
      avgResponseTime: Math.round(avgResponseTime),
      maxResponseTime,
      minResponseTime,
      results
    };
  }

  /**
   * 测试单个资源性能
   */
  async testSinglePerformance(url) {
    const startTime = Date.now();
    
    try {
      const response = await axios.head(url, { timeout: this.testTimeout });
      const responseTime = Date.now() - startTime;
      
      return {
        url,
        success: true,
        responseTime,
        status: response.status
      };
    } catch (error) {
      return {
        url,
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * 生成综合报告
   */
  generateSummary() {
    const availabilityScore = parseFloat(this.results.availability.successRate.replace('%', ''));
    const consistencyScore = parseFloat(this.results.consistency.consistencyRate.replace('%', ''));
    const cacheScore = parseFloat(this.results.cache.cacheRate.replace('%', ''));
    const brokenLinksScore = 100 - parseFloat(this.results.brokenLinks.brokenRate.replace('%', ''));
    
    const overallScore = (
      availabilityScore * 0.3 +
      consistencyScore * 0.2 +
      cacheScore * 0.2 +
      brokenLinksScore * 0.3
    ).toFixed(2);
    
    let healthLevel = 'excellent';
    if (overallScore < 80) healthLevel = 'good';
    if (overallScore < 60) healthLevel = 'fair';
    if (overallScore < 40) healthLevel = 'poor';
    
    const recommendations = this.generateRecommendations();
    
    return {
      overallScore: parseFloat(overallScore),
      healthLevel,
      availabilityScore,
      consistencyScore,
      cacheScore,
      brokenLinksScore,
      recommendations
    };
  }

  /**
   * 生成建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.availability.successRate < '95%') {
      recommendations.push('资源可用性较低，建议检查服务器状态和网络连接');
    }
    
    if (this.results.consistency.consistencyRate < '90%') {
      recommendations.push('资源一致性较差，建议检查CDN配置和缓存策略');
    }
    
    if (this.results.cache.cacheRate < '80%') {
      recommendations.push('缓存配置不完善，建议添加适当的缓存头');
    }
    
    if (this.results.brokenLinks.brokenRate > '5%') {
      recommendations.push('存在较多断链，建议及时修复或更新资源链接');
    }
    
    if (this.results.performance.avgResponseTime > 2000) {
      recommendations.push('响应时间较长，建议优化资源大小或CDN配置');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('资源管理状况良好，无需特别优化');
    }
    
    return recommendations;
  }

  /**
   * 输出测试结果
   */
  printResults() {
    console.log('\n📊 测试结果汇总:');
    console.log('='.repeat(60));
    
    // 整体健康度
    console.log(`🏥 整体健康度: ${this.results.summary.overallScore}/100 (${this.results.summary.healthLevel})`);
    console.log('');
    
    // 各项测试结果
    console.log('✅ 可用性测试:');
    console.log(`   成功率: ${this.results.availability.successRate}`);
    console.log(`   成功: ${this.results.availability.success}/${this.results.availability.total}`);
    console.log(`   失败: ${this.results.availability.failed}/${this.results.availability.total}`);
    console.log('');
    
    console.log('🔄 一致性测试:');
    console.log(`   一致性: ${this.results.consistency.consistencyRate}`);
    console.log(`   一致: ${this.results.consistency.consistent}/${this.results.consistency.total}`);
    console.log(`   不一致: ${this.results.consistency.inconsistent}/${this.results.consistency.total}`);
    console.log('');
    
    console.log('💾 缓存验证:');
    console.log(`   缓存率: ${this.results.cache.cacheRate}`);
    console.log(`   已缓存: ${this.results.cache.cached}/${this.results.cache.total}`);
    console.log(`   未缓存: ${this.results.cache.notCached}/${this.results.cache.total}`);
    console.log('');
    
    console.log('🔗 断链检测:');
    console.log(`   断链率: ${this.results.brokenLinks.brokenRate}`);
    console.log(`   正常: ${this.results.brokenLinks.working}/${this.results.brokenLinks.total}`);
    console.log(`   断链: ${this.results.brokenLinks.broken}/${this.results.brokenLinks.total}`);
    console.log('');
    
    console.log('⚡ 性能测试:');
    console.log(`   平均响应时间: ${this.results.performance.avgResponseTime}ms`);
    console.log(`   最大响应时间: ${this.results.performance.maxResponseTime}ms`);
    console.log(`   最小响应时间: ${this.results.performance.minResponseTime}ms`);
    console.log('');
    
    // 建议
    console.log('💡 优化建议:');
    this.results.summary.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log('');
  }

  /**
   * 保存测试报告
   */
  async saveReport() {
    try {
      const reportDir = path.join(__dirname, '../reports');
      await fs.mkdir(reportDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFile = path.join(reportDir, `resource-test-${timestamp}.json`);
      
      const report = {
        timestamp: new Date().toISOString(),
        summary: this.results.summary,
        results: this.results,
        environment: {
          apiBaseUrl: this.baseUrl,
          cdnBaseUrl: this.cdnBaseUrl,
          testTimeout: this.testTimeout,
          maxConcurrent: this.maxConcurrent
        }
      };
      
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
      console.log(`📄 测试报告已保存: ${reportFile}`);
    } catch (error) {
      console.error('保存报告失败:', error.message);
    }
  }

  /**
   * 检查告警
   */
  checkAlerts() {
    const alerts = [];
    
    if (this.results.summary.overallScore < 60) {
      alerts.push('🚨 整体健康度较低，需要立即关注');
    }
    
    if (this.results.availability.successRate < '90%') {
      alerts.push('🚨 资源可用性严重不足');
    }
    
    if (this.results.brokenLinks.brokenRate > '10%') {
      alerts.push('🚨 断链率过高，影响用户体验');
    }
    
    if (this.results.performance.avgResponseTime > 5000) {
      alerts.push('🚨 响应时间过长，影响性能');
    }
    
    if (alerts.length > 0) {
      console.log('\n🚨 告警信息:');
      alerts.forEach(alert => console.log(`   ${alert}`));
      console.log('');
    }
  }
}

// 主函数
async function main() {
  const testRunner = new ResourceTestRunner();
  await testRunner.runAllTests();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = ResourceTestRunner;


