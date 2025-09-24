const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createDefaultAdmin() {
  let connection;
  
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'porcelain_gallery',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ 数据库连接成功');

    // 检查admin用户是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      ['admin', 'admin@example.com']
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  admin用户已存在，更新密码...');
      
      // 加密密码
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('123456', saltRounds);
      
      // 更新admin用户密码
      await connection.execute(
        'UPDATE users SET password_hash = ?, role = ?, is_active = ? WHERE username = ?',
        [passwordHash, 'admin', true, 'admin']
      );
      
      console.log('✅ admin用户密码已更新');
    } else {
      console.log('📝 创建新的admin用户...');
      
      // 加密密码
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('123456', saltRounds);
      
      // 创建admin用户
      await connection.execute(
        'INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@example.com', passwordHash, 'admin', true]
      );
      
      console.log('✅ admin用户创建成功');
    }

    // 验证用户创建
    const [users] = await connection.execute(
      'SELECT id, username, email, role, is_active FROM users WHERE username = ?',
      ['admin']
    );

    if (users.length > 0) {
      const user = users[0];
      console.log('\n📊 Admin用户信息:');
      console.log(`   ID: ${user.id}`);
      console.log(`   用户名: ${user.username}`);
      console.log(`   邮箱: ${user.email}`);
      console.log(`   角色: ${user.role}`);
      console.log(`   状态: ${user.is_active ? '激活' : '未激活'}`);
      console.log(`   密码: 123456`);
    }

    console.log('\n🎉 默认admin用户设置完成！');
    console.log('📝 用户名: admin');
    console.log('📝 密码: 123456');
    console.log('📝 角色: admin');
    console.log('📝 状态: 激活');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('详细错误:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 运行脚本
createDefaultAdmin();
