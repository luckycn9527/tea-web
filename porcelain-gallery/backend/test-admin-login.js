// 测试admin用户登录
const http = require('http');

function testAdminLogin() {
  const postData = JSON.stringify({
    username: 'admin',
    password: '123456'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('=== 测试Admin用户登录 ===');
  console.log('📝 发送登录请求...');
  console.log('   用户名: admin');
  console.log('   密码: 123456');
  console.log('   API地址: http://localhost:3000/api/auth/login');

  const req = http.request(options, (res) => {
    console.log('📊 响应状态:', res.statusCode);
    console.log('📊 响应头:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const responseData = JSON.parse(data);
        console.log('📊 响应数据:', JSON.stringify(responseData, null, 2));

        if (responseData.success) {
          console.log('\n✅ 登录成功！');
          console.log('📝 用户信息:');
          console.log('   ID:', responseData.data.user.id);
          console.log('   用户名:', responseData.data.user.username);
          console.log('   邮箱:', responseData.data.user.email);
          console.log('   角色:', responseData.data.user.role);
          console.log('📝 Token:', responseData.data.token.substring(0, 20) + '...');
        } else {
          console.log('\n❌ 登录失败:', responseData.message);
        }
      } catch (error) {
        console.error('❌ 解析响应错误:', error.message);
        console.log('原始响应:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求错误:', error.message);
  });

  req.write(postData);
  req.end();
}

testAdminLogin();