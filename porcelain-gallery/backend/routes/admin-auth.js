const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const router = express.Router();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'porcelain_gallery',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码都是必填项'
      });
    }

    // 查找管理员用户
    const [users] = await pool.execute(
      'SELECT id, username, email, password_hash, role, is_active FROM users WHERE (username = ? OR email = ?) AND role = "admin"',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '管理员用户名或密码错误'
      });
    }

    const user = users[0];

    // 检查用户是否激活
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '管理员账户已被禁用'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '管理员用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        isAdmin: true
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: '管理员登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('管理员登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证管理员token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证token'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 检查是否为管理员
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，需要管理员权限'
      });
    }

    res.json({
      success: true,
      message: '管理员认证成功',
      data: {
        user: {
          id: decoded.userId,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        }
      }
    });

  } catch (error) {
    console.error('管理员认证错误:', error);
    res.status(401).json({
      success: false,
      message: '认证失败'
    });
  }
});

module.exports = router;
