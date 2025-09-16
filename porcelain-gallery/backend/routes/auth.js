const express = require('express');
const bcrypt = require('bcryptjs');
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
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码都是必填项'
      });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 加密密码
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [username, email, passwordHash, role, true]
    );

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: result.insertId, 
        username, 
        email, 
        role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: '用户注册成功',
      data: {
        user: {
          id: result.insertId,
          username,
          email,
          role
        },
        token
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录
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

    // 查找用户
    const [users] = await pool.execute(
      'SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 检查用户是否激活
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: '登录成功',
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
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证token
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
    
    // 查询用户最新信息
    const [users] = await pool.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    res.json({
      success: true,
      message: 'Token验证成功',
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Token验证错误:', error);
    res.status(401).json({
      success: false,
      message: 'Token无效或已过期'
    });
  }
});

// 刷新token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证token'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查询用户最新信息
    const [users] = await pool.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    const user = users[0];

    // 生成新的JWT token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Token刷新成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: newToken
      }
    });

  } catch (error) {
    console.error('Token刷新错误:', error);
    res.status(401).json({
      success: false,
      message: 'Token无效或已过期'
    });
  }
});

// 用户登出（客户端处理，这里只是记录日志）
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
});

module.exports = router;
