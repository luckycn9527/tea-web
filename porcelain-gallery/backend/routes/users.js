const express = require('express');
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

// 获取所有用户
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT 
        id,
        username,
        email,
        role,
        is_active,
        created_at,
        last_login_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
});

// 获取用户详情
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [users] = await pool.execute(`
      SELECT 
        id,
        username,
        email,
        role,
        is_active,
        created_at,
        last_login_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: '获取用户详情失败'
    });
  }
});

// 更新用户状态
router.patch('/:id/toggle-status', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 检查用户是否存在
    const [users] = await pool.execute(
      'SELECT is_active FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 切换用户状态
    const newStatus = !users[0].is_active;
    await pool.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [newStatus, userId]
    );

    res.json({
      success: true,
      message: `用户已${newStatus ? '启用' : '禁用'}`,
      is_active: newStatus
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: '更新用户状态失败'
    });
  }
});

// 更新用户角色
router.patch('/:id/role', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '无效的角色'
      });
    }

    // 检查用户是否存在
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新用户角色
    await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );

    res.json({
      success: true,
      message: '用户角色已更新',
      role: role
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: '更新用户角色失败'
    });
  }
});

// 删除用户
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // 检查用户是否存在
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 删除用户
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: '用户已删除'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败'
    });
  }
});

module.exports = router;


