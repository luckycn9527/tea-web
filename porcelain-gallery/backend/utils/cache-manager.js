/**
 * Cache Manager
 * 缓存管理工具，支持Redis和内存缓存
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map()
    this.useRedis = process.env.REDIS_URL ? true : false
    this.redisClient = null
    
    if (this.useRedis) {
      this.initRedis()
    }
  }

  async initRedis() {
    try {
      const redis = require('redis')
      this.redisClient = redis.createClient({
        url: process.env.REDIS_URL
      })
      
      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err)
        this.useRedis = false
      })
      
      await this.redisClient.connect()
      console.log('Redis connected successfully')
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      this.useRedis = false
    }
  }

  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} value 缓存值
   * @param {number} ttl 过期时间（秒）
   */
  async set(key, value, ttl = 3600) {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value))
      } else {
        this.memoryCache.set(key, {
          value,
          expires: Date.now() + (ttl * 1000)
        })
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * 获取缓存
   * @param {string} key 缓存键
   * @returns {any} 缓存值
   */
  async get(key) {
    try {
      if (this.useRedis && this.redisClient) {
        const value = await this.redisClient.get(key)
        return value ? JSON.parse(value) : null
      } else {
        const cached = this.memoryCache.get(key)
        if (cached && cached.expires > Date.now()) {
          return cached.value
        } else if (cached) {
          this.memoryCache.delete(key)
        }
        return null
      }
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * 删除缓存
   * @param {string} key 缓存键
   */
  async delete(key) {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(key)
      } else {
        this.memoryCache.delete(key)
      }
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  /**
   * 清除模式匹配的缓存
   * @param {string} pattern 模式
   */
  async clearPattern(pattern) {
    try {
      if (this.useRedis && this.redisClient) {
        const keys = await this.redisClient.keys(pattern)
        if (keys.length > 0) {
          await this.redisClient.del(keys)
        }
      } else {
        for (const key of this.memoryCache.keys()) {
          if (key.includes(pattern)) {
            this.memoryCache.delete(key)
          }
        }
      }
    } catch (error) {
      console.error('Cache clear pattern error:', error)
    }
  }

  /**
   * 清除商品相关缓存
   * @param {number} productId 商品ID
   */
  async clearProductCache(productId) {
    const patterns = [
      `product:${productId}:*`,
      `products:*`,
      `best-sellers:*`,
      `featured-products:*`
    ]
    
    for (const pattern of patterns) {
      await this.clearPattern(pattern)
    }
    
    console.log(`Cleared cache for product ${productId}`)
  }

  /**
   * 清除所有产品缓存
   */
  async clearAllProductCache() {
    const patterns = [
      `product:*`,
      `products:*`,
      `best-sellers:*`,
      `featured-products:*`
    ]
    
    for (const pattern of patterns) {
      await this.clearPattern(pattern)
    }
    
    console.log('Cleared all product cache')
  }

  /**
   * 清除配置缓存
   */
  async clearConfigCache() {
    const patterns = [
      `config:*`,
      `site-settings:*`,
      `content-sections:*`,
      `dynasties:*`,
      `shapes:*`
    ]
    
    for (const pattern of patterns) {
      await this.clearPattern(pattern)
    }
    
    console.log('Cleared config cache')
  }
}

// 创建单例实例
const cacheManager = new CacheManager()

module.exports = cacheManager
