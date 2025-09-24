const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

/**
 * 资源测试服务
 * 实现：可用性测试、一致性测试、缓存验证、断链检测
 */
class ResourceTestService {
  constructor() {
    this.cdnBaseUrl = process.env.CDN_BASE_URL || 'https://cdn.zaopic.cn';
    this.testTimeout = 10000;
    this.maxConcurrent = 10;
  }

  /**
   * 可用性测试
   * @param {string|Array} urls 资源URL
   * @returns {Object} 测试结果
   */
  async testAvailability(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const results = [];
    
    console.log(`🔍 开始可用性测试，共${urlList.length}个资源...`);
    
    for (let i = 0; i < urlList.length; i += this.maxConcurrent) {
      const batch = urlList.slice(i, i + this.maxConcurrent);
      const batchPromises = batch.map(url => this.testSingleResource(url));
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
   * 测试单个资源
   * @param {string} url 资源URL
   * @returns {Object} 测试结果
   */
  async testSingleResource(url) {
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
          'etag': response.headers['etag'],
          'last-modified': response.headers['last-modified']
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
   * @param {string|Array} urls 资源URL
   * @returns {Object} 测试结果
   */
  async testConsistency(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const results = [];
    
    console.log(`🔄 开始一致性测试，共${urlList.length}个资源...`);
    
    for (const url of urlList) {
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
   * 测试单个资源的一致性
   * @param {string} url 资源URL
   * @returns {Object} 测试结果
   */
  async testSingleConsistency(url) {
    try {
      // 第一次请求
      const response1 = await axios.head(url, { timeout: this.testTimeout });
      const etag1 = response1.headers['etag'];
      const lastModified1 = response1.headers['last-modified'];
      const contentLength1 = response1.headers['content-length'];
      
      // 等待2秒后第二次请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response2 = await axios.head(url, { timeout: this.testTimeout });
      const etag2 = response2.headers['etag'];
      const lastModified2 = response2.headers['last-modified'];
      const contentLength2 = response2.headers['content-length'];
      
      const consistent = etag1 === etag2 && 
                       lastModified1 === lastModified2 && 
                       contentLength1 === contentLength2;
      
      return {
        url,
        consistent,
        etag1,
        etag2,
        lastModified1,
        lastModified2,
        contentLength1,
        contentLength2,
        etagMatch: etag1 === etag2,
        lastModifiedMatch: lastModified1 === lastModified2,
        contentLengthMatch: contentLength1 === contentLength2
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
   * @param {string|Array} urls 资源URL
   * @returns {Object} 验证结果
   */
  async validateCache(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const results = [];
    
    console.log(`💾 开始缓存验证，共${urlList.length}个资源...`);
    
    for (const url of urlList) {
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
   * 验证单个资源的缓存
   * @param {string} url 资源URL
   * @returns {Object} 验证结果
   */
  async validateSingleCache(url) {
    try {
      const response = await axios.head(url, { timeout: this.testTimeout });
      
      const cacheControl = response.headers['cache-control'];
      const etag = response.headers['etag'];
      const lastModified = response.headers['last-modified'];
      const expires = response.headers['expires'];
      
      // 检查是否有缓存头
      const hasCacheControl = !!cacheControl;
      const hasETag = !!etag;
      const hasLastModified = !!lastModified;
      const hasExpires = !!expires;
      
      // 检查缓存策略
      const maxAge = cacheControl ? this.extractMaxAge(cacheControl) : null;
      const isPublic = cacheControl ? cacheControl.includes('public') : false;
      const isPrivate = cacheControl ? cacheControl.includes('private') : false;
      
      const cached = hasCacheControl || hasETag || hasLastModified || hasExpires;
      
      return {
        url,
        cached,
        cacheControl,
        etag,
        lastModified,
        expires,
        maxAge,
        isPublic,
        isPrivate,
        hasCacheControl,
        hasETag,
        hasLastModified,
        hasExpires
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
   * 提取max-age值
   * @param {string} cacheControl Cache-Control头
   * @returns {number|null} max-age值（秒）
   */
  extractMaxAge(cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * 断链检测
   * @param {string|Array} urls 资源URL
   * @returns {Object} 检测结果
   */
  async detectBrokenLinks(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const results = [];
    
    console.log(`🔗 开始断链检测，共${urlList.length}个资源...`);
    
    for (let i = 0; i < urlList.length; i += this.maxConcurrent) {
      const batch = urlList.slice(i, i + this.maxConcurrent);
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
   * @param {string} url 资源URL
   * @returns {Object} 检查结果
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
        status: response.status,
        statusText: response.statusText
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
   * @param {string|Array} urls 资源URL
   * @returns {Object} 测试结果
   */
  async testPerformance(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    const results = [];
    
    console.log(`⚡ 开始性能测试，共${urlList.length}个资源...`);
    
    for (const url of urlList) {
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
   * 测试单个资源的性能
   * @param {string} url 资源URL
   * @returns {Object} 测试结果
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
        status: response.status,
        contentLength: response.headers['content-length']
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
   * 综合测试
   * @param {string|Array} urls 资源URL
   * @returns {Object} 综合测试结果
   */
  async comprehensiveTest(urls) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    
    console.log(`🧪 开始综合测试，共${urlList.length}个资源...`);
    
    const results = {
      availability: null,
      consistency: null,
      cache: null,
      brokenLinks: null,
      performance: null,
      summary: null
    };
    
    // 并行执行所有测试
    const [availability, consistency, cache, brokenLinks, performance] = await Promise.all([
      this.testAvailability(urlList),
      this.testConsistency(urlList),
      this.validateCache(urlList),
      this.detectBrokenLinks(urlList),
      this.testPerformance(urlList)
    ]);
    
    results.availability = availability;
    results.consistency = consistency;
    results.cache = cache;
    results.brokenLinks = brokenLinks;
    results.performance = performance;
    
    // 生成综合报告
    results.summary = {
      totalResources: urlList.length,
      overallHealth: this.calculateOverallHealth(results),
      recommendations: this.generateRecommendations(results)
    };
    
    return results;
  }

  /**
   * 计算整体健康度
   * @param {Object} results 测试结果
   * @returns {Object} 健康度评估
   */
  calculateOverallHealth(results) {
    const availabilityScore = results.availability.successRate.replace('%', '');
    const consistencyScore = results.consistency.consistencyRate.replace('%', '');
    const cacheScore = results.cache.cacheRate.replace('%', '');
    const brokenLinksScore = 100 - parseFloat(results.brokenLinks.brokenRate.replace('%', ''));
    
    const overallScore = (
      parseFloat(availabilityScore) * 0.3 +
      parseFloat(consistencyScore) * 0.2 +
      parseFloat(cacheScore) * 0.2 +
      brokenLinksScore * 0.3
    ).toFixed(2);
    
    let healthLevel = 'excellent';
    if (overallScore < 80) healthLevel = 'good';
    if (overallScore < 60) healthLevel = 'fair';
    if (overallScore < 40) healthLevel = 'poor';
    
    return {
      score: overallScore,
      level: healthLevel,
      availability: availabilityScore,
      consistency: consistencyScore,
      cache: cacheScore,
      brokenLinks: brokenLinksScore
    };
  }

  /**
   * 生成建议
   * @param {Object} results 测试结果
   * @returns {Array} 建议列表
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    if (results.availability.successRate < '95%') {
      recommendations.push('资源可用性较低，建议检查服务器状态和网络连接');
    }
    
    if (results.consistency.consistencyRate < '90%') {
      recommendations.push('资源一致性较差，建议检查CDN配置和缓存策略');
    }
    
    if (results.cache.cacheRate < '80%') {
      recommendations.push('缓存配置不完善，建议添加适当的缓存头');
    }
    
    if (results.brokenLinks.brokenRate > '5%') {
      recommendations.push('存在较多断链，建议及时修复或更新资源链接');
    }
    
    if (results.performance.avgResponseTime > 2000) {
      recommendations.push('响应时间较长，建议优化资源大小或CDN配置');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('资源管理状况良好，无需特别优化');
    }
    
    return recommendations;
  }

  /**
   * 生成测试报告
   * @param {Object} results 测试结果
   * @returns {string} 报告内容
   */
  generateReport(results) {
    const report = [];
    
    report.push('='.repeat(60));
    report.push('📊 资源管理测试报告');
    report.push('='.repeat(60));
    report.push('');
    
    // 整体健康度
    report.push('🏥 整体健康度:');
    report.push(`   评分: ${results.summary.overallHealth.score}/100`);
    report.push(`   等级: ${results.summary.overallHealth.level}`);
    report.push('');
    
    // 可用性测试
    report.push('✅ 可用性测试:');
    report.push(`   成功率: ${results.availability.successRate}`);
    report.push(`   成功: ${results.availability.success}/${results.availability.total}`);
    report.push(`   失败: ${results.availability.failed}/${results.availability.total}`);
    report.push('');
    
    // 一致性测试
    report.push('🔄 一致性测试:');
    report.push(`   一致性: ${results.consistency.consistencyRate}`);
    report.push(`   一致: ${results.consistency.consistent}/${results.consistency.total}`);
    report.push(`   不一致: ${results.consistency.inconsistent}/${results.consistency.total}`);
    report.push('');
    
    // 缓存验证
    report.push('💾 缓存验证:');
    report.push(`   缓存率: ${results.cache.cacheRate}`);
    report.push(`   已缓存: ${results.cache.cached}/${results.cache.total}`);
    report.push(`   未缓存: ${results.cache.notCached}/${results.cache.total}`);
    report.push('');
    
    // 断链检测
    report.push('🔗 断链检测:');
    report.push(`   断链率: ${results.brokenLinks.brokenRate}`);
    report.push(`   正常: ${results.brokenLinks.working}/${results.brokenLinks.total}`);
    report.push(`   断链: ${results.brokenLinks.broken}/${results.brokenLinks.total}`);
    report.push('');
    
    // 性能测试
    report.push('⚡ 性能测试:');
    report.push(`   平均响应时间: ${results.performance.avgResponseTime}ms`);
    report.push(`   最大响应时间: ${results.performance.maxResponseTime}ms`);
    report.push(`   最小响应时间: ${results.performance.minResponseTime}ms`);
    report.push('');
    
    // 建议
    report.push('💡 优化建议:');
    results.summary.recommendations.forEach((rec, index) => {
      report.push(`   ${index + 1}. ${rec}`);
    });
    report.push('');
    
    report.push('='.repeat(60));
    report.push(`报告生成时间: ${new Date().toLocaleString()}`);
    report.push('='.repeat(60));
    
    return report.join('\n');
  }
}

module.exports = ResourceTestService;


