// 使用Node.js内置的fetch (Node.js 18+)
// const fetch = require('node-fetch');

async function testUsersAPI() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🧪 测试用户管理API...\n');

    // 1. 测试管理员登录
    console.log('1️⃣ 测试管理员登录...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ 管理员登录失败:', loginResponse.status, loginResponse.statusText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ 管理员登录成功');
    console.log('   用户:', loginData.data.user.username);
    console.log('   角色:', loginData.data.user.role);
    
    const adminToken = loginData.data.token;

    // 2. 测试获取用户列表
    console.log('\n2️⃣ 测试获取用户列表...');
    const usersResponse = await fetch(`${baseURL}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!usersResponse.ok) {
      console.error('❌ 获取用户列表失败:', usersResponse.status, usersResponse.statusText);
      const errorText = await usersResponse.text();
      console.error('   错误详情:', errorText);
      return;
    }

    const usersData = await usersResponse.json();
    console.log('✅ 获取用户列表成功');
    console.log('   用户数量:', usersData.users.length);
    
    if (usersData.users.length > 0) {
      console.log('   用户列表:');
      usersData.users.forEach((user, index) => {
        console.log(`     ${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${user.is_active ? '活跃' : '非活跃'}`);
        console.log(`        注册时间: ${user.created_at}`);
        console.log(`        最后登录: ${user.last_login_at || '从未登录'}`);
      });
    }

    // 3. 测试获取用户详情
    if (usersData.users.length > 0) {
      const firstUser = usersData.users[0];
      console.log(`\n3️⃣ 测试获取用户详情 (${firstUser.username})...`);
      
      const userDetailResponse = await fetch(`${baseURL}/api/users/${firstUser.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (userDetailResponse.ok) {
        const userDetailData = await userDetailResponse.json();
        console.log('✅ 获取用户详情成功');
        console.log('   用户信息:', JSON.stringify(userDetailData.user, null, 2));
      } else {
        console.error('❌ 获取用户详情失败:', userDetailResponse.status, userDetailResponse.statusText);
      }
    }

    // 4. 测试切换用户状态
    if (usersData.users.length > 0) {
      const firstUser = usersData.users[0];
      console.log(`\n4️⃣ 测试切换用户状态 (${firstUser.username})...`);
      
      const toggleResponse = await fetch(`${baseURL}/api/users/${firstUser.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (toggleResponse.ok) {
        const toggleData = await toggleResponse.json();
        console.log('✅ 切换用户状态成功');
        console.log('   新状态:', toggleData.is_active ? '活跃' : '非活跃');
        console.log('   消息:', toggleData.message);
      } else {
        console.error('❌ 切换用户状态失败:', toggleResponse.status, toggleResponse.statusText);
      }
    }

    console.log('\n🎉 用户管理API测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testUsersAPI();
