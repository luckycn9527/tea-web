const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLastLoginAtColumn() {
  let connection;
  
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ 数据库连接成功');

    // 检查last_login_at字段是否已存在
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'last_login_at'
    `, [process.env.DB_NAME || 'porcelain_gallery']);

    if (columns.length > 0) {
      console.log('✅ last_login_at字段已存在，无需添加');
      return;
    }

    // 添加last_login_at字段
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN last_login_at TIMESTAMP NULL 
      AFTER updated_at
    `);

    console.log('✅ 成功添加last_login_at字段到users表');

    // 检查表结构
    const [tableStructure] = await connection.execute('DESCRIBE users');
    console.log('📋 users表结构:');
    tableStructure.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

  } catch (error) {
    console.error('❌ 数据库操作失败:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ last_login_at字段已存在');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ 数据库连接已关闭');
    }
  }
}

// 运行迁移
addLastLoginAtColumn();


